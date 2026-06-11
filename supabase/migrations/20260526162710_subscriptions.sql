create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,

  title text not null,
  description text not null,

  price numeric(6, 2) not null,

  payment_interval text not null,
  payment_date date not null,

  status text not null,
  next_billing_date date,

  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index idx_subscriptions_title_trgm
on public.subscriptions
using gin (title public.gin_trgm_ops);

create index idx_subscriptions_description_trgm
on public.subscriptions
using gin (description public.gin_trgm_ops);

alter table public.subscriptions
enable row level security;

alter table public.subscriptions
add constraint subscriptions_valid_title
check (
  char_length(trim(title)) > 0
  and char_length(title) <= 15
);

alter table public.subscriptions
add constraint subscriptions_valid_description
check (
  char_length(trim(description)) > 0
  and char_length(description) <= 100
);

alter table public.subscriptions
add constraint subscriptions_valid_price
check (
  price > 0
  and price < 9999.99
);

alter table public.subscriptions
add constraint subscriptions_valid_payment_interval
check (
  payment_interval in ('day', 'week', 'month', 'year')
);

alter table public.subscriptions
add constraint subscriptions_valid_status
check (
  status in ('active', 'paused', 'canceled', 'expired')
);

alter table public.subscriptions
add constraint subscriptions_valid_payment_date
check (
  payment_date >= current_date - interval '1 year'
  and payment_date <= current_date
);

alter table public.subscriptions
add constraint subscriptions_valid_next_billing_date
check (
  (
    status = 'active'
    and next_billing_date > payment_date
    and next_billing_date <= payment_date + interval '1 year'
  )
  or status in ('paused', 'canceled', 'expired')
);

create policy "Enable users to view their own subscriptions"
on public.subscriptions
for select
to public
using (true);

create policy "Enable users to create their own subscriptions"
on public.subscriptions
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Enable users to update their own subscriptions"
on public.subscriptions
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Enable users to delete their own subscriptions"
on public.subscriptions
for delete
to authenticated
using (auth.uid() = user_id);

create trigger subscription_handle_updated_at
before update
on public.subscriptions
for each row
execute function public.handle_updated_at_column();

create or replace function public.validate_subscription_params(
  p_title text,
  p_description text,
  p_price numeric,
  p_payment_interval text,
  p_status text
)
returns void
language plpgsql
as
$$
begin
  if p_title is null or length(trim(p_title)) = 0 then
    raise exception 'title is required';
  end if;

  if length(p_title) > 15 then
    raise exception 'title too long (max 15 characters)';
  end if;

  if p_description is null or length(trim(p_description)) = 0 then
    raise exception 'description is required';
  end if;

  if length(p_description) > 100 then
    raise exception 'description too long (max 100 characters)';
  end if;

  if p_price <= 0 then
    raise exception 'price must be greater than 0';
  end if;

  if p_price > 9999.99 then
    raise exception 'price too high';
  end if;

  if p_payment_interval not in ('day', 'week', 'month', 'year') then
    raise exception 'invalid payment interval';
  end if;

  if p_status not in ('active', 'paused', 'canceled', 'expired') then
    raise exception 'invalid status';
  end if;
end;
$$;

create or replace function public.validate_payment_date_param(
  p_payment_date date
)
returns void
language plpgsql
as
$$
begin
  if p_payment_date is null then
    raise exception 'payment date is required';
  end if;

  if p_payment_date < current_date - interval '1 year' then
    raise exception 'payment date too old';
  end if;

  if p_payment_date > current_date then
    raise exception 'payment date cannot be in future';
  end if;
end;
$$;

create or replace function public.calculate_next_billing_date(
  p_payment_date date,
  p_payment_interval text,
  p_status text
)
returns date
language plpgsql
as
$$
begin
  if p_status in ('paused', 'canceled', 'expired') then
    return null;
  end if;

  return p_payment_date +
    case p_payment_interval
      when 'day' then interval '1 day'
      when 'week' then interval '1 week'
      when 'month' then interval '1 month'
      when 'year' then interval '1 year'
      else interval '1 month'
    end;
end;
$$;

create or replace function public.create_subscription(
  p_title text,
  p_description text,
  p_price numeric,
  p_payment_interval text,
  p_payment_date date,
  p_status text
)
returns public.subscriptions
language plpgsql
security definer
set search_path = public
as
$$
declare
  v_user_id uuid;
  v_subscription public.subscriptions;
  v_next_billing_date date;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'not authenticated';
  end if;

  perform public.validate_subscription_params(
    p_title,
    p_description,
    p_price,
    p_payment_interval,
    p_status
  );

  perform public.validate_payment_date_param(
    p_payment_date
  );

  v_next_billing_date := public.calculate_next_billing_date(
    p_payment_date,
    p_payment_interval,
    p_status
  );

  insert into public.subscriptions (
    user_id,
    title,
    description,
    price,
    payment_interval,
    payment_date,
    status,
    next_billing_date
  )
  values (
    v_user_id,
    p_title,
    p_description,
    p_price,
    p_payment_interval,
    p_payment_date,
    p_status,
    v_next_billing_date
  )
  returning *
  into v_subscription;

  return v_subscription;
end;
$$;

comment on function public.create_subscription is
e'@graphql({
  "name": "createSubscription",
  "description": "Adds Subscription record to the collection. Returns the newly created record."
})';

create or replace function public.update_subscription(
  p_subscription_id uuid,
  p_title text default null,
  p_description text default null,
  p_price numeric default null,
  p_payment_interval text default null,
  p_payment_date date default null,
  p_status text default null
)
returns public.subscriptions
language plpgsql
security definer
set search_path = public
as
$$
declare
  v_user_id uuid;

  v_old_subscription public.subscriptions;
  v_updated_subscription public.subscriptions;

  v_title text;
  v_description text;
  v_price numeric;
  v_payment_interval text;
  v_payment_date date;
  v_status text;

  v_next_billing_date date;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'not authenticated';
  end if;

  select *
  into v_old_subscription
  from public.subscriptions
  where
    id = p_subscription_id
    and user_id = v_user_id;

  if not found then
    raise exception 'subscription not found';
  end if;

  v_title := coalesce(
    p_title,
    v_old_subscription.title
  );

  v_description := coalesce(
    p_description,
    v_old_subscription.description
  );

  v_price := coalesce(
    p_price,
    v_old_subscription.price
  );

  v_payment_interval := coalesce(
    p_payment_interval,
    v_old_subscription.payment_interval
  );

  v_payment_date := coalesce(
    p_payment_date,
    v_old_subscription.payment_date
  );

  v_status := coalesce(
    p_status,
    v_old_subscription.status
  );

  perform public.validate_subscription_params(
    v_title,
    v_description,
    v_price,
    v_payment_interval,
    v_status
  );

  perform public.validate_payment_date_param(
    v_payment_date
  );

  v_next_billing_date := public.calculate_next_billing_date(
    v_payment_date,
    v_payment_interval,
    v_status
  );

  update public.subscriptions
  set
    title = v_title,
    description = v_description,
    price = v_price,
    payment_interval = v_payment_interval,
    payment_date = v_payment_date,
    status = v_status,
    next_billing_date = v_next_billing_date
  where
    id = p_subscription_id
    and user_id = v_user_id
  returning *
  into v_updated_subscription;

  return v_updated_subscription;
end;
$$;

comment on function public.update_subscription is
e'@graphql({
  "name": "updateSubscription",
  "description": "Updates Subscription record in the collection. Returns the updated record."
})';

create or replace function public.delete_subscription(
  p_subscription_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as
$$
declare
  v_user_id uuid;
  v_deleted_id uuid;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'not authenticated';
  end if;

  delete from public.subscriptions
  where
    id = p_subscription_id
    and user_id = v_user_id
  returning id
  into v_deleted_id;

  if v_deleted_id is null then
    raise exception 'subscription not found';
  end if;

  return true;
end;
$$;

comment on function public.delete_subscription is
e'@graphql({
  "name": "deleteSubscription",
  "description": "Deletes Subscription record from the collection."
})';

create or replace function public.get_all_subscriptions(
  p_limit integer default 20,
  p_after_created_at timestamptz default null,
  p_after_id uuid default null
)
returns setof public.subscriptions
language sql
stable
security invoker
as $$
  select s.*
  from public.subscriptions s
  where s.user_id = auth.uid()

    and (
      p_after_created_at is null
      or
      (s.created_at, s.id)
        <
      (p_after_created_at, p_after_id)
    )

  order by
    s.created_at desc,
    s.id desc

  limit least(p_limit, 50) + 1;
$$;

comment on function public.get_all_subscriptions is
e'@graphql({
  "name": "getAllSubscriptions",
  "description": "Retrieves all Subscription records from the collection."
})';

create or replace function public.get_subscription_by_id(
  p_subscription_id uuid
)
returns public.subscriptions
stable
language sql
as
$$
  select *
  from public.subscriptions
  where id = p_subscription_id
  and user_id = auth.uid();
$$;

comment on function public.get_subscription_by_id is
e'@graphql({
  "name": "getSubscriptionById",
  "description": "Retrieves Subscription record by ID from the collection."
})';

create or replace function public.get_subscriptions_by_search(
  p_search_term text
)
returns setof public.subscriptions
stable
language sql
as
$$
  select *
  from public.subscriptions
  where
    title % p_search_term
    or description % p_search_term
  order by
    similarity(title::text, p_search_term) desc,
    similarity(description::text, p_search_term) desc
  limit 50;
$$;

comment on function public.get_subscriptions_by_search is
e'@graphql({
  "name": "getSubscriptionsBySearch",
  "description": "Searches for Subscription records in the collection."
})';

grant select, insert, update, delete
on public.subscriptions
to authenticated;

grant select
on public.subscriptions
to anon;

grant execute on function public.create_subscription(
  text,
  text,
  numeric,
  text,
  date,
  text
)
to authenticated;

grant execute on function public.update_subscription(
  uuid,
  text,
  text,
  numeric,
  text,
  date,
  text
)
to authenticated;

grant execute on function public.delete_subscription(
  uuid
)
to authenticated;

grant execute on function public.get_all_subscriptions(
  integer,
  timestamptz,
  uuid
)
to anon;

grant execute on function public.get_subscription_by_id(
  uuid
)
to anon;

grant execute on function public.get_subscriptions_by_search(
  text
)
to anon;