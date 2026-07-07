export type OrderType = 'BUY' | 'SELL';

export interface PortfolioItem {
  symbol: string;
  weight: number;
}

export interface CreateModelRequest {
  type: OrderType;
  totalAmount: number;
  portfolio: PortfolioItem[];
  prices?: Record<string, number>;
}

export interface Allocation {
  symbol: string;
  weight: number;
  amount: number;
  price: number;
  quantity: number;
}

export interface OrderRecord {
  id: string;
  type: OrderType;
  totalAmount: number;
  executeAt: string;
  marketOpenAtSubmission: boolean;
  allocations: Allocation[];
  createdAt: string;
}

export interface DbSchema {
  orders: OrderRecord[];
}
