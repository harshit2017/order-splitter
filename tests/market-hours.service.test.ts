import { describe, it, expect } from 'vitest';
import { DateTime } from 'luxon';
import { MarketHoursService } from '../src/services/market-hours.service';

describe('MarketHoursService', () => {
  const service = new MarketHoursService();

  it('returns true during weekday market hours', () => {
    const tuesdayMorning = DateTime.fromObject(
      { year: 2026, month: 7, day: 7, hour: 10, minute: 0 },
      { zone: 'America/New_York' },
    );
    expect(service.isMarketOpen(tuesdayMorning)).toBe(true);
  });

  it('returns false on weekends', () => {
    const saturday = DateTime.fromObject(
      { year: 2026, month: 7, day: 11, hour: 10, minute: 0 },
      { zone: 'America/New_York' },
    );
    expect(service.isMarketOpen(saturday)).toBe(false);
  });

  it('returns false before market open on weekdays', () => {
    const earlyMorning = DateTime.fromObject(
      { year: 2026, month: 7, day: 7, hour: 8, minute: 0 },
      { zone: 'America/New_York' },
    );
    expect(service.isMarketOpen(earlyMorning)).toBe(false);
  });

  it('returns false at or after market close', () => {
    const atClose = DateTime.fromObject(
      { year: 2026, month: 7, day: 7, hour: 16, minute: 0 },
      { zone: 'America/New_York' },
    );
    expect(service.isMarketOpen(atClose)).toBe(false);
  });

  it('schedules next open for Saturday submissions', () => {
    const saturday = DateTime.fromObject(
      { year: 2026, month: 7, day: 11, hour: 10, minute: 0 },
      { zone: 'America/New_York' },
    );
    const nextOpen = service.getNextMarketOpen(saturday);
    expect(nextOpen.weekday).toBe(1);
    expect(nextOpen.hour).toBe(9);
    expect(nextOpen.minute).toBe(30);
  });

  it('schedules same-day open before 9:30 AM ET', () => {
    const earlyTuesday = DateTime.fromObject(
      { year: 2026, month: 7, day: 7, hour: 8, minute: 0 },
      { zone: 'America/New_York' },
    );
    const nextOpen = service.getNextMarketOpen(earlyTuesday);
    expect(nextOpen.weekday).toBe(2);
    expect(nextOpen.hour).toBe(9);
    expect(nextOpen.minute).toBe(30);
  });

  it('schedules next weekday open after market close', () => {
    const afterClose = DateTime.fromObject(
      { year: 2026, month: 7, day: 7, hour: 17, minute: 0 },
      { zone: 'America/New_York' },
    );
    const nextOpen = service.getNextMarketOpen(afterClose);
    expect(nextOpen.weekday).toBe(3);
    expect(nextOpen.hour).toBe(9);
    expect(nextOpen.minute).toBe(30);
  });
});
