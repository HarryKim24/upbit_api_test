import { Link } from "react-router-dom";
import CoinChart from "./CoinChart";
import CoinDescription from "./CoinDescription";
import CoinHeader from "./CoinHeader";
import CoinListSidebar from "./CoinListSidebar";

const CoinDetail = () => {
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
          <CoinHeader />
          <CoinChart />
          <CoinDescription />
        </main>

        <aside
          style={{
            width: "300px",
            padding: "1rem 0.5rem",
            boxSizing: "border-box",
          }}
        >
          <CoinListSidebar />
        </aside>
      </div>
    </div>
  );
};

export default CoinDetail;