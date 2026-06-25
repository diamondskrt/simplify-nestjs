import { z } from 'zod';

const TITLE_MIN_LENGTH = 1;
const TITLE_MAX_LENGTH = 100;
const DESCRIPTION_MIN_LENGTH = 1;
const DESCRIPTION_MAX_LENGTH = 500;
const PRICE_MIN = 0.01;
const PRICE_MAX = 9999.98;

const paymentIntervalS = ['daily', 'weekly', 'monthly', 'yearly'] as const;
const SUBSCRIPTION_STATUSES = [
  'active',
  'paused',
  'canceled',
  'expired',
] as const;

const titleSchema = z
  .string()
  .min(TITLE_MIN_LENGTH, {
    message: `Title must be at least ${TITLE_MIN_LENGTH} character`,
  })
  .max(TITLE_MAX_LENGTH, {
    message: `Title must be at most ${TITLE_MAX_LENGTH} characters`,
  });

const descriptionSchema = z
  .string()
  .min(DESCRIPTION_MIN_LENGTH, {
    message: `Description must be at least ${DESCRIPTION_MIN_LENGTH} character`,
  })
  .max(DESCRIPTION_MAX_LENGTH, {
    message: `Description must be at most ${DESCRIPTION_MAX_LENGTH} characters`,
  })
  .nullable()
  .optional();

const priceSchema = z
  .number()
  .positive({ message: 'Price must be positive' })
  .min(PRICE_MIN, { message: `Price must be at least ${PRICE_MIN}` })
  .max(PRICE_MAX, { message: `Price must be at most ${PRICE_MAX}` })
  .multipleOf(0.01, { message: 'Price must have at most 2 decimal places' });

const paymentIntervalSchema = z.enum(paymentIntervalS);

const statusSchema = z.enum(SUBSCRIPTION_STATUSES);

const isValidDate = (date: Date) => {
  const now = new Date();
  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(now.getFullYear() - 1);

  return date >= oneYearAgo && date <= now;
};

const SubscriptionSchema = z.object({
  id: z.uuid({ message: 'Invalid UUID format' }),
  userId: z.uuid({ message: 'Invalid UUID format' }),
  imgUrl: z.url().nullable().optional(),
  title: titleSchema,
  description: descriptionSchema,
  price: priceSchema,
  paymentInterval: paymentIntervalSchema,
  paymentDate: z.date().refine(isValidDate, {
    message: 'Payment date must be within the last year',
  }),
  nextBillingDate: z.date().nullable(),
  status: statusSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

const CreateSubscriptionSchema = SubscriptionSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
  nextBillingDate: true,
});

const UpdateSubscriptionSchema = z.object({
  imgUrl: z.url().nullable().optional(),
  title: titleSchema.optional(),
  description: descriptionSchema.optional(),
  price: priceSchema.optional(),
  paymentInterval: paymentIntervalSchema.optional(),
  paymentDate: z
    .date()
    .refine(isValidDate, {
      message: 'Payment date must be within the last year',
    })
    .optional(),
  status: statusSchema.optional(),
});

export {
  SubscriptionSchema,
  CreateSubscriptionSchema,
  UpdateSubscriptionSchema,
};
