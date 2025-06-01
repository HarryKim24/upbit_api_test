import { getUpbitCandles } from "../api/upbitCandle";
import type { GetCandlesOptions, NormalizedCandle, upbitCandle } from "../types/upbitCandle";

const normalizeCandles = (candles: upbitCandle[]): NormalizedCandle[] => {
  return candles.map((candle) => ({
    date: new Date(candle.candle_date_time_kst),
    open: candle.opening_price,
    high: candle.high_price,
    low: candle.low_price,
    close: candle.trade_price,
    volume: candle.candle_acc_trade_volume,
  }));
};

export const fetchNormalizedCandles = async (
  options: GetCandlesOptions
): Promise<NormalizedCandle[]> => {
  const rawCandles = await getUpbitCandles(options);
  return normalizeCandles(rawCandles);
};
