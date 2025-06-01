import type { NormalizedCandle, upbitCandle } from "../types/upbitCandle";

export const normalizeCandles = (data: upbitCandle[]): NormalizedCandle[] => {
  return data
    .map((item) => ({
      date: new Date(item.candle_date_time_kst),
      open: item.opening_price,
      high: item.high_price,
      low: item.low_price,
      close: item.trade_price,
      volume: item.candle_acc_trade_volume,
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
};