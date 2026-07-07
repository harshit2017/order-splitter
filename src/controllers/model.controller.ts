import { Request, Response, NextFunction } from 'express';
import { createModelSchema } from '../schemas/model.schema';
import { orderService } from '../services/order.service';
import { ValidationError } from '../errors/validation.error';

export class ModelController {
  create(req: Request, res: Response, next: NextFunction): void {
    try {
      const parsed = createModelSchema.safeParse(req.body);
      if (!parsed.success) {
        const message = parsed.error.errors.map((e) => e.message).join('; ');
        throw new ValidationError(message);
      }

      const order = orderService.createOrder(parsed.data);
      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  }
}

export const modelController = new ModelController();
