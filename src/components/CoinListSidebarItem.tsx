import { useEffect, useRef } from "react";
import type { MarketItem, TickerItem } from "../types/upbitTypes";
import { Link } from "react-router-dom";

type Props = {
  market: MarketItem;
  ticker?: TickerItem;
};

const CoinListSidebarItem = ({ market, ticker }: Props) => {
  const prevPrice = useRef<number | null>(null);
  const tradePrice = ticker?.trade_price;

  useEffect(() => {
    if (tradePrice === undefined) return;
    prevPrice.current = tradePrice;
  }, [tradePrice]);

  const isRising = ticker?.change === "RISE";
  const changeColor = isRising ? "#e11d48" : "#2563eb";

  return (
    <li
      style={{
        padding: "0.5rem 0.25rem",
        borderBottom: "1px solid #eee",
        fontSize: "0.8rem",
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
        {/* 코인 정보 줄 + 유의 종목 우측 표시 */}
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
          {/* 왼쪽: 이름 + 마켓 + 영문명 */}
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
            <span style={{ fontWeight: 400, color: "#666" }}>
              ({market.market})
            </span>
            <span style={{ fontSize: "0.7rem", color: "#999" }}>
              {market.english_name}
            </span>
          </div>

          {/* 오른쪽: 유의 종목 */}
          {market.market_event?.warning && (
            <span style={{ fontSize: "0.7rem", color: "#d97706", flexShrink: 0 }}>
              ⚠️ 유의 종목
            </span>
          )}
        </div>

        {/* 가격 정보 줄 */}
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
            <span>({(ticker.change_rate * 100).toFixed(2)}%)</span>
          </div>
        )}
      </Link>
    </li>
  );
};

export default CoinListSidebarItem;