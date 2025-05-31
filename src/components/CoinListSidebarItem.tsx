import { useEffect, useRef, useState } from "react";
import type { MarketItem, TickerItem } from "../types/upbitTypes";
import { Link } from "react-router-dom";

type Props = {
  market: MarketItem;
  ticker?: TickerItem;
};

const CoinListSidebarItem = ({ market, ticker }: Props) => {
  const [highlight, setHighlight] = useState<"rise" | "fall" | null>(null);
  const prevPrice = useRef<number | null>(null);
  const tradePrice = ticker?.trade_price;

  useEffect(() => {
    if (tradePrice === undefined) return;

    const oldPrice = prevPrice.current;

    if (oldPrice !== null && oldPrice !== tradePrice) {
      const isUp = tradePrice > oldPrice;
      setHighlight(isUp ? "rise" : "fall");

      const timeout = setTimeout(() => {
        setHighlight(null);
      }, 200);

      prevPrice.current = tradePrice;
      return () => clearTimeout(timeout);
    }

    prevPrice.current = tradePrice;
  }, [tradePrice]);

  const isRising = ticker?.change === "RISE";
  const isFalling = ticker?.change === "FALL";
  const changeColor = isRising ? "#e11d48" : isFalling ? "#2563eb" : "#6b7280";

  const changeRateValue =
    ticker?.change_rate != null ? (ticker.change_rate * 100).toFixed(2) : null;

  const changeRateDisplay = changeRateValue
    ? `${isRising ? "+" : isFalling ? "-" : ""}${changeRateValue}`
    : "-";

  const borderColor =
    highlight === "rise" ? "#e11d48" : highlight === "fall" ? "#2563eb" : "transparent";

  return (
    <li
      style={{
        padding: "0.5rem 0.25rem",
        borderBottom: "1px solid #eee",
        fontSize: "0.8rem",
        borderLeft: `2px solid ${borderColor}`,
        transition: "border-color 0.3s ease",
      }}
    >
      <Link
        to={`/coin/${market.market}`}
        style={{
          textDecoration: "none",
          color: "inherit",
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "0.5rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <span style={{ fontWeight: 600 }}>{market.korean_name}</span>
            <span style={{ fontWeight: 400, color: "#666" }}>({market.market})</span>
          </div>

          {market.market_event?.warning && (
            <span
              style={{
                fontSize: "0.7rem",
                color: "#d97706",
                flexShrink: 0,
              }}
            >
              ⚠️ 유의 종목
            </span>
          )}
        </div>

        {ticker && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.75rem",
              fontWeight: 500,
              color: changeColor,
            }}
          >
            <span>{tradePrice?.toLocaleString()}원</span>
            <span>({changeRateDisplay}%)</span>
          </div>
        )}
      </Link>
    </li>
  );
};

export default CoinListSidebarItem;