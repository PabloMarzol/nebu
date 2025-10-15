import { EventEmitter } from 'events';

export interface LiquidityVenue {
  id: string;
  name: string;
  type: 'exchange' | 'otc' | 'dark_pool';
  status: 'active' | 'inactive' | 'maintenance';
  latency: number;
  reliability: number;
  fee: number;
}

export interface OrderRoute {
  venueId: string;
  quantity: number;
  price: number;
  estimatedFee: number;
  estimatedSlippage: number;
}

export interface SmartOrderRequest {
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  maxSlippage: number;
  timeLimit: number;
  clientId: string;
}

export class LiquidityAggregationService extends EventEmitter {
  private venues: Map<string, LiquidityVenue> = new Map();
  private priceFeeds: Map<string, any> = new Map();

  constructor() {
    super();
    this.initializeVenues();
  }

  private initializeVenues() {
    // Initialize major venues
    const venues: LiquidityVenue[] = [
      {
        id: 'binance',
        name: 'Binance',
        type: 'exchange',
        status: 'active',
        latency: 15,
        reliability: 0.995,
        fee: 0.001
      },
      {
        id: 'coinbase',
        name: 'Coinbase Pro',
        type: 'exchange', 
        status: 'active',
        latency: 25,
        reliability: 0.992,
        fee: 0.005
      },
      {
        id: 'kraken',
        name: 'Kraken',
        type: 'exchange',
        status: 'active',
        latency: 30,
        reliability: 0.990,
        fee: 0.0025
      },
      {
        id: 'genesis_otc',
        name: 'Genesis OTC',
        type: 'otc',
        status: 'active',
        latency: 500,
        reliability: 0.98,
        fee: 0.01
      }
    ];

    venues.forEach(venue => this.venues.set(venue.id, venue));
  }

  async getSmartOrderRouting(request: SmartOrderRequest): Promise<OrderRoute[]> {
    const activeVenues = Array.from(this.venues.values())
      .filter(v => v.status === 'active');

    // Calculate optimal routing based on liquidity, price, and fees
    const routes: OrderRoute[] = [];
    let remainingQuantity = request.quantity;

    for (const venue of activeVenues) {
      if (remainingQuantity <= 0) break;

      const venueQuote = await this.getVenueQuote(venue, request.symbol, request.side, remainingQuantity);
      
      if (venueQuote && venueQuote.slippage <= request.maxSlippage) {
        const routeQuantity = Math.min(remainingQuantity, venueQuote.availableQuantity);
        
        routes.push({
          venueId: venue.id,
          quantity: routeQuantity,
          price: venueQuote.price,
          estimatedFee: routeQuantity * venueQuote.price * venue.fee,
          estimatedSlippage: venueQuote.slippage
        });

        remainingQuantity -= routeQuantity;
      }
    }

    // Log routing decision for audit
    this.emit('routingDecision', {
      request,
      routes,
      timestamp: new Date(),
      totalFees: routes.reduce((sum, r) => sum + r.estimatedFee, 0),
      avgSlippage: routes.reduce((sum, r) => sum + r.estimatedSlippage, 0) / routes.length
    });

    return routes;
  }

  private async getVenueQuote(venue: LiquidityVenue, symbol: string, side: string, quantity: number) {
    // Simulate venue quote - in production, integrate with actual venue APIs
    const basePrice = 50000; // Example BTC price
    const liquidity = Math.random() * 100; // Available liquidity
    const slippage = Math.random() * 0.01; // 0-1% slippage

    return {
      price: basePrice * (1 + (side === 'buy' ? slippage : -slippage)),
      availableQuantity: Math.min(quantity, liquidity),
      slippage: slippage,
      timestamp: Date.now()
    };
  }

  async executeBestExecution(routes: OrderRoute[], clientId: string): Promise<any> {
    const executions = [];

    for (const route of routes) {
      try {
        const execution = await this.executeOnVenue(route, clientId);
        executions.push(execution);
        
        this.emit('execution', {
          venueId: route.venueId,
          quantity: route.quantity,
          price: execution.fillPrice,
          timestamp: new Date(),
          clientId
        });
      } catch (error) {
        this.emit('executionError', { route, error, clientId });
      }
    }

    return {
      executions,
      totalFilled: executions.reduce((sum, e) => sum + e.quantity, 0),
      avgPrice: executions.reduce((sum, e) => sum + (e.quantity * e.fillPrice), 0) / 
                executions.reduce((sum, e) => sum + e.quantity, 0),
      totalFees: executions.reduce((sum, e) => sum + e.fee, 0)
    };
  }

  private async executeOnVenue(route: OrderRoute, clientId: string) {
    // Simulate venue execution - integrate with actual venue APIs
    return {
      venueId: route.venueId,
      quantity: route.quantity,
      fillPrice: route.price * (0.999 + Math.random() * 0.002), // Slight variation
      fee: route.estimatedFee,
      executionId: `${route.venueId}_${Date.now()}`,
      timestamp: new Date()
    };
  }

  getVenueStatus(): LiquidityVenue[] {
    return Array.from(this.venues.values());
  }

  async getBestPricing(symbol: string, quantity: number): Promise<any> {
    const venues = Array.from(this.venues.values()).filter(v => v.status === 'active');
    const quotes = [];

    for (const venue of venues) {
      const buyQuote = await this.getVenueQuote(venue, symbol, 'buy', quantity);
      const sellQuote = await this.getVenueQuote(venue, symbol, 'sell', quantity);
      
      quotes.push({
        venueId: venue.id,
        venueName: venue.name,
        buyPrice: buyQuote?.price,
        sellPrice: sellQuote?.price,
        spread: buyQuote && sellQuote ? buyQuote.price - sellQuote.price : null,
        liquidity: Math.min(buyQuote?.availableQuantity || 0, sellQuote?.availableQuantity || 0)
      });
    }

    return quotes.sort((a, b) => (a.spread || Infinity) - (b.spread || Infinity));
  }
}

export const liquidityAggregationService = new LiquidityAggregationService();