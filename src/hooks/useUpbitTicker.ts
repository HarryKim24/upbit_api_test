import { useEffect, useRef, useState } from "react";
import type { MarketItem, TickerItem } from "../types/upbitTypes";
import { getMarketList, getTickerInfo } from "../services/upbitApi";

const ITEMS_PER_PAGE = 100;

export const useUpbitTicker = (page: number) => {
  const [markets, setMarkets] = useState<MarketItem[]>([]);
  const [tickers, setTickers] = useState<Record<string, TickerItem>>({});
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const fetchMarkets = async () => {
      const allMarkets = await getMarketList();
      const krwMarkets = allMarkets.filter((m) => m.market.startsWith("KRW-"));
      setMarkets(krwMarkets);
    };
    fetchMarkets();
  }, []);

  useEffect(() => {
    if (markets.length === 0) return;

    const fetchTickers = async () => {
      setLoading(true);
      try {
        const pageMarkets = markets.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
        const codes = pageMarkets.map((m) => m.market);
        if (codes.length === 0) return;

        const tickerData = await getTickerInfo(codes);
        const tickerMap: Record<string, TickerItem> = {};
        tickerData.forEach((t) => {
          tickerMap[t.market] = t;
        });
        setTickers(tickerMap);
      } catch (e) {
        console.error("REST API fetch error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchTickers();
  }, [markets, page]);

  useEffect(() => {
    if (markets.length === 0) return;

    const pageMarkets = markets.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
    const codes = pageMarkets.map((m) => m.market);
    if (codes.length === 0) return;

    socketRef.current?.close();

    const socket = new WebSocket("wss://api.upbit.com/websocket/v1");
    socketRef.current = socket;

    socket.onopen = () => {
      socket.send(
        JSON.stringify([
          { ticket: "realtime" },
          { type: "ticker", codes, isOnlyRealtime: true },
        ])
      );
    };

    socket.onmessage = async (e) => {
      const buffer = await (e.data as Blob).arrayBuffer();
      const raw = JSON.parse(new TextDecoder().decode(buffer));
      const data: TickerItem = { ...raw, market: raw.code };

      setTickers((prev) => ({
        ...prev,
        [data.market]: data,
      }));
    };

    socket.onerror = (e) => {
      console.error("WebSocket error:", e);
    };

    return () => {
      socket.close();
    };
  }, [markets, page]);

  const currentPageMarkets = markets.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  return {
    loading,
    markets,
    tickers,
    totalPages: Math.ceil(markets.length / ITEMS_PER_PAGE),
    currentPageMarkets,
  };
};