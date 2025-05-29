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
            height: "80px",
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
              fontWeight: 600,
              fontSize: "0.65rem",
              height: "1.9rem",
              lineHeight: 1.1,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {market.korean_name}
            </div>
            <div style={{ fontSize: "0.55rem", color: "#666" }}>
              {market.market}
            </div>
          </div>

          <div
            style={{
              color: "#999",
              fontSize: "0.5rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {market.english_name}
          </div>

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
                💰 {ticker.trade_price.toLocaleString()}원
              </span>
              <span
                style={{
                  fontSize: "0.55rem",
                  color: "#555",
                  whiteSpace: "nowrap",
                }}
              >
                ({(ticker.change_rate * 100).toFixed(2)}%)
              </span>
            </div>
          )}

          {market.market_event?.warning && (
            <div
              style={{
                color: "#d97706",
                fontSize: "0.55rem",
                whiteSpace: "nowrap",
              }}
            >
              ⚠️ 유의 종목
            </div>
          )}
        </div>
      </Link>
    </li>
  );
};

export default CoinItem;