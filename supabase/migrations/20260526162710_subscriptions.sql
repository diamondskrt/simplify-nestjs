create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid
    references public.users(id)
    on delete cascade,
  img_url text,
  title text not null,
  description text not null,

  price numeric(6, 2) not null,

  payment_interval text not null,
  payment_date date not null,
  next_billing_date date,

  status text not null,

  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.subscriptions
add constraint subscriptions_valid_img_url
check (
  img_url is null
  or (
    char_length(img_url) > 0
    and img_url ~ '^https?://[^/]+(/.*)?$'
  )
);

alter table public.subscriptions
add constraint subscriptions_valid_title
check (
  char_length(description) > 0
  and char_length(title) <= 100
);

alter table public.subscriptions
add constraint subscriptions_valid_description
check (
  char_length(description) > 0
  and char_length(description) <= 500
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
  payment_interval in ('daily', 'weekly', 'monthly', 'yearly')
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

alter table public.subscriptions
add constraint subscriptions_valid_status
check (
  status in ('active', 'paused', 'canceled', 'expired')
);

create trigger subscription_handle_updated_at
before update
on public.subscriptions
for each row
execute function public.handle_updated_at_column();

create or replace function public.calculate_next_billing_date(
  p_payment_date date,
  p_payment_interval text
)
returns date
language plpgsql
immutable
as $$
declare
  v_next_date date;
begin
  case p_payment_interval
    when 'daily' then
      v_next_date := p_payment_date + interval '1 day';
    when 'weekly' then
      v_next_date := p_payment_date + interval '1 week';
    when 'monthly' then
      v_next_date := p_payment_date + interval '1 month';
    when 'yearly' then
      v_next_date := p_payment_date + interval '1 year';
    else
      raise exception 'Invalid payment_interval: %', p_payment_interval;
  end case;

  return v_next_date::date;
end;
$$;

create or replace function public.handle_subscription_next_billing_date()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'active' then
    new.next_billing_date := public.calculate_next_billing_date(
      new.payment_date,
      new.payment_interval
    );
  else
    new.next_billing_date := null;
  end if;
  
  return new;
end;
$$;

create trigger subscription_calculate_next_billing_date
before insert
on public.subscriptions
for each row
execute function public.handle_subscription_next_billing_date();

create or replace function public.handle_subscription_update_next_billing_date()
returns trigger
language plpgsql
as $$
begin
  if (new.status is distinct from old.status) or
     (new.payment_date is distinct from old.payment_date) or
     (new.payment_interval is distinct from old.payment_interval) then
    
    if new.status = 'active' then
      new.next_billing_date := public.calculate_next_billing_date(
        new.payment_date,
        new.payment_interval
      );
    else
      new.next_billing_date := null;
    end if;
  end if;
  
  return new;
end;
$$;

create trigger subscription_update_next_billing_date
before update
on public.subscriptions
for each row
execute function public.handle_subscription_update_next_billing_date();

create index idx_subscriptions_title_trgm
on public.subscriptions
using gin (title public.gin_trgm_ops);

alter table public.subscriptions
enable row level security;

create policy "Users can read own subscription"
on public.subscriptions
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can update own subscription"
on public.subscriptions
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own subscription"
on public.subscriptions
for delete
to authenticated
using (auth.uid() = user_id);

create policy "Service role has full access"
on public.subscriptions
for all
to service_role
using (true)
with check (true);

grant select, update, delete on public.subscriptions to authenticated;
grant all on public.subscriptions to service_role;
