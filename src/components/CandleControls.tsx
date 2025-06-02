import type { CandleType } from "../types/upbitCandle";

type Props = {
  selectedType: CandleType;
  unit: number;
  onTypeChange: (type: CandleType) => void;
  onUnitChange: (unit: number) => void;
};

const AVAILABLE_TYPES: CandleType[] = ["seconds", "minutes", "days", "weeks", "months", "years"];
const AVAILABLE_UNITS = [1, 3, 5, 10, 15, 30, 60, 240];

const TYPE_LABELS: Record<CandleType, string> = {
  seconds: "초",
  minutes: "분",
  days: "일",
  weeks: "주",
  months: "월",
  years: "연",
};

const CandleControls = ({ selectedType, unit, onTypeChange, onUnitChange }: Props) => {
  return (
    <div
      style={{
        marginBottom: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          justifyContent: "flex-end",
        }}
      >
        {AVAILABLE_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => onTypeChange(type)}
            style={{
              padding: "0.25rem 0.75rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
              background: selectedType === type ? "#1d4ed8" : "#f9fafb",
              color: selectedType === type ? "#fff" : "#333",
              cursor: "pointer",
            }}
          >
            {TYPE_LABELS[type]}
          </button>
        ))}
      </div>

      <div style={{ alignSelf: "flex-end", height: "32px" }}>
        {selectedType === "minutes" && (
          <select
            value={unit}
            onChange={(e) => onUnitChange(Number(e.target.value))}
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
    </div>
  );
};

export default CandleControls;