enum PaymentInterval {
  daily = 'daily',
  weekly = 'weekly',
  monthly = 'monthly',
  yearly = 'yearly',
}

enum SubscriptionStatus {
  active = 'active',
  paused = 'paused',
  canceled = 'canceled',
  expired = 'expired',
}

enum SortBy {
  createdAt = 'createdAt',
  title = 'title',
  price = 'price',
}

export { PaymentInterval, SubscriptionStatus, SortBy };
