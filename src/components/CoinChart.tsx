import { useEffect, useState } from "react";
import type { CandleType, NormalizedCandle } from "../types/upbitCandle";
import { fetchNormalizedCandles } from "../servides/candleService";

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
  candleType = "days",
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

  if (loading) return <div>📈 차트 데이터를 불러오는 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section
      style={{
        height: "800px",
        border: "1px solid #ddd",
        borderRadius: "6px",
        padding: "1rem",
      }}
    >
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

      <pre
        style={{
          fontSize: "0.7rem",
          background: "#f3f4f6",
          padding: "0.5rem",
          borderRadius: "4px",
          maxHeight: 300,
          overflow: "auto",
        }}
      >
        {JSON.stringify(candles, null, 2)}
      </pre>
    </section>
  );
};

export default CoinChart;