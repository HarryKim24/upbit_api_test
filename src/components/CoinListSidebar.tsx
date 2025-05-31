import type { MarketItem, TickerItem } from "../types/upbitTypes";
import CoinListSidebarItem from "./CoinListSidebarItem";

type Props = {
  markets: MarketItem[];
  tickers: Record<string, TickerItem>;
};

const CoinListSidebar = ({ markets, tickers }: Props) => {

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid #ddd",
        borderRadius: "6px",
        boxSizing: "border-box",
        overflow: "hidden",
        height: "calc(100vh - 82px)",
      }}
    >
      <div
        style={{
          padding: "1rem 0.5rem",
          borderBottom: "1px solid #eee",
          backgroundColor: "#fff",
          flexShrink: 0,
        }}
      >
        <h3 style={{ fontSize: "1rem", margin: 0 }}>📋 코인 리스트</h3>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0.5rem",
        }}
      >
        <ul
          style={{
            listStyle: "none",
            fontSize: "0.85rem",
            margin: 0,
          }}
        >
          {markets.map((m) => (
            <CoinListSidebarItem key={m.market} market={m} ticker={tickers[m.market]} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CoinListSidebar;