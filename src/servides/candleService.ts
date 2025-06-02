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
  const now = new Date();
  const paddedTo = new Date(now.getTime() + 2 * 60 * 1000).toISOString(); // ✅ 미래 2분 추가
  const { to = paddedTo, ...rest } = options;

  const rawCandles = await getUpbitCandles({ ...rest, to });

  // ✅ 정렬 보장
  const normalized = normalizeCandles(rawCandles).sort((a, b) => a.date.getTime() - b.date.getTime());

  return normalized;
};
