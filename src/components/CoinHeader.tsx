import { useEffect, useRef, useState } from "react";
import type { MarketItem, TickerItem } from "../types/upbitTypes";

type Props = {
  market: MarketItem;
  ticker: TickerItem;
  loading: boolean;
};

const CoinHeader = ({ market, ticker, loading }: Props) => {
  const [liveTicker, setLiveTicker] = useState<TickerItem>(ticker);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!market?.market) return;

    const currentSocket = socketRef.current;
    if (
      currentSocket &&
      (currentSocket.readyState === WebSocket.OPEN ||
        currentSocket.readyState === WebSocket.CONNECTING)
    ) {
      currentSocket.close();
    }

    const timeoutId = setTimeout(() => {
      const socket = new WebSocket("wss://api.upbit.com/websocket/v1");
      socketRef.current = socket;

      socket.onopen = () => {
        socket.send(
          JSON.stringify([
            { ticket: "coin-header" },
            { type: "ticker", codes: [market.market] },
          ])
        );
      };

      socket.onmessage = async (e) => {
        try {
          const buffer = await (e.data as Blob).arrayBuffer();
          const raw = JSON.parse(new TextDecoder().decode(buffer));
          if (raw.code && raw.trade_price) {
            setLiveTicker({
              market: raw.code,
              trade_price: raw.trade_price,
              change: raw.change,
              change_rate: raw.change_rate,
            });
          }
        } catch (err) {
          console.error("❌ JSON Parse Error:", err);
        }
      };

      socket.onerror = (e) => {
        console.error("WebSocket error:", e);
      };
    }, 50);

    return () => {
      clearTimeout(timeoutId);
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [market]);

  if (loading || !market || !liveTicker) return <section>로딩 중...</section>;

  const isRising = liveTicker.change === "RISE";
  const isFalling = liveTicker.change === "FALL";
  const changeColor = isRising ? "#e11d48" : isFalling ? "#2563eb" : "#6b7280";
  const changeRateValue = (liveTicker.change_rate * 100).toFixed(2);
  const changeRateDisplay =
    isRising
      ? `+${changeRateValue}`
      : isFalling
      ? `-${changeRateValue}`
      : `${changeRateValue}`;

  return (
    <section
      style={{
        padding: "1rem",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        backgroundColor: "#fff",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
        height: "80px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        fontSize: "0.9rem",
        lineHeight: 1.5,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.25rem",
          fontSize: "1.1rem",
          fontWeight: 600,
        }}
      >
        <div>
          {market.korean_name}{" "}
          <span style={{ fontWeight: 400, color: "#6b7280" }}>
            ({market.market})
          </span>
        </div>
        {market.market_event?.warning && (
          <div style={{ color: "#d97706", fontSize: "1rem", fontWeight: 500 }}>
            ⚠️ 유의 종목
          </div>
        )}
      </div>

      <div style={{ color: changeColor, fontWeight: 500 }}>
        <span style={{ color: "#6b7280" }}>현재가</span>{" "}
        {liveTicker.trade_price.toLocaleString()}원 &nbsp;&nbsp;|&nbsp;&nbsp;
        <span style={{ color: "#6b7280" }}>전일 대비</span> {changeRateDisplay}%
      </div>
    </section>
  );
};

export default CoinHeader;