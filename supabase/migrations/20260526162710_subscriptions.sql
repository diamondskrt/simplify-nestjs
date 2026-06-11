create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,

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
add constraint subscriptions_valid_title
check (
  char_length(description) > 0
  and char_length(title) <= 15
);

alter table public.subscriptions
add constraint subscriptions_valid_description
check (
  char_length(description) > 0
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
