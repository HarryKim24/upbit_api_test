const CoinHeader = () => {
  return (
    <section
      style={{
        padding: "1rem",
        border: "1px solid #ddd",
        borderRadius: "6px",
        height: "80px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <h2>비트코인 (BTC)</h2>
      <p>현재가: 65,000,000원 | 전일대비 +2.5% (+1,500,000원)</p>
    </section>
  );
};

export default CoinHeader;