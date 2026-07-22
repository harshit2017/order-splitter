import { Request, Response, NextFunction } from 'express';

export function responseTimeMiddleware(req: Request, res: Response, next: NextFunction): void {
  const start = process.hrtime.bigint();

  const originalWriteHead = res.writeHead.bind(res) as typeof res.writeHead;
  res.writeHead = function (
    this: Response,
    ...args: Parameters<typeof res.writeHead>
  ): ReturnType<typeof res.writeHead> {
    const elapsedMs = Number(process.hrtime.bigint() - start) / 1_000_000;
    if (!res.headersSent) {
      res.setHeader('X-Response-Time', `${elapsedMs.toFixed(2)}ms`);
    }
    return originalWriteHead(...args);
  } as typeof res.writeHead;

  res.on('finish', () => {
    const elapsedMs = Number(process.hrtime.bigint() - start) / 1_000_000;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${elapsedMs.toFixed(2)}ms`);
  });

  next();
}
