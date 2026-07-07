import { v4 as uuidv4 } from 'uuid';
import { CreateModelInput } from '../schemas/model.schema';
import { OrderRecord } from '../types/order.types';
import { orderRepository } from '../repositories/order.repository';
import { orderSplitterService } from './order-splitter.service';
import { marketHoursService } from './market-hours.service';

export class OrderService {
  createOrder(input: CreateModelInput): OrderRecord {
    const request = {
      type: input.type,
      totalAmount: input.totalAmount,
      portfolio: input.portfolio.map((item) => ({
        symbol: item.symbol.toUpperCase(),
        weight: item.weight,
      })),
      prices: input.prices,
    };

    const allocations = orderSplitterService.split(request);
    const { executeAt, marketOpenAtSubmission } = marketHoursService.getExecuteAt();
    const now = new Date();

    const order: OrderRecord = {
      id: uuidv4(),
      type: request.type,
      totalAmount: request.totalAmount,
      executeAt: executeAt.toISOString(),
      marketOpenAtSubmission,
      allocations,
      createdAt: now.toISOString(),
    };

    return orderRepository.save(order);
  }

  getHistoricOrders(limit?: number): { orders: OrderRecord[]; count: number } {
    const orders = orderRepository.findAll(limit);
    return {
      orders,
      count: orders.length,
    };
  }
}

export const orderService = new OrderService();
