import { useState, useEffect, useCallback, useRef } from "react";
import type { CandleType, NormalizedCandle } from "../types/upbitCandle";
import { fetchNormalizedCandles } from "../servides/candleService";
import { useTradeTicker } from "../hooks/useTradeTicker";
import CandleCanvas from "./CandleCanvas";
import CandleControls from "./CandleControls";

const CoinChart = ({
  market,
  candleType = "seconds",
  unit: defaultUnit = 1,
  count = 100,
}: {
  market: string;
  candleType?: CandleType;
  unit?: number;
  count?: number;
}) => {
  const [candles, setCandles] = useState<NormalizedCandle[]>([]);
  const [selectedType, setSelectedType] = useState<CandleType>(candleType);
  const [unit, setUnit] = useState<number>(defaultUnit);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const latestCandlesRef = useRef<NormalizedCandle[]>([]);
  useEffect(() => {
    latestCandlesRef.current = candles;
  }, [candles]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchNormalizedCandles({
          market,
          candleType: selectedType,
          unit: selectedType === "minutes" ? unit : undefined,
          count,
        });
        setCandles(data);
      } catch (err) {
        console.error(err);
        setError("❌ 데이터 로딩 오류");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [market, selectedType, unit, count]);

  const handleTrade = useCallback(
    ({ price, volume, timestamp }: { price: number; volume: number; timestamp: number }) => {
      setCandles(() => {
        const prev = latestCandlesRef.current;
        if (!prev.length) return prev;

        const last = prev[prev.length - 1];
        const tradeTime = timestamp;
        const lastTime = last.date.getTime();

        if (tradeTime < lastTime) return prev;

        const isNew = (() => {
          const t = new Date(tradeTime), l = new Date(lastTime);
          switch (selectedType) {
            case "seconds": return tradeTime - lastTime >= 1000;
            case "minutes": return Math.floor(tradeTime / (unit * 60_000)) > Math.floor(lastTime / (unit * 60_000));
            case "days": return t.getUTCDate() !== l.getUTCDate();
            case "weeks": {
              const week = (d: Date) =>
                new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - d.getUTCDay()));
              return week(t).getTime() !== week(l).getTime();
            }
            case "months": return t.getUTCMonth() !== l.getUTCMonth();
            case "years": return t.getUTCFullYear() !== l.getUTCFullYear();
            default: return false;
          }
        })();

        if (isNew) {
          return [
            ...prev.slice(-99),
            {
              date: new Date(tradeTime),
              open: price,
              high: price,
              low: price,
              close: price,
              volume,
            },
          ];
        }

        const updated = {
          ...last,
          close: price,
          high: Math.max(last.high, price),
          low: Math.min(last.low, price),
          volume: last.volume + volume,
        };

        return [...prev.slice(0, -1), updated];
      });
    },
    [selectedType, unit]
  );

  useTradeTicker({ market, onTrade: handleTrade });

  if (loading) return <div>📊 로딩 중...</div>;
  if (error) return <div>{error}</div>;

  const visible = candles;

  return (
    <section style={{ height: "800px", padding: "1rem", border: "1px solid #ddd", borderRadius: "6px" }}>
      <h2 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>차트</h2>
      <CandleControls selectedType={selectedType} unit={unit} onTypeChange={setSelectedType} onUnitChange={setUnit} />
      <CandleCanvas candles={visible} candleType={selectedType} />
    </section>
  );
};

export default CoinChart;
