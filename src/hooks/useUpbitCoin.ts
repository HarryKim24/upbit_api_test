import { useEffect, useState } from "react"
import { getMarketList, getTickerInfo } from "../api/upbitApi";
import type { MarketItem, TickerItem } from "../types/upbitTypes";

const useUpbitCoin = (marketCode: string) => {
  const [market, setMarket] = useState<MarketItem | null>(null);
  const [ticker, setTicker] = useState<TickerItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        setLoading(true);
        const allMarkets = await getMarketList();
        const found = allMarkets.find((m) => m.market === marketCode);
        setMarket(found || null);

        if (found) {
          const [tickerData] = await getTickerInfo([marketCode]);
          setTicker({ ...tickerData, market: tickerData.market });
        }
      } catch (e) {
        console.error("Failed to fetch coin info: ", e);
      } finally {
        setLoading(false);
      }
    };

    fetchCoinData();
  }, [marketCode]);

  return { market, ticker, loading };
}

export default useUpbitCoin;