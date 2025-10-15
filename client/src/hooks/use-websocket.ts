import { useEffect, useRef, useState } from "react";
import { createWebSocketConnection, MockWebSocket } from "@/lib/websocket";

export function useWebSocket(url: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const ws = useRef<MockWebSocket | null>(null);

  useEffect(() => {
    ws.current = createWebSocketConnection(url);

    ws.current.on('open', () => {
      setIsConnected(true);
    });

    ws.current.on('message', (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        setLastMessage(data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    });

    ws.current.on('close', () => {
      setIsConnected(false);
    });

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url]);

  const sendMessage = (message: any) => {
    if (ws.current && isConnected) {
      // Mock send - in real implementation this would send via WebSocket
      console.log('Sending message:', message);
    }
  };

  return {
    isConnected,
    lastMessage,
    sendMessage
  };
}
