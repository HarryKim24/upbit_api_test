import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { MarketItem, TickerItem } from "../types/upbitTypes";

type Props = {
  market: MarketItem;
  ticker?: TickerItem;
};

const CoinItem = ({ market, ticker }: Props) => {
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
  const changeRate =
    ticker?.change_rate !== undefined && ticker?.change !== undefined
      ? `${ticker.change === "RISE" ? "+" : ticker.change === "FALL" ? "-" : ""}${(ticker.change_rate * 100).toFixed(2)}%`
      : "-";

  return (
    <li style={{ listStyle: "none" }}>
      <Link
        to={`/coin/${market.market}`}
        style={{
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <div
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
            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
            width: "160px",
            height: "70px",
            padding: "0.4rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.2rem",
            transition: "border-color 0.3s ease",
            overflow: "hidden",
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.3rem",
              fontSize: "0.65rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <span style={{ fontWeight: 600 }}>{market.korean_name}</span>
            <span style={{ fontSize: "0.55rem", color: "#666" }}>({market.market})</span>
          </div>

          {market.market_event?.warning && (
            <div
              style={{
                color: "#d97706",
                fontSize: "0.75rem",
                whiteSpace: "nowrap",
                fontWeight: 600
              }}
            >
              ⚠️ 유의 종목
            </div>
          )}

          {ticker && (
            <div
              style={{
                display: "flex",
                gap: "0.25rem",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "nowrap",
              }}
            >
              <span
                style={{
                  color: isRising ? "red" : "blue",
                  fontWeight: 600,
                  fontSize: "0.7rem",
                  whiteSpace: "nowrap",
                }}
              >
                {ticker.trade_price.toLocaleString()}원
              </span>
              <span
                style={{
                  fontSize: "0.55rem",
                  color: "#555",
                  whiteSpace: "nowrap",
                }}
              >
                ({changeRate})
              </span>
            </div>
          )}
        </div>
      </Link>
    </li>
  );
};

export default CoinItem;