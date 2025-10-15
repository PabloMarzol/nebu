// WebSocket simulation for real-time updates
export class MockWebSocket {
  private callbacks: { [key: string]: Function[] } = {};
  private intervalId: NodeJS.Timeout | null = null;

  constructor(private url: string) {
    this.connect();
  }

  private connect() {
    // Simulate connection
    setTimeout(() => {
      this.emit('open', {});
      this.startPriceUpdates();
    }, 100);
  }

  private startPriceUpdates() {
    this.intervalId = setInterval(() => {
      // Simulate price updates
      const priceUpdate = {
        symbol: "BTC/USDT",
        price: (67834.50 * (1 + (Math.random() - 0.5) * 0.001)).toFixed(2),
        timestamp: Date.now()
      };
      
      this.emit('message', { data: JSON.stringify(priceUpdate) });
    }, 1000);
  }

  on(event: string, callback: Function) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  }

  private emit(event: string, data: any) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(callback => callback(data));
    }
  }

  close() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

export function createWebSocketConnection(url: string): MockWebSocket {
  return new MockWebSocket(url);
}
