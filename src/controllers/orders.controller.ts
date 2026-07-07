import { Request, Response, NextFunction } from 'express';
import { orderService } from '../services/order.service';
import { ValidationError } from '../errors/validation.error';

export class OrdersController {
  list(req: Request, res: Response, next: NextFunction): void {
    try {
      const limitParam = req.query.limit;
      let limit: number | undefined;

      if (limitParam !== undefined) {
        limit = Number(limitParam);
        if (!Number.isInteger(limit) || limit < 0) {
          throw new ValidationError('limit must be a non-negative integer');
        }
      }

      const result = orderService.getHistoricOrders(limit);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const ordersController = new OrdersController();
