import { Link, useParams } from "react-router-dom";
import CoinChart from "./CoinChart";
import CoinHeader from "./CoinHeader";
import CoinListSidebar from "./CoinListSidebar";
import useUpbitCoin from "../hooks/useUpbitCoin";
import { useUpbitTicker } from "../hooks/useUpbitTicker";

const CoinDetail = () => {

  const { marketId } = useParams<{ marketId: string }>();
  const { market, ticker, loading } = useUpbitCoin(marketId || "");
  const { currentPageMarkets, tickers } = useUpbitTicker(0);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          padding: "0.5rem 1rem",
          borderBottom: "1px solid #eee",
          backgroundColor: "#fafafa",
        }}
      >
        <Link to="/" style={{ textDecoration: "none", fontSize: "1.5rem", color: "#000000" }}>
          🏠 홈으로
        </Link>
      </div>

      <div
        style={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
        }}
      >
        <main
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            padding: "1rem",
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          {!loading && market && ticker && (
            <CoinHeader market={market} ticker={ticker} loading={loading} />
          )}
          <CoinChart />
        </main>

        <aside
          style={{
            width: "300px",
            padding: "1rem 0.5rem",
            boxSizing: "border-box",
          }}
        >
          {loading ? (
            <p>시세 불러오는 중...</p>
          ) : (
            <CoinListSidebar markets={currentPageMarkets} tickers={tickers} />
          )}
        </aside>
      </div>
    </div>
  );
};

export default CoinDetail;