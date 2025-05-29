import { BrowserRouter, Routes, Route } from "react-router-dom";
import AllCoins from "./components/AllCoins";
import './App.css'
import CoinDetail from "./components/CoinDetail";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AllCoins />} />
        <Route path="/coin/:marketId" element={<CoinDetail />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
