import { useEffect, useRef } from "react";

export const useTradeTicker = ({
  market,
  onTrade,
}: {
  market: string;
  onTrade: (trade: { price: number; volume: number; timestamp: number }) => void;
}) => {
  const socketRef = useRef<WebSocket | null>(null);
  const onTradeRef = useRef(onTrade);

  useEffect(() => {
    onTradeRef.current = onTrade;
  }, [onTrade]);

  useEffect(() => {
    let socket: WebSocket | null = null;
    let isClosed = false;

    const timeout = setTimeout(() => {
      socket = new WebSocket("wss://api.upbit.com/websocket/v1");
      socketRef.current = socket;

      socket.onopen = () => {
        if (isClosed) return;
        socket!.send(
          JSON.stringify([
            { ticket: `ticker-${Date.now()}` },
            { type: "trade", codes: [market] },
          ])
        );
      };

      socket.onmessage = async (event) => {
        try {
          const arrayBuffer = await event.data.arrayBuffer();
          const text = new TextDecoder("utf-8").decode(arrayBuffer);
          const data = JSON.parse(text);

          if (data.type === "trade") {
            onTradeRef.current({
              price: data.trade_price,
              volume: data.trade_volume,
              timestamp: data.timestamp,
            });
          }
        } catch (error) {
          console.error("❌ WebSocket 데이터 처리 실패:", error);
        }
      };

      socket.onerror = (err) => {
        if (!isClosed) {
          console.warn("⚠️ WebSocket 오류 발생:", err);
        }
      };

      socket.onclose = () => {
        if (!isClosed) {
          console.log("🔌 WebSocket 정상 종료");
        }
      };
    }, 50);

    return () => {
      isClosed = true;
      clearTimeout(timeout);
      if (
        socket &&
        (socket.readyState === WebSocket.OPEN ||
          socket.readyState === WebSocket.CONNECTING)
      ) {
        socket.close();
      }
    };
  }, [market]);
};