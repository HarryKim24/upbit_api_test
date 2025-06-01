import type { CandleType } from "../types/upbitCandle";

type Props = {
  selectedType: CandleType;
  unit: number;
  onTypeChange: (type: CandleType) => void;
  onUnitChange: (unit: number) => void;
};

const AVAILABLE_TYPES: CandleType[] = ["seconds", "minutes", "days", "weeks", "months", "years"];
const AVAILABLE_UNITS = [1, 3, 5, 10, 15, 30, 60, 240];

const CandleControls = ({ selectedType, unit, onTypeChange, onUnitChange }: Props) => {
  return (
    <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
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
          {type.toUpperCase()}
        </button>
      ))}

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
  );
};

export default CandleControls;