const CoinListSidebar = () => {
  const dummyCoins = Array.from({ length: 150 }, (_, i) => `COIN-${i + 1}`);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "200px",
        border: "1px solid #ddd",
        borderRadius: "6px",
        boxSizing: "border-box",
        overflow: "hidden",
        height: "calc(100vh - 30px)",
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
          {dummyCoins.map((coin, idx) => (
            <li key={idx} style={{ padding: "0.25rem 0" }}>
              • {coin}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CoinListSidebar;