import express from 'express';
import routes from './routes';
import { errorMiddleware } from './middleware/error.middleware';
import { responseTimeMiddleware } from './middleware/response-time.middleware';

export function createApp() {
  const app = express();

  app.use(responseTimeMiddleware);
  app.use(express.json());
  app.use('/api', routes);
  app.use(errorMiddleware);

  return app;
}
