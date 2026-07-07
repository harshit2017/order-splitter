import { z } from 'zod';
import { config } from '../config';

const portfolioItemSchema = z.object({
  symbol: z.string().min(1, 'Symbol is required').trim(),
  weight: z.number().positive('Weight must be positive'),
});

export const createModelSchema = z
  .object({
    type: z.enum(['BUY', 'SELL'], {
      errorMap: () => ({ message: 'Type must be BUY or SELL' }),
    }),
    totalAmount: z.number().positive('Total amount must be positive'),
    portfolio: z
      .array(portfolioItemSchema)
      .min(1, 'Portfolio must contain at least one stock'),
    prices: z.record(z.string(), z.number().positive('Price must be positive')).optional(),
  })
  .superRefine((data, ctx) => {
    const weightSum = data.portfolio.reduce((sum, item) => sum + item.weight, 0);
    if (Math.abs(weightSum - 100) > config.weightSumTolerance) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Portfolio weights must sum to 100 (got ${weightSum})`,
        path: ['portfolio'],
      });
    }

    const symbols = data.portfolio.map((item) => item.symbol.toUpperCase());
    if (new Set(symbols).size !== symbols.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Portfolio symbols must be unique',
        path: ['portfolio'],
      });
    }
  });

export type CreateModelInput = z.infer<typeof createModelSchema>;
