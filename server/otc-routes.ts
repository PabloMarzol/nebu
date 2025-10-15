import type { Express } from "express";
import { createServer, type Server } from "http";
import { otcStorage } from "./otc-storage";
import { otcPricingService } from "./services/otc-pricing-service";
import { otcSettlementService } from "./services/otc-settlement-service";
import { verifyWalletAuth } from "./middleware/walletAuth";
import { insertOTCDealSchema, insertOTCQuoteSchema, insertBlockTradeSchema, insertLiquidityPoolSchema, insertSettlementInstructionSchema, insertCreditLineSchema } from "../shared/otc-schema";

export async function registerOTCRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', verifyWalletAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await otcStorage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // OTC Deal routes
  app.get('/api/otc/deals', async (req, res) => {
    try {
      const { asset, type, visibility, minAmount, maxAmount, status } = req.query;
      const deals = await otcStorage.getOTCDeals({
        asset: asset as string,
        type: type as string,
        visibility: visibility as string,
        minAmount: minAmount as string,
        maxAmount: maxAmount as string,
        status: status as string,
      });
      res.json(deals);
    } catch (error) {
      console.error("Error fetching OTC deals:", error);
      res.status(500).json({ message: "Failed to fetch OTC deals" });
    }
  });

  app.post('/api/otc/deals', verifyWalletAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertOTCDealSchema.parse({ ...req.body, clientId: userId });
      const deal = await otcStorage.createOTCDeal(validatedData);
      res.status(201).json(deal);
    } catch (error) {
      console.error("Error creating OTC deal:", error);
      res.status(500).json({ message: "Failed to create OTC deal" });
    }
  });

  app.get('/api/otc/deals/:dealId', async (req, res) => {
    try {
      const { dealId } = req.params;
      const deal = await otcStorage.getOTCDealById(dealId);
      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }
      res.json(deal);
    } catch (error) {
      console.error("Error fetching OTC deal:", error);
      res.status(500).json({ message: "Failed to fetch OTC deal" });
    }
  });

  app.patch('/api/otc/deals/:dealId/match', verifyWalletAuth, async (req: any, res) => {
    try {
      const { dealId } = req.params;
      const counterpartyId = req.user.claims.sub;
      const deal = await otcStorage.matchOTCDeal(dealId, counterpartyId);
      res.json(deal);
    } catch (error) {
      console.error("Error matching OTC deal:", error);
      res.status(500).json({ message: "Failed to match OTC deal" });
    }
  });

  // Quote routes
  app.post('/api/otc/quotes', verifyWalletAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertOTCQuoteSchema.parse({ ...req.body, clientId: userId });
      const quote = await otcStorage.createQuoteRequest(validatedData);
      res.status(201).json(quote);
    } catch (error) {
      console.error("Error creating quote request:", error);
      res.status(500).json({ message: "Failed to create quote request" });
    }
  });

  app.get('/api/otc/quotes', verifyWalletAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const quotes = await otcStorage.getQuoteRequests(userId);
      res.json(quotes);
    } catch (error) {
      console.error("Error fetching quotes:", error);
      res.status(500).json({ message: "Failed to fetch quotes" });
    }
  });

  app.patch('/api/otc/quotes/:quoteId/price', async (req, res) => {
    try {
      const { quoteId } = req.params;
      const { price, spread } = req.body;
      const quote = await otcStorage.updateQuotePrice(quoteId, price, spread);
      res.json(quote);
    } catch (error) {
      console.error("Error updating quote price:", error);
      res.status(500).json({ message: "Failed to update quote price" });
    }
  });

  app.patch('/api/otc/quotes/:quoteId/accept', verifyWalletAuth, async (req, res) => {
    try {
      const { quoteId } = req.params;
      const quote = await otcStorage.acceptQuote(quoteId);
      res.json(quote);
    } catch (error) {
      console.error("Error accepting quote:", error);
      res.status(500).json({ message: "Failed to accept quote" });
    }
  });

  // Pricing routes
  app.post('/api/otc/pricing', verifyWalletAuth, async (req: any, res) => {
    try {
      const user = await otcStorage.getUser(req.user.claims.sub);
      const clientTier = user?.isInstitutional ? 'institutional' : 'retail';
      
      const pricingRequest = {
        ...req.body,
        clientTier
      };
      
      const pricing = await otcPricingService.getOTCPrice(pricingRequest);
      res.json(pricing);
    } catch (error) {
      console.error("Error getting OTC pricing:", error);
      res.status(500).json({ message: "Failed to get OTC pricing" });
    }
  });

  app.post('/api/otc/execution-strategy', verifyWalletAuth, async (req, res) => {
    try {
      const { baseCurrency, quoteCurrency, amount, side, executionType } = req.body;
      const strategy = await otcPricingService.calculateOptimalExecution(
        baseCurrency, quoteCurrency, amount, side, executionType
      );
      res.json(strategy);
    } catch (error) {
      console.error("Error calculating execution strategy:", error);
      res.status(500).json({ message: "Failed to calculate execution strategy" });
    }
  });

  // Block Trading routes
  app.post('/api/otc/block-trades', verifyWalletAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertBlockTradeSchema.parse({ ...req.body, buyerId: userId });
      const trade = await otcStorage.createBlockTrade(validatedData);
      res.status(201).json(trade);
    } catch (error) {
      console.error("Error creating block trade:", error);
      res.status(500).json({ message: "Failed to create block trade" });
    }
  });

  app.get('/api/otc/block-trades', verifyWalletAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const trades = await otcStorage.getBlockTrades(userId);
      res.json(trades);
    } catch (error) {
      console.error("Error fetching block trades:", error);
      res.status(500).json({ message: "Failed to fetch block trades" });
    }
  });

  app.patch('/api/otc/block-trades/:tradeId/execute', async (req, res) => {
    try {
      const { tradeId } = req.params;
      const trade = await otcStorage.executeBlockTrade(tradeId);
      res.json(trade);
    } catch (error) {
      console.error("Error executing block trade:", error);
      res.status(500).json({ message: "Failed to execute block trade" });
    }
  });

  // Liquidity Pool routes
  app.post('/api/otc/liquidity-pools', verifyWalletAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertLiquidityPoolSchema.parse({ ...req.body, providerId: userId });
      const pool = await otcStorage.createLiquidityPool(validatedData);
      res.status(201).json(pool);
    } catch (error) {
      console.error("Error creating liquidity pool:", error);
      res.status(500).json({ message: "Failed to create liquidity pool" });
    }
  });

  app.get('/api/otc/liquidity-pools', async (req, res) => {
    try {
      const { currency } = req.query;
      const pools = await otcStorage.getLiquidityPools(currency as string);
      res.json(pools);
    } catch (error) {
      console.error("Error fetching liquidity pools:", error);
      res.status(500).json({ message: "Failed to fetch liquidity pools" });
    }
  });

  // Settlement routes
  app.post('/api/otc/settlement/initiate', verifyWalletAuth, async (req, res) => {
    try {
      const settlement = await otcSettlementService.initiateSettlement(req.body);
      res.json(settlement);
    } catch (error) {
      console.error("Error initiating settlement:", error);
      res.status(500).json({ message: "Failed to initiate settlement" });
    }
  });

  app.get('/api/otc/settlement/:settlementId', async (req, res) => {
    try {
      const { settlementId } = req.params;
      const settlement = await otcSettlementService.getSettlementStatus(settlementId);
      res.json(settlement);
    } catch (error) {
      console.error("Error fetching settlement status:", error);
      res.status(500).json({ message: "Failed to fetch settlement status" });
    }
  });

  app.patch('/api/otc/settlement/:settlementId/confirm', async (req, res) => {
    try {
      const { settlementId } = req.params;
      const { side } = req.body;
      const settlement = await otcSettlementService.confirmSettlement(settlementId, side);
      res.json(settlement);
    } catch (error) {
      console.error("Error confirming settlement:", error);
      res.status(500).json({ message: "Failed to confirm settlement" });
    }
  });

  // Settlement Instructions routes
  app.post('/api/otc/settlement-instructions', verifyWalletAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertSettlementInstructionSchema.parse({ ...req.body, userId });
      const instruction = await otcStorage.addSettlementInstruction(validatedData);
      res.status(201).json(instruction);
    } catch (error) {
      console.error("Error adding settlement instruction:", error);
      res.status(500).json({ message: "Failed to add settlement instruction" });
    }
  });

  app.get('/api/otc/settlement-instructions', verifyWalletAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const instructions = await otcStorage.getSettlementInstructions(userId);
      res.json(instructions);
    } catch (error) {
      console.error("Error fetching settlement instructions:", error);
      res.status(500).json({ message: "Failed to fetch settlement instructions" });
    }
  });

  // Credit Line routes
  app.post('/api/otc/credit-lines', verifyWalletAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertCreditLineSchema.parse({ ...req.body, clientId: userId });
      const creditLine = await otcStorage.createCreditLine(validatedData);
      res.status(201).json(creditLine);
    } catch (error) {
      console.error("Error creating credit line:", error);
      res.status(500).json({ message: "Failed to create credit line" });
    }
  });

  app.get('/api/otc/credit-lines', verifyWalletAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const creditLines = await otcStorage.getCreditLines(userId);
      res.json(creditLines);
    } catch (error) {
      console.error("Error fetching credit lines:", error);
      res.status(500).json({ message: "Failed to fetch credit lines" });
    }
  });

  app.get('/api/otc/credit-utilization', verifyWalletAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const utilization = await otcSettlementService.getCreditLineUtilization(userId);
      res.json(utilization);
    } catch (error) {
      console.error("Error fetching credit utilization:", error);
      res.status(500).json({ message: "Failed to fetch credit utilization" });
    }
  });

  // Market Data routes
  app.get('/api/otc/markets', async (req, res) => {
    try {
      const { symbols } = req.query;
      const symbolArray = symbols ? (symbols as string).split(',') : undefined;
      const marketData = await otcStorage.getMarketData(symbolArray);
      res.json(marketData);
    } catch (error) {
      console.error("Error fetching market data:", error);
      res.status(500).json({ message: "Failed to fetch market data" });
    }
  });

  app.get('/api/otc/markets/:symbol', async (req, res) => {
    try {
      const { symbol } = req.params;
      const marketData = await otcStorage.getMarketDataBySymbol(symbol);
      if (!marketData) {
        return res.status(404).json({ message: "Market data not found" });
      }
      res.json(marketData);
    } catch (error) {
      console.error("Error fetching market data:", error);
      res.status(500).json({ message: "Failed to fetch market data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}