import { otcStorage } from "../otc-storage";
import { OTCDeal, BlockTrade, SettlementInstruction, CreditLine } from "../../shared/otc-schema";

interface SettlementRequest {
  dealId?: string;
  tradeId?: string;
  buyerInstructions: SettlementInstruction[];
  sellerInstructions: SettlementInstruction[];
  settlementDate?: Date;
  priority: 'standard' | 'urgent' | 'same_day';
}

interface SettlementStatus {
  id: string;
  status: 'pending' | 'processing' | 'confirming' | 'completed' | 'failed';
  buyerSettlement: {
    status: 'pending' | 'initiated' | 'confirmed' | 'completed';
    method: string;
    amount: string;
    currency: string;
    reference?: string;
    estimatedCompletion?: Date;
  };
  sellerSettlement: {
    status: 'pending' | 'initiated' | 'confirmed' | 'completed';
    method: string;
    amount: string;
    currency: string;
    reference?: string;
    estimatedCompletion?: Date;
  };
  fees: {
    settlementFee: string;
    networkFee?: string;
    processingFee?: string;
    totalFees: string;
  };
  timeline: {
    initiated: Date;
    expectedCompletion: Date;
    actualCompletion?: Date;
  };
}

export class OTCSettlementService {
  private readonly SETTLEMENT_FEES = {
    crypto: { standard: 0.001, urgent: 0.002, same_day: 0.003 },
    wire: { standard: 25, urgent: 50, same_day: 100 },
    swift: { standard: 35, urgent: 75, same_day: 150 },
    fedwire: { standard: 15, urgent: 30, same_day: 50 }
  };

  private readonly PROCESSING_TIMES = {
    crypto: { standard: 30, urgent: 15, same_day: 5 }, // minutes
    wire: { standard: 1440, urgent: 720, same_day: 240 }, // minutes (1-4 hours)
    swift: { standard: 2880, urgent: 1440, same_day: 480 }, // minutes (8-48 hours)
    fedwire: { standard: 240, urgent: 120, same_day: 60 } // minutes
  };

  async initiateSettlement(request: SettlementRequest): Promise<SettlementStatus> {
    let deal: OTCDeal | undefined;
    let trade: BlockTrade | undefined;

    if (request.dealId) {
      deal = await otcStorage.getOTCDealById(request.dealId);
      if (!deal) throw new Error("Deal not found");
    } else if (request.tradeId) {
      const trades = await otcStorage.getBlockTrades();
      trade = trades.find(t => t.tradeId === request.tradeId);
      if (!trade) throw new Error("Trade not found");
    } else {
      throw new Error("Either dealId or tradeId must be provided");
    }

    const settlementId = `SET-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    const buyerInstruction = request.buyerInstructions[0];
    const sellerInstruction = request.sellerInstructions[0];

    const buyerMethod = this.getSettlementMethodType(buyerInstruction);
    const sellerMethod = this.getSettlementMethodType(sellerInstruction);

    const buyerFee = this.calculateSettlementFee(buyerMethod, request.priority, deal?.totalValue || trade?.totalValue || '0');
    const sellerFee = this.calculateSettlementFee(sellerMethod, request.priority, deal?.totalValue || trade?.totalValue || '0');

    const buyerProcessingTime = this.PROCESSING_TIMES[buyerMethod][request.priority];
    const sellerProcessingTime = this.PROCESSING_TIMES[sellerMethod][request.priority];

    const maxProcessingTime = Math.max(buyerProcessingTime, sellerProcessingTime);
    const expectedCompletion = new Date(Date.now() + maxProcessingTime * 60 * 1000);

    const settlementStatus: SettlementStatus = {
      id: settlementId,
      status: 'pending',
      buyerSettlement: {
        status: 'pending',
        method: buyerMethod,
        amount: deal?.totalValue || trade?.totalValue || '0',
        currency: deal?.quoteCurrency || trade?.quoteCurrency || 'USD',
        estimatedCompletion: new Date(Date.now() + buyerProcessingTime * 60 * 1000)
      },
      sellerSettlement: {
        status: 'pending',
        method: sellerMethod,
        amount: deal?.amount || trade?.amount || '0',
        currency: deal?.baseCurrency || trade?.baseCurrency || 'BTC',
        estimatedCompletion: new Date(Date.now() + sellerProcessingTime * 60 * 1000)
      },
      fees: {
        settlementFee: (parseFloat(buyerFee) + parseFloat(sellerFee)).toFixed(8),
        networkFee: this.calculateNetworkFee(buyerMethod, sellerMethod),
        processingFee: this.calculateProcessingFee(request.priority),
        totalFees: '0' // Will be calculated
      },
      timeline: {
        initiated: new Date(),
        expectedCompletion
      }
    };

    // Calculate total fees
    const totalFees = parseFloat(settlementStatus.fees.settlementFee) + 
                     parseFloat(settlementStatus.fees.networkFee || '0') + 
                     parseFloat(settlementStatus.fees.processingFee);
    settlementStatus.fees.totalFees = totalFees.toFixed(8);

    // Update deal/trade status
    if (deal) {
      await otcStorage.updateOTCDealStatus(deal.dealId, 'executing');
    }

    return settlementStatus;
  }

  async processSettlement(settlementId: string): Promise<SettlementStatus> {
    // Simulate settlement processing
    const settlement = await this.getSettlementStatus(settlementId);
    
    settlement.status = 'processing';
    settlement.buyerSettlement.status = 'initiated';
    settlement.sellerSettlement.status = 'initiated';

    // Generate settlement references
    settlement.buyerSettlement.reference = `BUY-${settlementId}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
    settlement.sellerSettlement.reference = `SEL-${settlementId}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

    return settlement;
  }

  async confirmSettlement(settlementId: string, side: 'buyer' | 'seller'): Promise<SettlementStatus> {
    const settlement = await this.getSettlementStatus(settlementId);
    
    if (side === 'buyer') {
      settlement.buyerSettlement.status = 'confirmed';
    } else {
      settlement.sellerSettlement.status = 'confirmed';
    }

    // Check if both sides are confirmed
    if (settlement.buyerSettlement.status === 'confirmed' && 
        settlement.sellerSettlement.status === 'confirmed') {
      settlement.status = 'confirming';
      
      // Complete settlement after confirmation
      setTimeout(() => {
        this.completeSettlement(settlementId);
      }, 5000); // 5 second delay for demo
    }

    return settlement;
  }

  async completeSettlement(settlementId: string): Promise<SettlementStatus> {
    const settlement = await this.getSettlementStatus(settlementId);
    
    settlement.status = 'completed';
    settlement.buyerSettlement.status = 'completed';
    settlement.sellerSettlement.status = 'completed';
    settlement.timeline.actualCompletion = new Date();

    return settlement;
  }

  async getSettlementStatus(settlementId: string): Promise<SettlementStatus> {
    // In a real implementation, this would fetch from database
    // For now, return a mock status
    return {
      id: settlementId,
      status: 'pending',
      buyerSettlement: {
        status: 'pending',
        method: 'wire',
        amount: '1000000',
        currency: 'USD'
      },
      sellerSettlement: {
        status: 'pending',
        method: 'crypto',
        amount: '25.5',
        currency: 'BTC'
      },
      fees: {
        settlementFee: '250.00',
        networkFee: '15.00',
        processingFee: '50.00',
        totalFees: '315.00'
      },
      timeline: {
        initiated: new Date(),
        expectedCompletion: new Date(Date.now() + 4 * 60 * 60 * 1000) // 4 hours
      }
    };
  }

  private getSettlementMethodType(instruction: SettlementInstruction): 'crypto' | 'wire' | 'swift' | 'fedwire' {
    switch (instruction.method) {
      case 'crypto_wallet':
        return 'crypto';
      case 'swift':
        return 'swift';
      case 'fedwire':
        return 'fedwire';
      case 'bank_wire':
      default:
        return 'wire';
    }
  }

  private calculateSettlementFee(method: 'crypto' | 'wire' | 'swift' | 'fedwire', priority: 'standard' | 'urgent' | 'same_day', amount: string): string {
    const fees = this.SETTLEMENT_FEES[method];
    
    if (method === 'crypto') {
      return (parseFloat(amount) * fees[priority]).toFixed(8);
    } else {
      return fees[priority].toFixed(2);
    }
  }

  private calculateNetworkFee(buyerMethod: string, sellerMethod: string): string {
    let networkFee = 0;
    
    if (buyerMethod === 'crypto') networkFee += 0.0005; // BTC network fee
    if (sellerMethod === 'crypto') networkFee += 0.0005;
    
    return networkFee.toFixed(8);
  }

  private calculateProcessingFee(priority: 'standard' | 'urgent' | 'same_day'): string {
    const fees = {
      standard: 25,
      urgent: 50,
      same_day: 100
    };
    
    return fees[priority].toFixed(2);
  }

  async getCreditLineUtilization(clientId: string): Promise<{
    totalCreditLimit: string;
    availableCredit: string;
    utilizedCredit: string;
    utilizationPercentage: string;
    creditLines: CreditLine[];
  }> {
    const creditLines = await otcStorage.getCreditLines(clientId);
    
    let totalLimit = 0;
    let totalAvailable = 0;
    
    creditLines.forEach(line => {
      totalLimit += parseFloat(line.creditLimit);
      totalAvailable += parseFloat(line.availableCredit);
    });
    
    const utilized = totalLimit - totalAvailable;
    const utilizationPercentage = totalLimit > 0 ? (utilized / totalLimit * 100) : 0;
    
    return {
      totalCreditLimit: totalLimit.toFixed(2),
      availableCredit: totalAvailable.toFixed(2),
      utilizedCredit: utilized.toFixed(2),
      utilizationPercentage: utilizationPercentage.toFixed(2),
      creditLines
    };
  }

  async extendCreditLine(clientId: string, currency: string, additionalLimit: string): Promise<CreditLine> {
    const existingLines = await otcStorage.getCreditLines(clientId);
    const existingLine = existingLines.find(line => line.currency === currency);
    
    if (existingLine) {
      // Update existing credit line
      const newLimit = (parseFloat(existingLine.creditLimit) + parseFloat(additionalLimit)).toString();
      const newAvailable = (parseFloat(existingLine.availableCredit) + parseFloat(additionalLimit)).toString();
      
      return await otcStorage.createCreditLine({
        clientId,
        currency,
        creditLimit: newLimit,
        interestRate: existingLine.interestRate,
        collateralRequired: existingLine.collateralRequired,
        maturityDate: existingLine.maturityDate,
        riskRating: existingLine.riskRating
      });
    } else {
      // Create new credit line
      return await otcStorage.createCreditLine({
        clientId,
        currency,
        creditLimit: additionalLimit,
        interestRate: '0.05', // 5% default rate
        collateralRequired: '0',
        riskRating: 'medium'
      });
    }
  }
}

export const otcSettlementService = new OTCSettlementService();