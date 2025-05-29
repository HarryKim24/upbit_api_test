import { useState } from "react";
import { useUpbitTicker } from "../hooks/useUpbitTicker";
import CoinList from "./CoinList";

const AllCoins = () => {
  const [page, setPage] = useState(0);
  const { markets, tickers, loading, totalPages, currentPageMarkets } = useUpbitTicker(page);

  return (
    <div
      style={{
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <h2>📡 실시간 업비트 원화 마켓 시세</h2>
      <p>
        전체 {markets.length}개 | 페이지 {page + 1} / {totalPages}
      </p>
  
      {loading ? (
        <p>시세 불러오는 중...</p>
      ) : (
        <CoinList markets={currentPageMarkets} tickers={tickers} />
      )}
  
      <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
        <button onClick={() => setPage((p) => Math.max(p - 1, 0))} disabled={page === 0}>
          ◀ 이전
        </button>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
          disabled={page >= totalPages - 1}
        >
          다음 ▶
        </button>
      </div>
    </div>
  );
};

export default AllCoins;