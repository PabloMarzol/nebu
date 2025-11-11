import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { alt5TradingService } from './services/alt5-trading-service';
import { db } from './db';
import { fxSwapOrders } from '@shared/fx_swap_schema';
import { eq } from 'drizzle-orm';

interface OrderUpdate {
  orderId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  txHash?: string;
  depositAddress?: string;
  errorMessage?: string;
  timestamp: string;
}

class WebSocketServer {
  private io: SocketIOServer | null = null;
  private orderPollingIntervals: Map<string, NodeJS.Timeout> = new Map();

  initialize(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST"]
      }
    });

    this.setupEventHandlers();
    console.log('WebSocket server initialized');
  }

  private setupEventHandlers() {
    if (!this.io) return;

    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('subscribe-order', (orderId: string) => {
        console.log(`Client subscribed to order: ${orderId}`);
        socket.join(`order-${orderId}`);
        
        // Start polling for this order if not already polling
        this.startOrderPolling(orderId);
      });

      socket.on('unsubscribe-order', (orderId: string) => {
        console.log(`Client unsubscribed from order: ${orderId}`);
        socket.leave(`order-${orderId}`);
        
        // Stop polling if no more subscribers
        const room = this.io?.sockets.adapter.rooms.get(`order-${orderId}`);
        if (!room || room.size === 0) {
          this.stopOrderPolling(orderId);
        }
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  private startOrderPolling(orderId: string) {
    if (this.orderPollingIntervals.has(orderId)) {
      return; // Already polling this order
    }

    const interval = setInterval(async () => {
      try {
        const order = await db.select().from(fxSwapOrders)
          .where(eq(fxSwapOrders.id, orderId))
          .limit(1);

        if (order.length === 0) {
          this.stopOrderPolling(orderId);
          return;
        }

        const orderData = order[0];
        
        // Get updated status from ALT5
        const accountDetails = await alt5TradingService.getUserAccountDetails(orderData.userId);
        if (!accountDetails) {
          return;
        }

        const ordersResponse = await alt5TradingService.getActiveOrders(accountDetails.alt5AccountId);
        let currentStatus = 'pending';
        let depositAddress = null;

        if (ordersResponse.status === 'success' && ordersResponse.data) {
          const activeOrder = ordersResponse.data.find((order: any) => 
            order.id === orderId || order.clientOrderId === orderId
          );
          
          if (activeOrder) {
            currentStatus = activeOrder.status || 'processing';
          } else {
            // Check order history
            const historyResponse = await alt5TradingService.getOrderHistory(accountDetails.alt5AccountId);
            if (historyResponse.status === 'success' && historyResponse.data) {
              const completedOrder = historyResponse.data.find((order: any) => 
                order.id === orderId || order.clientOrderId === orderId
              );
              if (completedOrder) {
                currentStatus = completedOrder.status || 'completed';
                if (currentStatus === 'completed') {
                  // Try to get deposit address
                  try {
                    const depositResponse = await alt5TradingService.getDepositAddress(
                      accountDetails.alt5AccountId,
                      'BankWireTransfer',
                      orderData.targetToken.toLowerCase()
                    );
                    if (depositResponse.status === 'success' && depositResponse.data) {
                      depositAddress = depositResponse.data.depositAddress || depositResponse.data.address;
                    }
                  } catch (depositError) {
                    console.log('Deposit address not available for completed order:', depositError);
                  }
                }
              }
            }
          }
        }

        // Emit update to all subscribers
        const update: OrderUpdate = {
          orderId,
          status: currentStatus as any,
          depositAddress,
          timestamp: new Date().toISOString()
        };

        this.io?.to(`order-${orderId}`).emit('order-update', update);

        // If order is completed or failed, stop polling
        if (currentStatus === 'completed' || currentStatus === 'failed') {
          this.stopOrderPolling(orderId);
        }

      } catch (error) {
        console.error(`Error polling order ${orderId}:`, error);
      }
    }, 5000); // Poll every 5 seconds

    this.orderPollingIntervals.set(orderId, interval);
  }

  private stopOrderPolling(orderId: string) {
    const interval = this.orderPollingIntervals.get(orderId);
    if (interval) {
      clearInterval(interval);
      this.orderPollingIntervals.delete(orderId);
      console.log(`Stopped polling for order: ${orderId}`);
    }
  }

  // Method to manually emit order updates (for webhooks, etc.)
  emitOrderUpdate(orderId: string, update: Partial<OrderUpdate>) {
    if (!this.io) return;

    const fullUpdate: OrderUpdate = {
      orderId,
      status: update.status || 'pending',
      txHash: update.txHash,
      depositAddress: update.depositAddress,
      errorMessage: update.errorMessage,
      timestamp: update.timestamp || new Date().toISOString()
    };

    this.io.to(`order-${orderId}`).emit('order-update', fullUpdate);
  }

  // Method to broadcast system-wide events
  broadcastEvent(event: string, data: any) {
    if (!this.io) return;
    this.io.emit(event, data);
  }

  getConnectedClients(): number {
    if (!this.io) return 0;
    return this.io.engine.clientsCount;
  }
}

export const websocketServer = new WebSocketServer();
