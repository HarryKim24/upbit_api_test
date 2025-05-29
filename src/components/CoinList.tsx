import CoinItem from "./CoinItem";
import type { MarketItem, TickerItem } from "../types/upbitTypes";

type Props = {
  markets: MarketItem[];
  tickers: Record<string, TickerItem>;
};

const CoinList = ({ markets, tickers }: Props) => {
  return (
    <ul
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.5rem",
        padding: 0,
        margin: 0,
      }}
    >
      {markets.map((m) => (
        <CoinItem key={m.market} market={m} ticker={tickers[m.market]} />
      ))}
    </ul>
  );
};

export default CoinList;
