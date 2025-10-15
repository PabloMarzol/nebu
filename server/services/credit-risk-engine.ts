import { EventEmitter } from 'events';

export interface CreditProfile {
  clientId: string;
  creditLimit: number;
  usedCredit: number;
  availableCredit: number;
  riskScore: number;
  tier: 'prime' | 'standard' | 'cautious' | 'restricted';
  lastUpdated: Date;
  collateralValue: number;
  marginRequirement: number;
}

export interface ExposureData {
  clientId: string;
  counterpartyId?: string;
  symbol: string;
  notional: number;
  marketValue: number;
  unrealizedPnL: number;
  marginUsed: number;
  riskWeight: number;
}

export interface RiskAlert {
  id: string;
  clientId: string;
  type: 'credit_breach' | 'margin_call' | 'concentration' | 'counterparty';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  threshold: number;
  currentValue: number;
  timestamp: Date;
  acknowledged: boolean;
}

export class CreditRiskEngine extends EventEmitter {
  private creditProfiles: Map<string, CreditProfile> = new Map();
  private exposures: Map<string, ExposureData[]> = new Map();
  private riskAlerts: Map<string, RiskAlert> = new Map();
  private riskLimits = {
    concentrationLimit: 0.25, // 25% max exposure to single asset
    leverageLimit: 10, // 10x max leverage
    varLimit: 0.05, // 5% daily VaR limit
    marginCallThreshold: 0.8 // Margin call at 80% margin utilization
  };

  constructor() {
    super();
    this.startRealTimeMonitoring();
  }

  async getCreditProfile(clientId: string): Promise<CreditProfile | undefined> {
    return this.creditProfiles.get(clientId);
  }

  async updateCreditProfile(clientId: string, updates: Partial<CreditProfile>): Promise<CreditProfile> {
    const existing = this.creditProfiles.get(clientId) || {
      clientId,
      creditLimit: 0,
      usedCredit: 0,
      availableCredit: 0,
      riskScore: 0,
      tier: 'standard' as const,
      lastUpdated: new Date(),
      collateralValue: 0,
      marginRequirement: 0
    };

    const updated = {
      ...existing,
      ...updates,
      availableCredit: (updates.creditLimit || existing.creditLimit) - 
                      (updates.usedCredit || existing.usedCredit),
      lastUpdated: new Date()
    };

    this.creditProfiles.set(clientId, updated);
    
    // Check for risk alerts after update
    await this.checkRiskLimits(clientId);
    
    this.emit('creditProfileUpdated', updated);
    return updated;
  }

  async addExposure(clientId: string, exposure: ExposureData): Promise<void> {
    const clientExposures = this.exposures.get(clientId) || [];
    clientExposures.push(exposure);
    this.exposures.set(clientId, clientExposures);

    // Update credit usage
    const totalNotional = clientExposures.reduce((sum, exp) => sum + Math.abs(exp.notional), 0);
    const totalMargin = clientExposures.reduce((sum, exp) => sum + exp.marginUsed, 0);

    await this.updateCreditProfile(clientId, {
      usedCredit: totalNotional,
      marginRequirement: totalMargin
    });

    this.emit('exposureAdded', { clientId, exposure });
  }

  async calculateRealTimeRisk(clientId: string): Promise<any> {
    const profile = this.creditProfiles.get(clientId);
    const exposures = this.exposures.get(clientId) || [];

    if (!profile) return null;

    // Calculate concentration risk
    const assetExposures = new Map<string, number>();
    exposures.forEach(exp => {
      const current = assetExposures.get(exp.symbol) || 0;
      assetExposures.set(exp.symbol, current + Math.abs(exp.notional));
    });

    const maxConcentration = Math.max(...Array.from(assetExposures.values())) / profile.creditLimit;
    
    // Calculate total exposure and leverage
    const totalExposure = exposures.reduce((sum, exp) => sum + Math.abs(exp.notional), 0);
    const totalCollateral = profile.collateralValue;
    const leverage = totalCollateral > 0 ? totalExposure / totalCollateral : 0;

    // Calculate unrealized P&L
    const unrealizedPnL = exposures.reduce((sum, exp) => sum + exp.unrealizedPnL, 0);
    
    // Margin utilization
    const marginUtilization = profile.marginRequirement / profile.creditLimit;

    // Risk score calculation
    const riskScore = this.calculateRiskScore({
      concentration: maxConcentration,
      leverage,
      marginUtilization,
      unrealizedPnL,
      creditUtilization: profile.usedCredit / profile.creditLimit
    });

    return {
      clientId,
      riskScore,
      leverage,
      maxConcentration,
      marginUtilization,
      unrealizedPnL,
      totalExposure,
      creditUtilization: profile.usedCredit / profile.creditLimit,
      recommendations: this.generateRiskRecommendations(riskScore, {
        concentration: maxConcentration,
        leverage,
        marginUtilization
      })
    };
  }

  private calculateRiskScore(factors: any): number {
    let score = 0;
    
    // Concentration risk (0-30 points)
    score += Math.min(factors.concentration * 100, 30);
    
    // Leverage risk (0-25 points)
    score += Math.min((factors.leverage / this.riskLimits.leverageLimit) * 25, 25);
    
    // Margin utilization (0-20 points)
    score += Math.min(factors.marginUtilization * 20, 20);
    
    // Credit utilization (0-15 points)
    score += Math.min(factors.creditUtilization * 15, 15);
    
    // Unrealized loss impact (0-10 points)
    if (factors.unrealizedPnL < 0) {
      score += Math.min(Math.abs(factors.unrealizedPnL) / 100000 * 10, 10);
    }

    return Math.min(score, 100);
  }

  private generateRiskRecommendations(riskScore: number, factors: any): string[] {
    const recommendations = [];

    if (riskScore > 80) {
      recommendations.push("CRITICAL: Immediate risk reduction required");
    }

    if (factors.concentration > this.riskLimits.concentrationLimit) {
      recommendations.push("Reduce concentration in overweight positions");
    }

    if (factors.leverage > this.riskLimits.leverageLimit) {
      recommendations.push("Reduce leverage by closing positions or adding collateral");
    }

    if (factors.marginUtilization > this.riskLimits.marginCallThreshold) {
      recommendations.push("Add margin or close positions to avoid margin call");
    }

    if (riskScore < 30) {
      recommendations.push("Risk profile allows for increased position sizing");
    }

    return recommendations;
  }

  private async checkRiskLimits(clientId: string): Promise<void> {
    const riskData = await this.calculateRealTimeRisk(clientId);
    if (!riskData) return;

    const alerts: RiskAlert[] = [];

    // Check margin call threshold
    if (riskData.marginUtilization > this.riskLimits.marginCallThreshold) {
      alerts.push({
        id: `margin_${clientId}_${Date.now()}`,
        clientId,
        type: 'margin_call',
        severity: 'critical',
        message: 'Margin call threshold exceeded',
        threshold: this.riskLimits.marginCallThreshold,
        currentValue: riskData.marginUtilization,
        timestamp: new Date(),
        acknowledged: false
      });
    }

    // Check concentration limits
    if (riskData.maxConcentration > this.riskLimits.concentrationLimit) {
      alerts.push({
        id: `concentration_${clientId}_${Date.now()}`,
        clientId,
        type: 'concentration',
        severity: 'high',
        message: 'Position concentration limit exceeded',
        threshold: this.riskLimits.concentrationLimit,
        currentValue: riskData.maxConcentration,
        timestamp: new Date(),
        acknowledged: false
      });
    }

    // Check leverage limits
    if (riskData.leverage > this.riskLimits.leverageLimit) {
      alerts.push({
        id: `leverage_${clientId}_${Date.now()}`,
        clientId,
        type: 'credit_breach',
        severity: 'high',
        message: 'Leverage limit exceeded',
        threshold: this.riskLimits.leverageLimit,
        currentValue: riskData.leverage,
        timestamp: new Date(),
        acknowledged: false
      });
    }

    // Store and emit alerts
    alerts.forEach(alert => {
      this.riskAlerts.set(alert.id, alert);
      this.emit('riskAlert', alert);
    });
  }

  async getRiskAlerts(clientId?: string): Promise<RiskAlert[]> {
    const allAlerts = Array.from(this.riskAlerts.values());
    return clientId ? allAlerts.filter(alert => alert.clientId === clientId) : allAlerts;
  }

  async acknowledgeAlert(alertId: string, acknowledgedBy: string): Promise<boolean> {
    const alert = this.riskAlerts.get(alertId);
    if (alert) {
      alert.acknowledged = true;
      this.emit('alertAcknowledged', { alert, acknowledgedBy });
      return true;
    }
    return false;
  }

  private startRealTimeMonitoring(): void {
    // Monitor risk every 30 seconds
    setInterval(async () => {
      for (const clientId of this.creditProfiles.keys()) {
        await this.checkRiskLimits(clientId);
      }
    }, 30000);
  }

  async getPortfolioRisk(): Promise<any> {
    const allProfiles = Array.from(this.creditProfiles.values());
    const totalCredit = allProfiles.reduce((sum, p) => sum + p.creditLimit, 0);
    const totalUsed = allProfiles.reduce((sum, p) => sum + p.usedCredit, 0);
    const avgRiskScore = allProfiles.reduce((sum, p) => sum + p.riskScore, 0) / allProfiles.length;
    
    const activeAlerts = Array.from(this.riskAlerts.values())
      .filter(alert => !alert.acknowledged);

    return {
      totalClients: allProfiles.length,
      totalCreditLimit: totalCredit,
      totalCreditUsed: totalUsed,
      creditUtilization: totalUsed / totalCredit,
      averageRiskScore: avgRiskScore || 0,
      activeAlerts: activeAlerts.length,
      criticalAlerts: activeAlerts.filter(a => a.severity === 'critical').length,
      riskDistribution: {
        low: allProfiles.filter(p => p.riskScore < 30).length,
        medium: allProfiles.filter(p => p.riskScore >= 30 && p.riskScore < 70).length,
        high: allProfiles.filter(p => p.riskScore >= 70).length
      }
    };
  }
}

export const creditRiskEngine = new CreditRiskEngine();