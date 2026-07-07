import { DbSchema, OrderRecord } from '../types/order.types';

export class OrderRepository {
  private db: DbSchema = { orders: [] };

  save(order: OrderRecord): OrderRecord {
    this.db.orders.unshift(order);
    return order;
  }

  findAll(limit?: number): OrderRecord[] {
    if (limit !== undefined && limit >= 0) {
      return this.db.orders.slice(0, limit);
    }
    return [...this.db.orders];
  }

  clear(): void {
    this.db.orders = [];
  }
}

export const orderRepository = new OrderRepository();
