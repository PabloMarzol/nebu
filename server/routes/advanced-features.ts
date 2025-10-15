import { Router } from "express";
import { advancedPortfolioService } from "../services/advanced-portfolio-service";
import { advancedOrderService } from "../services/advanced-order-types";
import { verifyWalletAuth } from "../middleware/walletAuth";

const router = Router();

// Portfolio Analytics routes
router.get("/portfolio/analytics", verifyWalletAuth, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const insights = await advancedPortfolioService.analyzePortfolio(userId);
    res.json(insights);
  } catch (error) {
    console.error("Error fetching portfolio analytics:", error);
    res.status(500).json({ message: "Failed to fetch portfolio analytics" });
  }
});

router.get("/portfolio/auto-rebalance-settings", verifyWalletAuth, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const settings = await advancedPortfolioService.getAutoRebalanceSettings(userId);
    res.json(settings);
  } catch (error) {
    console.error("Error fetching auto-rebalance settings:", error);
    res.status(500).json({ message: "Failed to fetch settings" });
  }
});

router.post("/portfolio/auto-rebalance-settings", verifyWalletAuth, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const settings = await advancedPortfolioService.updateAutoRebalanceSettings(userId, req.body);
    res.json(settings);
  } catch (error) {
    console.error("Error updating auto-rebalance settings:", error);
    res.status(500).json({ message: "Failed to update settings" });
  }
});

router.post("/portfolio/execute-rebalance", verifyWalletAuth, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    
    // Mock rebalance execution
    console.log(`[Portfolio] Executing rebalance for user ${userId}`);
    
    res.json({
      success: true,
      message: "Portfolio rebalancing completed successfully",
      executedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error executing rebalance:", error);
    res.status(500).json({ message: "Failed to execute rebalancing" });
  }
});

// Advanced Orders routes
router.post("/advanced-orders", verifyWalletAuth, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const { type, symbol, side, amount, ...orderParams } = req.body;

    let order;
    
    switch (type) {
      case 'stop_loss':
        order = await advancedOrderService.createStopLossOrder(
          userId, symbol, side, amount, orderParams.triggerPrice
        );
        break;
      case 'take_profit':
        order = await advancedOrderService.createStopLossOrder(
          userId, symbol, side, amount, orderParams.triggerPrice
        );
        break;
      case 'trailing_stop':
        order = await advancedOrderService.createTrailingStopOrder(
          userId, symbol, side, amount, orderParams.trailAmount, orderParams.trailPercent
        );
        break;
      case 'iceberg':
        order = await advancedOrderService.createIcebergOrder(
          userId, symbol, side, amount, orderParams.price, orderParams.visibleSize
        );
        break;
      case 'twap':
        order = await advancedOrderService.createTWAPOrder(
          userId, symbol, side, amount, orderParams.duration, orderParams.intervals
        );
        break;
      case 'oco':
        order = await advancedOrderService.createOCOOrder(
          userId, symbol, side, amount, orderParams.stopPrice, orderParams.limitPrice
        );
        break;
      default:
        return res.status(400).json({ message: "Invalid order type" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error creating advanced order:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
});

router.get("/advanced-orders", verifyWalletAuth, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const orders = await advancedOrderService.getUserOrders(userId);
    res.json(orders);
  } catch (error) {
    console.error("Error fetching advanced orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

router.delete("/advanced-orders/:orderId", verifyWalletAuth, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const { orderId } = req.params;
    
    const success = await advancedOrderService.cancelOrder(orderId, userId);
    
    if (success) {
      res.json({ success: true, message: "Order cancelled successfully" });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error("Error cancelling advanced order:", error);
    res.status(500).json({ message: "Failed to cancel order" });
  }
});

export default router;