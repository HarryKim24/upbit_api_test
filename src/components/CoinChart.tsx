import { useEffect, useState, useCallback } from "react";
import type { CandleType, NormalizedCandle } from "../types/upbitCandle";
import { fetchNormalizedCandles } from "../servides/candleService";
import { useTradeTicker } from "../hooks/useTradeTicker";

type Props = {
  market: string;
  candleType?: CandleType;
  unit?: number;
  count?: number;
};

const AVAILABLE_TYPES: CandleType[] = ["seconds", "minutes", "days", "weeks", "months", "years"];
const AVAILABLE_UNITS = [1, 3, 5, 10, 15, 30, 60, 240];

const CoinChart = ({
  market,
  candleType = "seconds",
  unit: defaultUnit = 1,
  count = 100,
}: Props) => {
  const [candles, setCandles] = useState<NormalizedCandle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedType, setSelectedType] = useState<CandleType>(candleType);
  const [unit, setUnit] = useState<number>(defaultUnit);

  useEffect(() => {
    const loadCandles = async () => {
      try {
        setLoading(true);
        const data = await fetchNormalizedCandles({
          market,
          candleType: selectedType,
          unit: selectedType === "minutes" ? unit : undefined,
          count,
        });
        setCandles(data);
      } catch (err) {
        console.error("❌ 캔들 데이터 로드 실패:", err);
        setError("캔들 데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadCandles();
  }, [market, selectedType, unit, count]);

  const handleTrade = useCallback(
    ({ price, volume, timestamp }: { price: number; volume: number; timestamp: number }) => {
      setCandles((prev) => {
        if (prev.length === 0) return prev;

        const last = prev[prev.length - 1];
        const lastTime = last.date.getTime();
        const tradeTime = timestamp;

        const shouldCreateNewCandle = () => {
          const tradeDate = new Date(tradeTime);
          const lastDate = new Date(lastTime);

          switch (selectedType) {
            case "seconds":
              return tradeTime - lastTime >= 1000;

            case "minutes": {
              if (!unit) return false;
              const tradeMin = Math.floor(tradeTime / (unit * 60 * 1000));
              const lastMin = Math.floor(lastTime / (unit * 60 * 1000));
              return tradeMin > lastMin;
            }

            case "days":
              return (
                tradeDate.getUTCDate() !== lastDate.getUTCDate() ||
                tradeDate.getUTCMonth() !== lastDate.getUTCMonth() ||
                tradeDate.getUTCFullYear() !== lastDate.getUTCFullYear()
              );

            case "weeks": {
              const getWeekStart = (d: Date) => {
                const day = d.getUTCDay();
                const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1);
                return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), diff)).getTime();
              };
              return getWeekStart(tradeDate) !== getWeekStart(lastDate);
            }

            case "months":
              return (
                tradeDate.getUTCFullYear() !== lastDate.getUTCFullYear() ||
                tradeDate.getUTCMonth() !== lastDate.getUTCMonth()
              );

            case "years":
              return tradeDate.getUTCFullYear() !== lastDate.getUTCFullYear();

            default:
              return false;
          }
        };

        if (shouldCreateNewCandle()) {
          const newCandle = {
            date: new Date(tradeTime),
            open: price,
            high: price,
            low: price,
            close: price,
            volume,
          };
          return [...prev.slice(-99), newCandle];
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

  if (loading) return <div>📈 차트 데이터를 불러오는 중...</div>;
  if (error) return <div>{error}</div>;

  const visibleCandles = candles.slice(-200);
  const maxPrice = Math.max(...visibleCandles.map((c) => c.high));
  const minPrice = Math.min(...visibleCandles.map((c) => c.low));
  const priceRange = maxPrice - minPrice || 1;

  return (
    <section style={{ height: "800px", border: "1px solid #ddd", borderRadius: "6px", padding: "1rem" }}>
      <h2 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>차트</h2>

      <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {AVAILABLE_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            style={{
              padding: "0.25rem 0.75rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
              background: selectedType === type ? "#1d4ed8" : "#f9fafb",
              color: selectedType === type ? "#fff" : "#333",
              cursor: "pointer",
            }}
          >
            {type.toUpperCase()}
          </button>
        ))}

        {selectedType === "minutes" && (
          <select
            value={unit}
            onChange={(e) => setUnit(Number(e.target.value))}
            style={{ padding: "0.25rem", borderRadius: "4px" }}
          >
            {AVAILABLE_UNITS.map((u) => (
              <option key={u} value={u}>
                {u}분
              </option>
            ))}
          </select>
        )}
      </div>

<div
  style={{
    overflowX: "auto",
    height: "600px",
    marginTop: "1rem",
    background: "#f9fafb",
  }}
>
  <div
    style={{
      display: "flex",
      alignItems: "flex-end",
      gap: "4px",
      position: "relative",
      height: "600px",
      width: `${visibleCandles.length * 8}px`, // 6px 캔들 + 2px gap
    }}
  >
    {visibleCandles.map((candle, idx) => {
      const candleTop = Math.max(candle.open, candle.close);
      const candleBottom = Math.min(candle.open, candle.close);

      const highToTop = ((maxPrice - candle.high) / priceRange) * 600;
      const lowToBottom = ((maxPrice - candle.low) / priceRange) * 600;
      const openToTop = ((maxPrice - candleTop) / priceRange) * 600;
      const closeToBottom = ((maxPrice - candleBottom) / priceRange) * 600;

      const candleHeight = Math.max(1, closeToBottom - openToTop);
      const wickHeight = Math.max(1, lowToBottom - highToTop);

      const isUp = candle.close >= candle.open;
      const color = isUp ? "#ef4444" : "#3b82f6";

      return (
        <div
          key={idx}
          style={{
            position: "relative",
            width: "6px",
            height: "600px",
          }}
        >
          {/* Wick */}
          <div
            style={{
              position: "absolute",
              top: `${highToTop}px`,
              left: "50%",
              transform: "translateX(-50%)",
              width: "1px",
              height: `${wickHeight}px`,
              backgroundColor: color,
            }}
          />

          {/* Body */}
          <div
            title={`O: ${candle.open}, H: ${candle.high}, L: ${candle.low}, C: ${candle.close}`}
            style={{
              position: "absolute",
              top: `${openToTop}px`,
              left: 0,
              right: 0,
              margin: "0 auto",
              height: `${candleHeight}px`,
              backgroundColor: color,
              borderRadius: "2px",
              width: "100%",
            }}
          />
        </div>
      );
    })}
  </div>
</div>

    </section>
  );
};

export default CoinChart;