import { balanceManagementService } from './balance-management-service';
import { auditLoggingService } from './audit-logging-service';

interface RiskLimit {
  type: 'daily_volume' | 'position_size' | 'concentration' | 'frequency' | 'loss_limit';
  userId: string;
  currency?: string;
  symbol?: string;
  limit: number;
  current: number;
  percentage: number;
  resetTime?: Date;
}

interface RiskProfile {
  userId: string;
  tier: 'basic' | 'advanced' | 'professional' | 'institutional';
  maxDailyVolume: number;
  maxPositionSize: number;
  maxConcentration: number; // Max % of portfolio in single asset
  maxOrdersPerMinute: number;
  maxDailyLoss: number;
  marginEnabled: boolean;
  leverage: number;
  riskScore: number; // 0-100
  lastUpdated: Date;
}

interface PositionMonitor {
  userId: string;
  symbol: string;
  side: 'long' | 'short';
  size: number;
  entryPrice: number;
  currentPrice: number;
  unrealizedPnL: number;
  riskValue: number;
  marginUsed?: number;
  liquidationPrice?: number;
  riskPercentage: number;
}

interface RiskAlert {
  id: string;
  userId: string;
  type: 'limit_exceeded' | 'position_risk' | 'concentration_risk' | 'loss_limit' | 'margin_call';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  details: any;
  timestamp: Date;
  acknowledged: boolean;
}

class RiskManagementService {
  private riskProfiles: Map<string, RiskProfile> = new Map();
  private userLimits: Map<string, RiskLimit[]> = new Map();
  private positions: Map<string, PositionMonitor[]> = new Map();
  private riskAlerts: RiskAlert[] = [];
  private tradingActivity: Map<string, number[]> = new Map(); // userId -> timestamps

  constructor() {
    this.initializeDefaultRiskProfiles();
    this.startRiskMonitoring();
  }

  // Initialize default risk profiles
  private initializeDefaultRiskProfiles(): void {
    const defaultProfiles: Record<string, Partial<RiskProfile>> = {
      basic: {
        maxDailyVolume: 10000,
        maxPositionSize: 1000,
        maxConcentration: 30,
        maxOrdersPerMinute: 10,
        maxDailyLoss: 500,
        marginEnabled: false,
        leverage: 1,
        riskScore: 20
      },
      advanced: {
        maxDailyVolume: 50000,
        maxPositionSize: 5000,
        maxConcentration: 40,
        maxOrdersPerMinute: 30,
        maxDailyLoss: 2500,
        marginEnabled: true,
        leverage: 2,
        riskScore: 40
      },
      professional: {
        maxDailyVolume: 250000,
        maxPositionSize: 25000,
        maxConcentration: 50,
        maxOrdersPerMinute: 100,
        maxDailyLoss: 12500,
        marginEnabled: true,
        leverage: 5,
        riskScore: 60
      },
      institutional: {
        maxDailyVolume: 1000000,
        maxPositionSize: 100000,
        maxConcentration: 60,
        maxOrdersPerMinute: 500,
        maxDailyLoss: 50000,
        marginEnabled: true,
        leverage: 10,
        riskScore: 80
      }
    };

    // Create demo profiles
    Object.entries(defaultProfiles).forEach(([tier, profile]) => {
      this.riskProfiles.set(`demo_${tier}`, {
        userId: `demo_${tier}`,
        tier: tier as any,
        lastUpdated: new Date(),
        ...profile
      } as RiskProfile);
    });
  }

  // Set risk profile for user
  async setUserRiskProfile(
    userId: string,
    tier: 'basic' | 'advanced' | 'professional' | 'institutional',
    customLimits?: Partial<RiskProfile>
  ): Promise<RiskProfile> {
    const defaultProfile = this.riskProfiles.get(`demo_${tier}`);
    if (!defaultProfile) {
      throw new Error('Invalid risk tier');
    }

    const riskProfile: RiskProfile = {
      ...defaultProfile,
      userId,
      ...customLimits,
      lastUpdated: new Date()
    };

    this.riskProfiles.set(userId, riskProfile);
    
    // Initialize limits
    await this.initializeUserLimits(userId, riskProfile);
    
    await auditLoggingService.logCompliance(
      'aml_check',
      userId,
      'system',
      { action: 'risk_profile_set', tier, customLimits }
    );

    console.log(`[RiskManagement] Set ${tier} risk profile for user ${userId}`);
    return riskProfile;
  }

  // Initialize user limits based on risk profile
  private async initializeUserLimits(userId: string, profile: RiskProfile): Promise<void> {
    const limits: RiskLimit[] = [
      {
        type: 'daily_volume',
        userId,
        limit: profile.maxDailyVolume,
        current: 0,
        percentage: 0,
        resetTime: this.getNextDayReset()
      },
      {
        type: 'loss_limit',
        userId,
        limit: profile.maxDailyLoss,
        current: 0,
        percentage: 0,
        resetTime: this.getNextDayReset()
      }
    ];

    this.userLimits.set(userId, limits);
  }

  // Validate trading order against risk limits
  async validateTradingOrder(
    userId: string,
    symbol: string,
    side: 'buy' | 'sell',
    amount: number,
    price: number,
    ipAddress: string
  ): Promise<{ allowed: boolean; reason?: string; warnings?: string[] }> {
    const profile = this.riskProfiles.get(userId);
    if (!profile) {
      // Set default basic profile
      await this.setUserRiskProfile(userId, 'basic');
    }

    const warnings: string[] = [];
    const orderValue = amount * price;

    // Check frequency limits
    const frequencyCheck = this.checkOrderFrequency(userId);
    if (!frequencyCheck.allowed) {
      await this.createRiskAlert(userId, 'limit_exceeded', 'high', 
        `Order frequency limit exceeded: ${frequencyCheck.count} orders in last minute`,
        { orderFrequency: frequencyCheck.count, limit: profile?.maxOrdersPerMinute }
      );
      return { allowed: false, reason: 'Order frequency limit exceeded' };
    }

    // Check daily volume limit
    const volumeCheck = await this.checkDailyVolumeLimit(userId, orderValue);
    if (!volumeCheck.allowed) {
      await this.createRiskAlert(userId, 'limit_exceeded', 'medium',
        `Daily volume limit exceeded: $${volumeCheck.newTotal} > $${volumeCheck.limit}`,
        { currentVolume: volumeCheck.current, orderValue, limit: volumeCheck.limit }
      );
      return { allowed: false, reason: 'Daily volume limit exceeded' };
    }

    // Check position size limit
    const positionCheck = this.checkPositionSizeLimit(userId, symbol, amount, price);
    if (!positionCheck.allowed) {
      await this.createRiskAlert(userId, 'position_risk', 'medium',
        `Position size limit exceeded for ${symbol}`,
        { orderValue, limit: profile?.maxPositionSize }
      );
      return { allowed: false, reason: 'Position size limit exceeded' };
    }

    // Check concentration risk
    const concentrationCheck = await this.checkConcentrationRisk(userId, symbol, orderValue);
    if (!concentrationCheck.allowed) {
      warnings.push(`High concentration warning: ${concentrationCheck.percentage}% in ${symbol}`);
    }

    // Log successful validation
    await auditLoggingService.logTrading(
      'order_placed',
      userId,
      ipAddress,
      {
        symbol,
        side,
        amount,
        price,
        orderValue,
        riskChecks: {
          frequency: frequencyCheck,
          volume: volumeCheck,
          position: positionCheck,
          concentration: concentrationCheck
        }
      }
    );

    return { allowed: true, warnings: warnings.length > 0 ? warnings : undefined };
  }

  // Check order frequency
  private checkOrderFrequency(userId: string): { allowed: boolean; count: number } {
    const now = Date.now();
    const oneMinuteAgo = now - 60 * 1000;
    
    const userActivity = this.tradingActivity.get(userId) || [];
    const recentOrders = userActivity.filter(timestamp => timestamp > oneMinuteAgo);
    
    // Add current order
    recentOrders.push(now);
    this.tradingActivity.set(userId, recentOrders);
    
    const profile = this.riskProfiles.get(userId);
    const limit = profile?.maxOrdersPerMinute || 10;
    
    return {
      allowed: recentOrders.length <= limit,
      count: recentOrders.length
    };
  }

  // Check daily volume limit
  private async checkDailyVolumeLimit(userId: string, orderValue: number): Promise<{
    allowed: boolean;
    current: number;
    limit: number;
    newTotal: number;
  }> {
    const limits = this.userLimits.get(userId) || [];
    const volumeLimit = limits.find(l => l.type === 'daily_volume');
    
    if (!volumeLimit) {
      return { allowed: true, current: 0, limit: 0, newTotal: orderValue };
    }

    const newTotal = volumeLimit.current + orderValue;
    const allowed = newTotal <= volumeLimit.limit;
    
    if (allowed) {
      volumeLimit.current = newTotal;
      volumeLimit.percentage = (newTotal / volumeLimit.limit) * 100;
    }

    return {
      allowed,
      current: volumeLimit.current,
      limit: volumeLimit.limit,
      newTotal
    };
  }

  // Check position size limit
  private checkPositionSizeLimit(userId: string, symbol: string, amount: number, price: number): {
    allowed: boolean;
    orderValue: number;
    limit: number;
  } {
    const profile = this.riskProfiles.get(userId);
    const orderValue = amount * price;
    const limit = profile?.maxPositionSize || 1000;
    
    return {
      allowed: orderValue <= limit,
      orderValue,
      limit
    };
  }

  // Check concentration risk
  private async checkConcentrationRisk(userId: string, symbol: string, orderValue: number): Promise<{
    allowed: boolean;
    percentage: number;
    limit: number;
  }> {
    const profile = this.riskProfiles.get(userId);
    const limit = profile?.maxConcentration || 30;
    
    // Get user's portfolio value
    const portfolioValue = await balanceManagementService.getPortfolioValue(userId);
    
    if (portfolioValue === 0) {
      return { allowed: true, percentage: 0, limit };
    }
    
    // Calculate concentration percentage
    const percentage = (orderValue / portfolioValue) * 100;
    
    return {
      allowed: percentage <= limit,
      percentage,
      limit
    };
  }

  // Monitor positions for risk
  async monitorPositions(userId: string): Promise<PositionMonitor[]> {
    const userPositions = this.positions.get(userId) || [];
    const riskPositions: PositionMonitor[] = [];
    
    for (const position of userPositions) {
      // Calculate current risk metrics
      const unrealizedPnL = this.calculateUnrealizedPnL(position);
      const riskPercentage = this.calculatePositionRisk(position);
      
      if (riskPercentage > 80) {
        await this.createRiskAlert(userId, 'position_risk', 'high',
          `High risk position in ${position.symbol}: ${riskPercentage}% risk`,
          { position, riskPercentage }
        );
      }
      
      riskPositions.push({
        ...position,
        unrealizedPnL,
        riskPercentage
      });
    }
    
    return riskPositions;
  }

  // Calculate unrealized P&L
  private calculateUnrealizedPnL(position: PositionMonitor): number {
    const priceDiff = position.currentPrice - position.entryPrice;
    return position.side === 'long' ? priceDiff * position.size : -priceDiff * position.size;
  }

  // Calculate position risk percentage
  private calculatePositionRisk(position: PositionMonitor): number {
    const unrealizedPnL = this.calculateUnrealizedPnL(position);
    const riskValue = Math.abs(unrealizedPnL);
    return (riskValue / position.riskValue) * 100;
  }

  // Create risk alert
  private async createRiskAlert(
    userId: string,
    type: RiskAlert['type'],
    severity: RiskAlert['severity'],
    message: string,
    details: any
  ): Promise<void> {
    const alert: RiskAlert = {
      id: this.generateAlertId(),
      userId,
      type,
      severity,
      message,
      details,
      timestamp: new Date(),
      acknowledged: false
    };

    this.riskAlerts.push(alert);
    
    // Keep only last 1000 alerts
    if (this.riskAlerts.length > 1000) {
      this.riskAlerts = this.riskAlerts.slice(-1000);
    }

    // Log to audit system
    await auditLoggingService.logSecurity(
      'suspicious_activity',
      'system',
      { riskAlert: alert },
      userId
    );

    console.log(`[RiskAlert] ${severity.toUpperCase()} - ${type}: ${message} (User: ${userId})`);
  }

  // Get user risk limits
  getUserLimits(userId: string): RiskLimit[] {
    return this.userLimits.get(userId) || [];
  }

  // Get user risk profile
  getUserRiskProfile(userId: string): RiskProfile | undefined {
    return this.riskProfiles.get(userId);
  }

  // Get risk alerts for user
  getUserRiskAlerts(userId: string, acknowledged?: boolean): RiskAlert[] {
    return this.riskAlerts
      .filter(alert => 
        alert.userId === userId && 
        (acknowledged === undefined || alert.acknowledged === acknowledged)
      )
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Acknowledge risk alert
  acknowledgeAlert(alertId: string, userId: string): boolean {
    const alert = this.riskAlerts.find(a => a.id === alertId && a.userId === userId);
    if (alert) {
      alert.acknowledged = true;
      return true;
    }
    return false;
  }

  // Get risk statistics
  getRiskStats(): {
    totalProfiles: number;
    alertsByType: Record<string, number>;
    alertsBySeverity: Record<string, number>;
    recentAlerts: RiskAlert[];
    riskDistribution: Record<string, number>;
  } {
    const alertsByType: Record<string, number> = {};
    const alertsBySeverity: Record<string, number> = {};
    const riskDistribution: Record<string, number> = {};

    this.riskAlerts.forEach(alert => {
      alertsByType[alert.type] = (alertsByType[alert.type] || 0) + 1;
      alertsBySeverity[alert.severity] = (alertsBySeverity[alert.severity] || 0) + 1;
    });

    Array.from(this.riskProfiles.values()).forEach(profile => {
      riskDistribution[profile.tier] = (riskDistribution[profile.tier] || 0) + 1;
    });

    const recentAlerts = this.riskAlerts
      .filter(alert => Date.now() - alert.timestamp.getTime() < 24 * 60 * 60 * 1000)
      .slice(-20);

    return {
      totalProfiles: this.riskProfiles.size,
      alertsByType,
      alertsBySeverity,
      recentAlerts,
      riskDistribution
    };
  }

  // Helper methods
  private getNextDayReset(): Date {
    const tomorrow = new Date();
    tomorrow.setUTCHours(0, 0, 0, 0);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    return tomorrow;
  }

  private generateAlertId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Start risk monitoring
  private startRiskMonitoring(): void {
    // Reset daily limits at midnight UTC
    setInterval(() => {
      const now = new Date();
      if (now.getUTCHours() === 0 && now.getUTCMinutes() === 0) {
        this.resetDailyLimits();
      }
    }, 60 * 1000); // Check every minute

    // Monitor positions every 30 seconds
    setInterval(() => {
      this.monitorAllPositions();
    }, 30 * 1000);

    console.log('[RiskManagement] Risk monitoring started');
  }

  // Reset daily limits
  private resetDailyLimits(): void {
    for (const limits of this.userLimits.values()) {
      limits.forEach(limit => {
        if (limit.type === 'daily_volume' || limit.type === 'loss_limit') {
          limit.current = 0;
          limit.percentage = 0;
          limit.resetTime = this.getNextDayReset();
        }
      });
    }
    console.log('[RiskManagement] Daily limits reset');
  }

  // Monitor all positions
  private async monitorAllPositions(): Promise<void> {
    for (const userId of this.positions.keys()) {
      await this.monitorPositions(userId);
    }
  }
}

export const riskManagementService = new RiskManagementService();