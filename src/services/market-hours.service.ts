import { DateTime } from 'luxon';

const MARKET_TIMEZONE = 'America/New_York';
const MARKET_OPEN_HOUR = 9;
const MARKET_OPEN_MINUTE = 30;
const MARKET_CLOSE_HOUR = 16;
const MARKET_CLOSE_MINUTE = 0;

export class MarketHoursService {
  isMarketOpen(at: DateTime = DateTime.now()): boolean {
    const et = at.setZone(MARKET_TIMEZONE);

    if (et.weekday < 1 || et.weekday > 5) {
      return false;
    }

    const open = et.set({
      hour: MARKET_OPEN_HOUR,
      minute: MARKET_OPEN_MINUTE,
      second: 0,
      millisecond: 0,
    });
    const close = et.set({
      hour: MARKET_CLOSE_HOUR,
      minute: MARKET_CLOSE_MINUTE,
      second: 0,
      millisecond: 0,
    });

    return et >= open && et < close;
  }

  getExecuteAt(at: DateTime = DateTime.now()): { executeAt: Date; marketOpenAtSubmission: boolean } {
    if (this.isMarketOpen(at)) {
      return {
        executeAt: at.toJSDate(),
        marketOpenAtSubmission: true,
      };
    }

    return {
      executeAt: this.getNextMarketOpen(at).toJSDate(),
      marketOpenAtSubmission: false,
    };
  }

  getNextMarketOpen(at: DateTime = DateTime.now()): DateTime {
    let candidate = at.setZone(MARKET_TIMEZONE);

    if (this.isMarketOpen(candidate)) {
      return candidate;
    }

    candidate = candidate.set({
      hour: MARKET_OPEN_HOUR,
      minute: MARKET_OPEN_MINUTE,
      second: 0,
      millisecond: 0,
    });

    if (at.setZone(MARKET_TIMEZONE) >= candidate && candidate.weekday >= 1 && candidate.weekday <= 5) {
      candidate = candidate.plus({ days: 1 });
    }

    while (candidate.weekday < 1 || candidate.weekday > 5) {
      candidate = candidate.plus({ days: 1 });
    }

    return candidate.set({
      hour: MARKET_OPEN_HOUR,
      minute: MARKET_OPEN_MINUTE,
      second: 0,
      millisecond: 0,
    });
  }
}

export const marketHoursService = new MarketHoursService();
