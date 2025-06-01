import axios from "axios";
import type { MarketItem, TickerItem } from "../types/upbitTypes";

export const getMarketList = async (): Promise<MarketItem[]> => {
  const res = await axios.get('/api/v1/market/all?isDetails=true');
  return res.data;
};

export const getTickerInfo = async (markets: string[]): Promise<TickerItem[]> => {
  const marketStr = markets.join(',');
  const res = await axios.get(`/api/v1/ticker?markets=${marketStr}`);
  return res.data;
};
