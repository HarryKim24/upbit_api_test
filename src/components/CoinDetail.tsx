import CoinChart from "./CoinChart";
import CoinDescription from "./CoinDescription";
import CoinHeader from "./CoinHeader";
import CoinListSidebar from "./CoinListSidebar";

const CoinDetail = () => {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        padding: "1rem",
        boxSizing: "border-box",
      }}
    >
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <CoinHeader />
        <CoinChart />
        <CoinDescription />
      </main>

      <aside
        style={{
          width: "200px",
          paddingLeft: "0.5rem",
        }}
      >
        <CoinListSidebar />
      </aside>
    </div>
  );
};

export default CoinDetail;