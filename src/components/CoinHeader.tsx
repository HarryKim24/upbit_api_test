import type { MarketItem, TickerItem } from "../types/upbitTypes";

type Props = {
  market: MarketItem;
  ticker: TickerItem;
  loading: boolean;
};

const CoinHeader = ({ market, ticker, loading }: Props) => {
  const isRising = ticker.change === "RISE";
  const isFalling = ticker.change === "FALL";
  const changeColor = isRising ? "#e11d48" : isFalling ? "#2563eb" : "#6b7280";

  if (loading) return <section>로딩 중...</section>;
  if (!market || !ticker) return <section>데이터 없음</section>;

  const changeRate = (ticker.change_rate * 100).toFixed(2);
  const changeRateDisplay = isRising ? `+${changeRate}` : changeRate;

  return (
    <section
      style={{
        padding: "1rem",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        backgroundColor: "#ffffff",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
        height: "80px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        fontSize: "0.9rem",
        lineHeight: 1.5,
      }}
    >
      <div style={{ fontWeight: 600, fontSize: "1.1rem", marginBottom: "0.25rem" }}>
        {market.korean_name}{" "}
        <span style={{ fontWeight: 400, color: "#6b7280" }}>({market.market})</span>
      </div>

      <div style={{ color: changeColor, fontWeight: 500 }}>
        <span style={{ color: "#6b7280" }}>현재가</span> {ticker.trade_price.toLocaleString()}원 &nbsp;&nbsp;|&nbsp;&nbsp;
        <span style={{ color: "#6b7280" }}>전일 대비</span> {changeRateDisplay}%
      </div>

      {market.market_event?.warning && (
        <div
          style={{ marginTop: "0.25rem", color: "#d97706", fontSize: "0.8rem" }}
        >
          유의 종목으로 지정되어 있습니다
        </div>
      )}
    </section>
  );
};

export default CoinHeader;