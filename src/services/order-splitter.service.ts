import { config } from '../config';
import { CreateModelRequest, Allocation } from '../types/order.types';
import { applyLargestRemainder } from '../utils/largest-remainder';

export class OrderSplitterService {
  split(request: CreateModelRequest): Allocation[] {
    const rawAmounts = request.portfolio.map(
      (item) => request.totalAmount * (item.weight / 100),
    );
    const amounts = applyLargestRemainder(rawAmounts, 2);

    const rawQuantities = request.portfolio.map((item, index) => {
      const price = this.resolvePrice(item.symbol, request.prices);
      return amounts[index] / price;
    });
    const quantities = applyLargestRemainder(rawQuantities, config.shareDecimalPlaces);

    return request.portfolio.map((item, index) => ({
      symbol: item.symbol.toUpperCase(),
      weight: item.weight,
      amount: amounts[index],
      price: this.resolvePrice(item.symbol, request.prices),
      quantity: quantities[index],
    }));
  }

  private resolvePrice(symbol: string, prices?: Record<string, number>): number {
    if (!prices) {
      return config.defaultPrice;
    }

    const normalizedSymbol = symbol.toUpperCase();
    for (const [key, value] of Object.entries(prices)) {
      if (key.toUpperCase() === normalizedSymbol) {
        return value;
      }
    }

    return config.defaultPrice;
  }
}

export const orderSplitterService = new OrderSplitterService();
