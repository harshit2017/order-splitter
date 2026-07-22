import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { orderRepository } from '../src/repositories/order.repository';

describe('API integration', () => {
  const app = createApp();

  beforeEach(() => {
    orderRepository.clear();
  });

  it('POST /api/model creates an order split', async () => {
    const response = await request(app).post('/api/model').send({
      type: 'BUY',
      totalAmount: 100,
      portfolio: [
        { symbol: 'AAPL', weight: 60 },
        { symbol: 'TSLA', weight: 40 },
      ],
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      type: 'BUY',
      totalAmount: 100,
    });
    expect(response.body.id).toBeDefined();
    expect(response.body.allocations).toHaveLength(2);
    expect(response.body.allocations[0].quantity).toBe(0.6);
    expect(response.body.allocations[1].quantity).toBe(0.4);
  });

  it('GET /api/orders returns historic orders newest first', async () => {
    await request(app).post('/api/model').send({
      type: 'BUY',
      totalAmount: 100,
      portfolio: [{ symbol: 'AAPL', weight: 100 }],
    });

    await request(app).post('/api/model').send({
      type: 'SELL',
      totalAmount: 50,
      portfolio: [{ symbol: 'TSLA', weight: 100 }],
    });

    const response = await request(app).get('/api/orders');

    expect(response.status).toBe(200);
    expect(response.body.count).toBe(2);
    expect(response.body.orders[0].type).toBe('SELL');
    expect(response.body.orders[1].type).toBe('BUY');
  });

  it('returns 400 for invalid portfolio weights', async () => {
    const response = await request(app).post('/api/model').send({
      type: 'BUY',
      totalAmount: 100,
      portfolio: [
        { symbol: 'AAPL', weight: 50 },
        { symbol: 'TSLA', weight: 40 },
      ],
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('100');
  });

  it('returns 400 for invalid limit query param', async () => {
    const response = await request(app).get('/api/orders?limit=-1');
    expect(response.status).toBe(400);
  });

  it('sets an X-Response-Time header on responses', async () => {
    const response = await request(app).get('/api/orders');
    expect(response.status).toBe(200);
    expect(response.headers['x-response-time']).toMatch(/^\d+(\.\d+)?ms$/);
  });

  it('respects limit query param on GET /api/orders', async () => {
    await request(app).post('/api/model').send({
      type: 'BUY',
      totalAmount: 10,
      portfolio: [{ symbol: 'AAPL', weight: 100 }],
    });
    await request(app).post('/api/model').send({
      type: 'BUY',
      totalAmount: 20,
      portfolio: [{ symbol: 'AAPL', weight: 100 }],
    });

    const response = await request(app).get('/api/orders?limit=1');
    expect(response.status).toBe(200);
    expect(response.body.count).toBe(1);
  });
});
