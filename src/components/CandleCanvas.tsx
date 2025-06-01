import type { NormalizedCandle } from "../types/upbitCandle";
import CoinCandle from "./CoinCandle";

type Props = {
  candles: NormalizedCandle[];
  height?: number;
};

const CandleCanvas = ({ candles, height = 600 }: Props) => {
  const max = Math.max(...candles.map((c) => c.high));
  const min = Math.min(...candles.map((c) => c.low));

  return (
    <div style={{ overflowX: "auto", height, background: "#f9fafb", marginTop: "1rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "4px",
          position: "relative",
          height,
          width: `${candles.length * 8}px`,
        }}
      >
        {candles.map((candle, idx) => (
          <CoinCandle
            key={idx}
            open={candle.open}
            close={candle.close}
            high={candle.high}
            low={candle.low}
            max={max}
            min={min}
            chartHeight={height}
          />
        ))}
      </div>
    </div>
  );
};

export default CandleCanvas;