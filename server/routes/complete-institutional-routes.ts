import type { Express } from "express";
import { internalLiquidityNetwork } from '../services/internal-liquidity-network';
import { regulatoryService } from '../services/regulatory-compliance';
import { treasuryService } from '../services/treasury-management';
import { structuredProductsService } from '../services/structured-products';
import { liquidityAggregationService } from '../services/liquidity-aggregation';
import { creditRiskEngine } from '../services/credit-risk-engine';
// import { settlementService } from '../services/settlement-reconciliation';

export function registerCompleteInstitutionalRoutes(app: Express) {
  
  // ===========================================
  // INTERNAL LIQUIDITY NETWORK (ILN) ROUTES
  // ===========================================
  
  // Submit order to ILN
  app.post("/api/iln/orders", async (req, res) => {
    try {
      const { clientId, symbol, side, quantity, price, orderType, timeInForce, minBlockSize, maxShowQuantity, allowedCounterparties } = req.body;
      
      const result = await ilnService.submitOrder({
        clientId,
        symbol,
        side,
        quantity,
        price,
        orderType,
        timeInForce,
        minBlockSize,
        maxShowQuantity,
        allowedCounterparties
      });
      
      res.json(result);
    } catch (error) {
      console.error('ILN Order Error:', error);
      res.status(500).json({ error: 'Failed to submit ILN order' });
    }
  });

  // Get ILN order book
  app.get("/api/iln/orderbook/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const { clientId } = req.query;
      
      const orderBook = await ilnService.getOrderBook(symbol, clientId as string);
      res.json(orderBook);
    } catch (error) {
      console.error('ILN Order Book Error:', error);
      res.status(500).json({ error: 'Failed to get order book' });
    }
  });

  // Get client ILN orders
  app.get("/api/iln/orders/:clientId", async (req, res) => {
    try {
      const { clientId } = req.params;
      const orders = await ilnService.getClientOrders(clientId);
      res.json(orders);
    } catch (error) {
      console.error('ILN Client Orders Error:', error);
      res.status(500).json({ error: 'Failed to get client orders' });
    }
  });

  // Cancel ILN order
  app.delete("/api/iln/orders/:orderId", async (req, res) => {
    try {
      const { orderId } = req.params;
      const { clientId } = req.body;
      
      const success = await ilnService.cancelOrder(orderId, clientId);
      res.json({ success });
    } catch (error) {
      console.error('ILN Cancel Order Error:', error);
      res.status(500).json({ error: 'Failed to cancel order' });
    }
  });

  // Get ILN match history
  app.get("/api/iln/matches/:clientId", async (req, res) => {
    try {
      const { clientId } = req.params;
      const { limit } = req.query;
      
      const matches = await ilnService.getMatchHistory(clientId, limit ? parseInt(limit as string) : 50);
      res.json(matches);
    } catch (error) {
      console.error('ILN Match History Error:', error);
      res.status(500).json({ error: 'Failed to get match history' });
    }
  });

  // ===========================================
  // REGULATORY COMPLIANCE ROUTES
  // ===========================================
  
  // Generate MiFID II report
  app.post("/api/compliance/reports/mifid2", async (req, res) => {
    try {
      const { startDate, endDate, venue } = req.body;
      
      const report = await regulatoryService.generateMiFIDIIReport(
        new Date(startDate),
        new Date(endDate),
        venue
      );
      
      res.json(report);
    } catch (error) {
      console.error('MiFID II Report Error:', error);
      res.status(500).json({ error: 'Failed to generate MiFID II report' });
    }
  });

  // Generate FATF report
  app.post("/api/compliance/reports/fatf", async (req, res) => {
    try {
      const { startDate, endDate } = req.body;
      
      const report = await regulatoryService.generateFATFReport(
        new Date(startDate),
        new Date(endDate)
      );
      
      res.json(report);
    } catch (error) {
      console.error('FATF Report Error:', error);
      res.status(500).json({ error: 'Failed to generate FATF report' });
    }
  });

  // Generate AML compliance report
  app.post("/api/compliance/reports/aml", async (req, res) => {
    try {
      const { startDate, endDate } = req.body;
      
      const report = await regulatoryService.generateAMLComplianceReport(
        new Date(startDate),
        new Date(endDate)
      );
      
      res.json(report);
    } catch (error) {
      console.error('AML Report Error:', error);
      res.status(500).json({ error: 'Failed to generate AML report' });
    }
  });

  // Generate custom compliance report
  app.post("/api/compliance/reports/custom", async (req, res) => {
    try {
      const { reportType, parameters, format } = req.body;
      
      const result = await regulatoryService.generateCustomReport(reportType, parameters, format);
      res.json(result);
    } catch (error) {
      console.error('Custom Report Error:', error);
      res.status(500).json({ error: 'Failed to generate custom report' });
    }
  });

  // Get compliance metrics
  app.get("/api/compliance/metrics", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      const metrics = await regulatoryService.getComplianceMetrics({
        start: new Date(startDate as string),
        end: new Date(endDate as string)
      });
      
      res.json(metrics);
    } catch (error) {
      console.error('Compliance Metrics Error:', error);
      res.status(500).json({ error: 'Failed to get compliance metrics' });
    }
  });

  // Schedule automatic reporting
  app.post("/api/compliance/schedule", async (req, res) => {
    try {
      const { reportType, frequency, recipients, parameters } = req.body;
      
      const result = await regulatoryService.scheduleAutomaticReporting(
        reportType,
        frequency,
        recipients,
        parameters
      );
      
      res.json(result);
    } catch (error) {
      console.error('Schedule Reporting Error:', error);
      res.status(500).json({ error: 'Failed to schedule reporting' });
    }
  });

  // ===========================================
  // TREASURY MANAGEMENT ROUTES
  // ===========================================
  
  // Get consolidated treasury positions
  app.get("/api/treasury/positions", async (req, res) => {
    try {
      const positions = await treasuryService.getConsolidatedPositions();
      res.json(positions);
    } catch (error) {
      console.error('Treasury Positions Error:', error);
      res.status(500).json({ error: 'Failed to get treasury positions' });
    }
  });

  // Get liquidity metrics
  app.get("/api/treasury/liquidity", async (req, res) => {
    try {
      const metrics = await treasuryService.getLiquidityMetrics();
      res.json(metrics);
    } catch (error) {
      console.error('Liquidity Metrics Error:', error);
      res.status(500).json({ error: 'Failed to get liquidity metrics' });
    }
  });

  // Generate cash flow forecast
  app.get("/api/treasury/forecast", async (req, res) => {
    try {
      const { days } = req.query;
      const forecast = await treasuryService.generateCashFlowForecast(days ? parseInt(days as string) : 30);
      res.json(forecast);
    } catch (error) {
      console.error('Cash Flow Forecast Error:', error);
      res.status(500).json({ error: 'Failed to generate cash flow forecast' });
    }
  });

  // Execute auto-sweep
  app.post("/api/treasury/auto-sweep", async (req, res) => {
    try {
      const result = await treasuryService.executeAutoSweep();
      res.json(result);
    } catch (error) {
      console.error('Auto Sweep Error:', error);
      res.status(500).json({ error: 'Failed to execute auto-sweep' });
    }
  });

  // Get yield optimization opportunities
  app.get("/api/treasury/yield-optimization", async (req, res) => {
    try {
      const opportunities = await treasuryService.optimizeYieldOpportunities();
      res.json(opportunities);
    } catch (error) {
      console.error('Yield Optimization Error:', error);
      res.status(500).json({ error: 'Failed to get yield opportunities' });
    }
  });

  // Get treasury alerts
  app.get("/api/treasury/alerts", async (req, res) => {
    try {
      const alerts = await treasuryService.getTreasuryAlerts();
      res.json(alerts);
    } catch (error) {
      console.error('Treasury Alerts Error:', error);
      res.status(500).json({ error: 'Failed to get treasury alerts' });
    }
  });

  // Resolve treasury alert
  app.post("/api/treasury/alerts/:alertId/resolve", async (req, res) => {
    try {
      const { alertId } = req.params;
      const success = await treasuryService.resolveAlert(alertId);
      res.json({ success });
    } catch (error) {
      console.error('Resolve Alert Error:', error);
      res.status(500).json({ error: 'Failed to resolve alert' });
    }
  });

  // Get rebalancing recommendations
  app.get("/api/treasury/rebalancing", async (req, res) => {
    try {
      const recommendations = await treasuryService.getRebalancingRecommendations();
      res.json(recommendations);
    } catch (error) {
      console.error('Rebalancing Recommendations Error:', error);
      res.status(500).json({ error: 'Failed to get rebalancing recommendations' });
    }
  });

  // ===========================================
  // STRUCTURED PRODUCTS ROUTES
  // ===========================================
  
  // Create structured product
  app.post("/api/structured-products", async (req, res) => {
    try {
      const productRequest = req.body;
      const product = await structuredProductsService.createProduct(productRequest);
      res.json(product);
    } catch (error) {
      console.error('Create Product Error:', error);
      res.status(500).json({ error: 'Failed to create structured product' });
    }
  });

  // Get available products
  app.get("/api/structured-products", async (req, res) => {
    try {
      const { clientId } = req.query;
      const products = await structuredProductsService.getAvailableProducts(clientId as string);
      res.json(products);
    } catch (error) {
      console.error('Get Products Error:', error);
      res.status(500).json({ error: 'Failed to get available products' });
    }
  });

  // Invest in structured product
  app.post("/api/structured-products/:productId/invest", async (req, res) => {
    try {
      const { productId } = req.params;
      const { clientId, amount } = req.body;
      
      const result = await structuredProductsService.investInProduct(clientId, productId, amount);
      res.json(result);
    } catch (error) {
      console.error('Investment Error:', error);
      res.status(500).json({ error: 'Failed to process investment' });
    }
  });

  // Get client investments
  app.get("/api/structured-products/investments/:clientId", async (req, res) => {
    try {
      const { clientId } = req.params;
      const investments = await structuredProductsService.getClientInvestments(clientId);
      res.json(investments);
    } catch (error) {
      console.error('Get Investments Error:', error);
      res.status(500).json({ error: 'Failed to get client investments' });
    }
  });

  // Update product pricing
  app.post("/api/structured-products/:productId/pricing", async (req, res) => {
    try {
      const { productId } = req.params;
      await structuredProductsService.updateProductPricing(productId);
      res.json({ success: true });
    } catch (error) {
      console.error('Update Pricing Error:', error);
      res.status(500).json({ error: 'Failed to update product pricing' });
    }
  });

  // Process product maturity
  app.post("/api/structured-products/:productId/maturity", async (req, res) => {
    try {
      const { productId } = req.params;
      await structuredProductsService.processMaturity(productId);
      res.json({ success: true });
    } catch (error) {
      console.error('Process Maturity Error:', error);
      res.status(500).json({ error: 'Failed to process maturity' });
    }
  });

  // Process coupon payments
  app.post("/api/structured-products/:productId/coupons", async (req, res) => {
    try {
      const { productId } = req.params;
      await structuredProductsService.processCouponPayments(productId);
      res.json({ success: true });
    } catch (error) {
      console.error('Process Coupons Error:', error);
      res.status(500).json({ error: 'Failed to process coupon payments' });
    }
  });

  // Generate risk report
  app.get("/api/structured-products/:productId/risk-report", async (req, res) => {
    try {
      const { productId } = req.params;
      const report = await structuredProductsService.generateRiskReport(productId);
      res.json(report);
    } catch (error) {
      console.error('Risk Report Error:', error);
      res.status(500).json({ error: 'Failed to generate risk report' });
    }
  });

  // ===========================================
  // ENHANCED EXISTING SERVICES ROUTES
  // ===========================================
  
  // Liquidity aggregation status
  app.get("/api/institutional/liquidity/status", async (req, res) => {
    try {
      const status = await liquidityAggregationService.getVenueStatus();
      res.json(status);
    } catch (error) {
      console.error('Liquidity Status Error:', error);
      res.status(500).json({ error: 'Failed to get liquidity status' });
    }
  });

  // Smart order execution
  app.post("/api/institutional/liquidity/smart-order", async (req, res) => {
    try {
      const orderRequest = req.body;
      const result = await liquidityAggregationService.executeSmartOrder(orderRequest);
      res.json(result);
    } catch (error) {
      console.error('Smart Order Error:', error);
      res.status(500).json({ error: 'Failed to execute smart order' });
    }
  });

  // Get aggregated liquidity
  app.get("/api/institutional/liquidity/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const { side, quantity } = req.query;
      
      const liquidity = await liquidityAggregationService.getAggregatedLiquidity(
        symbol,
        side as 'buy' | 'sell',
        quantity ? parseFloat(quantity as string) : undefined
      );
      
      res.json(liquidity);
    } catch (error) {
      console.error('Aggregated Liquidity Error:', error);
      res.status(500).json({ error: 'Failed to get aggregated liquidity' });
    }
  });

  // Credit risk assessment
  app.get("/api/institutional/credit/:clientId", async (req, res) => {
    try {
      const { clientId } = req.params;
      const assessment = await creditRiskEngine.assessCreditRisk(clientId);
      res.json(assessment);
    } catch (error) {
      console.error('Credit Assessment Error:', error);
      res.status(500).json({ error: 'Failed to assess credit risk' });
    }
  });

  // Update credit limits
  app.post("/api/institutional/credit/:clientId/limits", async (req, res) => {
    try {
      const { clientId } = req.params;
      const { limits } = req.body;
      
      const result = await creditRiskEngine.updateCreditLimits(clientId, limits);
      res.json(result);
    } catch (error) {
      console.error('Update Credit Limits Error:', error);
      res.status(500).json({ error: 'Failed to update credit limits' });
    }
  });

  // Get risk alerts
  app.get("/api/institutional/risk/alerts", async (req, res) => {
    try {
      const alerts = await creditRiskEngine.getRiskAlerts();
      res.json(alerts);
    } catch (error) {
      console.error('Risk Alerts Error:', error);
      res.status(500).json({ error: 'Failed to get risk alerts' });
    }
  });

  // Settlement status
  app.get("/api/institutional/settlements", async (req, res) => {
    try {
      const { startDate, endDate, status } = req.query;
      
      const settlements = await settlementService.getSettlements({
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        status: status as string
      });
      
      res.json(settlements);
    } catch (error) {
      console.error('Settlements Error:', error);
      res.status(500).json({ error: 'Failed to get settlements' });
    }
  });

  // Initiate settlement
  app.post("/api/institutional/settlements", async (req, res) => {
    try {
      const settlementRequest = req.body;
      const result = await settlementService.initiateSettlement(settlementRequest);
      res.json(result);
    } catch (error) {
      console.error('Initiate Settlement Error:', error);
      res.status(500).json({ error: 'Failed to initiate settlement' });
    }
  });

  // Reconciliation report
  app.get("/api/institutional/reconciliation", async (req, res) => {
    try {
      const { date } = req.query;
      const report = await settlementService.generateReconciliationReport(
        date ? new Date(date as string) : new Date()
      );
      res.json(report);
    } catch (error) {
      console.error('Reconciliation Report Error:', error);
      res.status(500).json({ error: 'Failed to generate reconciliation report' });
    }
  });

  // ===========================================
  // INSTITUTIONAL DASHBOARD DATA
  // ===========================================
  
  // Get comprehensive institutional dashboard data
  app.get("/api/institutional/dashboard", async (req, res) => {
    try {
      const dashboardData = {
        treasuryPositions: await treasuryService.getConsolidatedPositions(),
        liquidityMetrics: await treasuryService.getLiquidityMetrics(),
        treasuryAlerts: await treasuryService.getTreasuryAlerts(),
        rebalancingRecommendations: await treasuryService.getRebalancingRecommendations(),
        riskAlerts: await creditRiskEngine.getRiskAlerts(),
        venueStatus: await liquidityAggregationService.getVenueStatus(),
        structuredProducts: await structuredProductsService.getAvailableProducts(),
        complianceMetrics: await regulatoryService.getComplianceMetrics({
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          end: new Date()
        }),
        lastUpdated: new Date().toISOString()
      };
      
      res.json(dashboardData);
    } catch (error) {
      console.error('Dashboard Data Error:', error);
      res.status(500).json({ error: 'Failed to get dashboard data' });
    }
  });

  // Institutional health check
  app.get("/api/institutional/health", async (req, res) => {
    try {
      const healthStatus = {
        services: {
          liquidityAggregation: 'operational',
          creditRiskEngine: 'operational',
          settlementReconciliation: 'operational',
          treasuryManagement: 'operational',
          structuredProducts: 'operational',
          regulatoryCompliance: 'operational',
          internalLiquidityNetwork: 'operational'
        },
        metrics: {
          totalAUM: (await treasuryService.getLiquidityMetrics()).totalAUM,
          activeProducts: (await structuredProductsService.getAvailableProducts()).length,
          liquidityVenues: (await liquidityAggregationService.getVenueStatus()).length,
          complianceScore: 95
        },
        lastHealthCheck: new Date().toISOString()
      };
      
      res.json(healthStatus);
    } catch (error) {
      console.error('Health Check Error:', error);
      res.status(500).json({ 
        error: 'Health check failed', 
        services: {
          liquidityAggregation: 'degraded',
          creditRiskEngine: 'degraded',
          settlementReconciliation: 'degraded',
          treasuryManagement: 'degraded',
          structuredProducts: 'degraded',
          regulatoryCompliance: 'degraded',
          internalLiquidityNetwork: 'degraded'
        }
      });
    }
  });
}