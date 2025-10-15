import { Request, Response } from "express";

export async function getAPIStatus(req: Request, res: Response) {
  const services = {
    marketData: {
      cryptocompare: !!process.env.CRYPTOCOMPARE_API_KEY,
      coinapi: !!process.env.COINAPI_KEY,
      coinbase: !!(process.env.COINBASE_API_KEY && process.env.COINBASE_SECRET_KEY),
      status: "operational"
    },
    blockchain: {
      infura: !!process.env.INFURA_PROJECT_ID,
      status: process.env.INFURA_PROJECT_ID ? "operational" : "limited"
    },
    email: {
      sendgrid: !!process.env.SENDGRID_API_KEY,
      status: process.env.SENDGRID_API_KEY ? "operational" : "console-only"
    },
    trading: {
      engine: true,
      orderBooks: true,
      riskManagement: true,
      status: "operational"
    },
    platform: {
      database: true,
      authentication: true,
      sessions: true,
      status: "operational"
    }
  };

  const overallStatus = Object.values(services).every(service => 
    service.status === "operational" || service.status === "limited"
  ) ? "operational" : "degraded";

  res.json({
    status: overallStatus,
    timestamp: new Date().toISOString(),
    services,
    capabilities: {
      cryptoTrading: true,
      realTimeData: true,
      userManagement: true,
      orderMatching: true,
      portfolioTracking: true,
      emailNotifications: !!process.env.SENDGRID_API_KEY,
      blockchainIntegration: !!process.env.INFURA_PROJECT_ID
    }
  });
}