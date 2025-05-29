import { useEffect, useRef, useState } from "react";
import type { MarketItem, TickerItem } from "../types/upbitTypes";

type Props = {
  market: MarketItem;
  ticker?: TickerItem;
};

const CoinItem = ({ market, ticker }: Props) => {
  const [highlight, setHighlight] = useState<"rise" | "fall" | null>(null);
  const prevPrice = useRef<number | null>(null);

  // 가격 변동 감지
useEffect(() => {
  if (!ticker) return;

  const newPrice = ticker.trade_price;
  const oldPrice = prevPrice.current;

  if (oldPrice !== null && oldPrice !== newPrice) {
    const isUp = newPrice > oldPrice;
    setHighlight(isUp ? "rise" : "fall");

    const timeout = setTimeout(() => {
      setHighlight(null);
    }, 200);
    return () => clearTimeout(timeout);
  }

  prevPrice.current = newPrice;
}, [ticker]);


  const isRising = ticker?.change === "RISE";

  return (
    <li
      style={{
        border: "2px solid",
        borderColor:
          highlight === "rise"
            ? "red"
            : highlight === "fall"
            ? "blue"
            : "#ddd",
        borderRadius: "6px",
        backgroundColor: "#fff",
        fontSize: "0.65rem",
        lineHeight: 1.2,
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        listStyle: "none",
        width: "120px",
        padding: "0.4rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "border-color 0.3s ease",
      }}
    >
      <div style={{ fontWeight: 600 }}>
        {market.korean_name} <br />({market.market})
      </div>
      <div style={{ color: "#777", fontSize: "0.55rem" }}>{market.english_name}</div>

      {ticker && (
        <div style={{ marginTop: "0.3rem" }}>
          💰{" "}
          <span style={{ color: isRising ? "red" : "blue", fontWeight: 600 }}>
            {ticker.trade_price.toLocaleString()}원
          </span>
          <br />
          <span style={{ fontSize: "0.55rem" }}>
            ({(ticker.change_rate * 100).toFixed(2)}%)
          </span>
        </div>
      )}

      {market.market_event?.warning && (
        <div style={{ marginTop: "0.25rem", color: "#d97706", fontSize: "0.6rem" }}>
          ⚠️ 유의
        </div>
      )}
    </li>
  );
};

export default CoinItem;
