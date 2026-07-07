import { describe, it, expect } from 'vitest';
import { OrderSplitterService } from '../src/services/order-splitter.service';

describe('OrderSplitterService', () => {
  const service = new OrderSplitterService();

  it('splits the PDF example with default prices', () => {
    const allocations = service.split({
      type: 'BUY',
      totalAmount: 100,
      portfolio: [
        { symbol: 'AAPL', weight: 60 },
        { symbol: 'TSLA', weight: 40 },
      ],
    });

    expect(allocations).toHaveLength(2);
    expect(allocations[0]).toMatchObject({
      symbol: 'AAPL',
      amount: 60,
      price: 100,
      quantity: 0.6,
    });
    expect(allocations[1]).toMatchObject({
      symbol: 'TSLA',
      amount: 40,
      price: 100,
      quantity: 0.4,
    });
  });

  it('uses partner-provided prices when supplied', () => {
    const allocations = service.split({
      type: 'BUY',
      totalAmount: 100,
      portfolio: [
        { symbol: 'AAPL', weight: 60 },
        { symbol: 'TSLA', weight: 40 },
      ],
      prices: { AAPL: 150 },
    });

    expect(allocations[0]).toMatchObject({
      symbol: 'AAPL',
      amount: 60,
      price: 150,
      quantity: 0.4,
    });
    expect(allocations[1]).toMatchObject({
      symbol: 'TSLA',
      amount: 40,
      price: 100,
      quantity: 0.4,
    });
  });

  it('supports SELL orders with the same allocation logic', () => {
    const allocations = service.split({
      type: 'SELL',
      totalAmount: 50,
      portfolio: [{ symbol: 'AAPL', weight: 100 }],
    });

    expect(allocations[0]).toMatchObject({
      symbol: 'AAPL',
      amount: 50,
      price: 100,
      quantity: 0.5,
    });
  });
});
