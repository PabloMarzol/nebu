import { Request, Response, NextFunction } from "express";
import { storage } from "../storage";

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Get user from database
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication middleware error:", error);
    res.status(500).json({ message: "Authentication error" });
  }
};

export const requireEmailVerification = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.emailVerified) {
    return res.status(403).json({ 
      message: "Email verification required",
      code: "EMAIL_NOT_VERIFIED"
    });
  }
  next();
};

export const requireKYC = (minLevel: number = 1) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Simplified verification - email verification grants all access
    if (!req.user?.emailVerified) {
      return res.status(403).json({ 
        message: "Email verification required to access trading features",
        code: "EMAIL_VERIFICATION_REQUIRED"
      });
    }
    
    // All verified users get full access
    next();
  };
};

export const requireAccountTier = (minTier: string) => {
  const tierHierarchy = {
    basic: 1,
    verified: 2,
    premium: 3,
    institutional: 4
  };

  return (req: Request, res: Response, next: NextFunction) => {
    const userTierLevel = tierHierarchy[req.user?.accountTier as keyof typeof tierHierarchy] || 0;
    const requiredTierLevel = tierHierarchy[minTier as keyof typeof tierHierarchy] || 0;

    if (userTierLevel < requiredTierLevel) {
      return res.status(403).json({ 
        message: `${minTier} account tier required`,
        code: "INSUFFICIENT_TIER",
        currentTier: req.user?.accountTier || "basic",
        requiredTier: minTier
      });
    }
    next();
  };
};

export const checkTradingLimits = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amount } = req.body;
    const userId = req.user?.id;

    if (!userId || !amount) {
      return next();
    }

    // Get user's daily trading limit
    const dailyLimit = parseFloat(req.user.dailyTradingLimit || "1000");
    
    // Get today's trading volume for user
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaysTrades = await storage.getUserTradesFromDate(userId, today);
    const todaysVolume = todaysTrades.reduce((sum, trade) => sum + parseFloat(trade.amount), 0);
    
    const requestAmount = parseFloat(amount);
    
    if (todaysVolume + requestAmount > dailyLimit) {
      return res.status(403).json({
        message: "Daily trading limit exceeded",
        code: "DAILY_LIMIT_EXCEEDED",
        dailyLimit,
        currentVolume: todaysVolume,
        requestedAmount: requestAmount,
        remainingLimit: Math.max(0, dailyLimit - todaysVolume)
      });
    }

    next();
  } catch (error) {
    console.error("Trading limits check error:", error);
    next(); // Continue on error to avoid blocking legitimate trades
  }
};

export const requireTwoFactor = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.twoFactorEnabled) {
    return res.status(403).json({ 
      message: "Two-factor authentication required for this action",
      code: "2FA_REQUIRED"
    });
  }
  next();
};