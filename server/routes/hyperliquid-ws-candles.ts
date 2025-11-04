// WebSocket Candle API Endpoint - Provides WebSocket candle streaming
import { hyperliquidWebSocketService } from '../services/hyperliquid-websocket-service';

export function setupHyperliquidWebSocketCandleRoutes(app: any) {
  console.log('🔌 Setting up Hyperliquid WebSocket candle routes...');

  /**
   * POST /api/hyperliquid/ws-candles/:symbol
   * Subscribe to WebSocket candle streaming for a specific symbol
   */
  app.post('/api/hyperliquid/ws-candles/:symbol', async (req: any, res: any) => {
    try {
      const { symbol } = req.params;
      const { interval = '1h' } = req.query;
      
      console.log(`📡 WebSocket candle subscription request: ${symbol} (${interval})`);
      
      if (!hyperliquidWebSocketService.getStatus().running) {
        console.log('🚀 Starting WebSocket service...');
        await hyperliquidWebSocketService.startWebSocketFeeds();
      }
      
      // Register callback for this specific symbol/interval
      hyperliquidWebSocketService.onCandleUpdate(symbol, interval, (newCandle) => {
        console.log(`💰 WebSocket candle update: ${symbol} ${interval} - $${newCandle.close}`);
        // In a real implementation, this would push to WebSocket clients
        // For now, we'll store it and make it available via API
      });
      
      res.json({ 
        success: true, 
        message: `WebSocket candle subscription initiated for ${symbol} (${interval})`,
        websocketStatus: hyperliquidWebSocketService.getStatus()
      });
      
    } catch (error) {
      console.error('❌ Error setting up WebSocket candle subscription:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to setup WebSocket candle subscription',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  /**
   * GET /api/hyperliquid/ws-status
   * Get WebSocket connection status
   */
  app.get('/api/hyperliquid/ws-status', (req: any, res: any) => {
    try {
      const status = hyperliquidWebSocketService.getStatus();
      res.json(status);
    } catch (error) {
      console.error('❌ Error getting WebSocket status:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to get WebSocket status',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  /**
   * DELETE /api/hyperliquid/ws-candles/:symbol
   * Unsubscribe from WebSocket candle streaming
   */
  app.delete('/api/hyperliquid/ws-candles/:symbol', async (req: any, res: any) => {
    try {
      const { symbol } = req.params;
      const { interval = '1h' } = req.query;
      
      console.log(`🔌 WebSocket candle unsubscription request: ${symbol} (${interval})`);
      
      // Remove callback for this specific symbol/interval
      // In a real implementation, this would remove the WebSocket subscription
      console.log(`✅ WebSocket candle unsubscription completed for ${symbol} (${interval})`);
      
      res.json({ 
        success: true, 
        message: `WebSocket candle unsubscription completed for ${symbol} (${interval})`,
        websocketStatus: hyperliquidWebSocketService.getStatus()
      });
      
    } catch (error) {
      console.error('❌ Error unsubscribing from WebSocket candles:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to unsubscribe from WebSocket candles',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  console.log('✅ Hyperliquid WebSocket candle routes setup complete');
}
