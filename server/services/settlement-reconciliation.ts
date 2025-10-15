import { EventEmitter } from 'events';

export interface Settlement {
  id: string;
  tradeId: string;
  clientId: string;
  counterpartyId: string;
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  notional: number;
  settlementDate: Date;
  valueDate: Date;
  status: 'pending' | 'processing' | 'settled' | 'failed' | 'cancelled';
  instructions: SettlementInstruction[];
  confirmations: SettlementConfirmation[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SettlementInstruction {
  id: string;
  type: 'crypto' | 'fiat';
  asset: string;
  amount: number;
  direction: 'pay' | 'receive';
  walletAddress?: string;
  bankDetails?: BankDetails;
  reference: string;
  status: 'pending' | 'sent' | 'confirmed' | 'failed';
  txHash?: string;
  confirmations?: number;
  requiredConfirmations?: number;
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  swiftCode: string;
  iban?: string;
  beneficiaryName: string;
  reference: string;
}

export interface SettlementConfirmation {
  id: string;
  settlementId: string;
  type: 'blockchain' | 'swift' | 'sepa' | 'ach' | 'internal';
  transactionId: string;
  amount: number;
  asset: string;
  timestamp: Date;
  confirmationData: any;
  verified: boolean;
}

export interface ReconciliationItem {
  id: string;
  type: 'trade' | 'settlement' | 'movement';
  reference: string;
  expectedAmount: number;
  actualAmount: number;
  difference: number;
  asset: string;
  status: 'matched' | 'unmatched' | 'investigating' | 'resolved';
  createdAt: Date;
  investigationNotes?: string;
}

export class SettlementReconciliationService extends EventEmitter {
  private settlements: Map<string, Settlement> = new Map();
  private reconciliationItems: Map<string, ReconciliationItem> = new Map();
  private walletBalances: Map<string, number> = new Map();
  private bankBalances: Map<string, number> = new Map();

  constructor() {
    super();
    this.startAutomatedReconciliation();
  }

  async createSettlement(tradeData: any): Promise<Settlement> {
    const settlement: Settlement = {
      id: `settle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tradeId: tradeData.tradeId,
      clientId: tradeData.clientId,
      counterpartyId: tradeData.counterpartyId,
      symbol: tradeData.symbol,
      side: tradeData.side,
      quantity: tradeData.quantity,
      price: tradeData.price,
      notional: tradeData.quantity * tradeData.price,
      settlementDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // T+1
      valueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: 'pending',
      instructions: [],
      confirmations: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Generate settlement instructions
    settlement.instructions = await this.generateSettlementInstructions(settlement);
    
    this.settlements.set(settlement.id, settlement);
    this.emit('settlementCreated', settlement);

    // Auto-process if T+0 settlement
    if (tradeData.settlementType === 'T+0') {
      await this.processSettlement(settlement.id);
    }

    return settlement;
  }

  private async generateSettlementInstructions(settlement: Settlement): Promise<SettlementInstruction[]> {
    const instructions: SettlementInstruction[] = [];
    const [baseAsset, quoteAsset] = settlement.symbol.split('/');

    if (settlement.side === 'buy') {
      // Pay quote asset (e.g., USDT)
      instructions.push({
        id: `inst_${Date.now()}_1`,
        type: quoteAsset === 'USD' ? 'fiat' : 'crypto',
        asset: quoteAsset,
        amount: settlement.notional,
        direction: 'pay',
        walletAddress: quoteAsset !== 'USD' ? await this.getWalletAddress(settlement.counterpartyId, quoteAsset) : undefined,
        bankDetails: quoteAsset === 'USD' ? await this.getBankDetails(settlement.counterpartyId) : undefined,
        reference: `${settlement.id}_PAY_${quoteAsset}`,
        status: 'pending'
      });

      // Receive base asset (e.g., BTC)
      instructions.push({
        id: `inst_${Date.now()}_2`,
        type: 'crypto',
        asset: baseAsset,
        amount: settlement.quantity,
        direction: 'receive',
        walletAddress: await this.getWalletAddress(settlement.clientId, baseAsset),
        reference: `${settlement.id}_RCV_${baseAsset}`,
        status: 'pending'
      });
    } else {
      // Sell: opposite directions
      instructions.push({
        id: `inst_${Date.now()}_1`,
        type: 'crypto',
        asset: baseAsset,
        amount: settlement.quantity,
        direction: 'pay',
        walletAddress: await this.getWalletAddress(settlement.counterpartyId, baseAsset),
        reference: `${settlement.id}_PAY_${baseAsset}`,
        status: 'pending'
      });

      instructions.push({
        id: `inst_${Date.now()}_2`,
        type: quoteAsset === 'USD' ? 'fiat' : 'crypto',
        asset: quoteAsset,
        amount: settlement.notional,
        direction: 'receive',
        walletAddress: quoteAsset !== 'USD' ? await this.getWalletAddress(settlement.clientId, quoteAsset) : undefined,
        bankDetails: quoteAsset === 'USD' ? await this.getBankDetails(settlement.clientId) : undefined,
        reference: `${settlement.id}_RCV_${quoteAsset}`,
        status: 'pending'
      });
    }

    return instructions;
  }

  async processSettlement(settlementId: string): Promise<boolean> {
    const settlement = this.settlements.get(settlementId);
    if (!settlement) return false;

    settlement.status = 'processing';
    settlement.updatedAt = new Date();

    try {
      // Process each instruction
      for (const instruction of settlement.instructions) {
        await this.processInstruction(instruction, settlement);
      }

      // Check if all instructions are confirmed
      const allConfirmed = settlement.instructions.every(inst => inst.status === 'confirmed');
      
      if (allConfirmed) {
        settlement.status = 'settled';
        this.emit('settlementCompleted', settlement);
      }

      this.settlements.set(settlementId, settlement);
      return true;

    } catch (error) {
      settlement.status = 'failed';
      settlement.updatedAt = new Date();
      this.settlements.set(settlementId, settlement);
      this.emit('settlementFailed', { settlement, error });
      return false;
    }
  }

  private async processInstruction(instruction: SettlementInstruction, settlement: Settlement): Promise<void> {
    instruction.status = 'sent';

    if (instruction.type === 'crypto') {
      // Process crypto transfer
      const txHash = await this.sendCryptoTransaction(instruction);
      instruction.txHash = txHash;
      instruction.requiredConfirmations = this.getRequiredConfirmations(instruction.asset);
      
      // Start monitoring confirmations
      this.monitorCryptoConfirmations(instruction, settlement);
      
    } else if (instruction.type === 'fiat') {
      // Process fiat transfer (SWIFT/SEPA/ACH)
      const transferRef = await this.sendFiatTransfer(instruction);
      instruction.txHash = transferRef;
      
      // Fiat transfers typically take 1-3 business days
      this.scheduleFiatConfirmationCheck(instruction, settlement);
    }

    this.emit('instructionProcessed', { instruction, settlement });
  }

  private async sendCryptoTransaction(instruction: SettlementInstruction): Promise<string> {
    // Simulate crypto transaction - integrate with actual wallet service
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `0x${Math.random().toString(16).substr(2, 64)}`;
  }

  private async sendFiatTransfer(instruction: SettlementInstruction): Promise<string> {
    // Simulate fiat transfer - integrate with banking API
    await new Promise(resolve => setTimeout(resolve, 2000));
    return `SWIFT${Date.now()}`;
  }

  private getRequiredConfirmations(asset: string): number {
    const confirmations: { [key: string]: number } = {
      'BTC': 6,
      'ETH': 12,
      'USDT': 12,
      'USDC': 12,
      'default': 6
    };
    return confirmations[asset] || confirmations.default;
  }

  private async monitorCryptoConfirmations(instruction: SettlementInstruction, settlement: Settlement): Promise<void> {
    let currentConfirmations = 0;
    
    const checkConfirmations = async () => {
      // Simulate blockchain confirmation checking
      currentConfirmations++;
      instruction.confirmations = currentConfirmations;

      if (currentConfirmations >= (instruction.requiredConfirmations || 6)) {
        instruction.status = 'confirmed';
        
        // Add confirmation record
        const confirmation: SettlementConfirmation = {
          id: `conf_${Date.now()}`,
          settlementId: settlement.id,
          type: 'blockchain',
          transactionId: instruction.txHash!,
          amount: instruction.amount,
          asset: instruction.asset,
          timestamp: new Date(),
          confirmationData: {
            confirmations: currentConfirmations,
            blockHash: `0x${Math.random().toString(16).substr(2, 64)}`
          },
          verified: true
        };

        settlement.confirmations.push(confirmation);
        this.emit('instructionConfirmed', { instruction, settlement, confirmation });
        
        // Trigger reconciliation
        await this.reconcileSettlement(settlement);
      } else {
        // Check again in 10 minutes
        setTimeout(checkConfirmations, 10 * 60 * 1000);
      }
    };

    // Start checking after 5 minutes
    setTimeout(checkConfirmations, 5 * 60 * 1000);
  }

  private scheduleFiatConfirmationCheck(instruction: SettlementInstruction, settlement: Settlement): void {
    // Check fiat confirmation after 1 business day
    setTimeout(async () => {
      // Simulate fiat confirmation check
      const confirmed = Math.random() > 0.1; // 90% success rate
      
      if (confirmed) {
        instruction.status = 'confirmed';
        
        const confirmation: SettlementConfirmation = {
          id: `conf_${Date.now()}`,
          settlementId: settlement.id,
          type: instruction.bankDetails?.swiftCode ? 'swift' : 'ach',
          transactionId: instruction.txHash!,
          amount: instruction.amount,
          asset: instruction.asset,
          timestamp: new Date(),
          confirmationData: {
            reference: instruction.reference,
            bankConfirmation: instruction.txHash
          },
          verified: true
        };

        settlement.confirmations.push(confirmation);
        this.emit('instructionConfirmed', { instruction, settlement, confirmation });
        
        await this.reconcileSettlement(settlement);
      } else {
        instruction.status = 'failed';
        this.emit('instructionFailed', { instruction, settlement });
      }
    }, 24 * 60 * 60 * 1000); // 24 hours
  }

  private async reconcileSettlement(settlement: Settlement): Promise<void> {
    // Check if actual movements match expected
    for (const instruction of settlement.instructions) {
      if (instruction.status === 'confirmed') {
        const expectedAmount = instruction.amount;
        const actualAmount = await this.getActualMovement(instruction);
        
        if (Math.abs(expectedAmount - actualAmount) > 0.001) {
          // Discrepancy found
          const reconciliationItem: ReconciliationItem = {
            id: `recon_${Date.now()}`,
            type: 'settlement',
            reference: instruction.reference,
            expectedAmount,
            actualAmount,
            difference: actualAmount - expectedAmount,
            asset: instruction.asset,
            status: 'unmatched',
            createdAt: new Date()
          };

          this.reconciliationItems.set(reconciliationItem.id, reconciliationItem);
          this.emit('reconciliationDiscrepancy', reconciliationItem);
        }
      }
    }
  }

  private async getActualMovement(instruction: SettlementInstruction): Promise<number> {
    // Simulate checking actual blockchain/bank movement
    // In production, query actual wallet/bank APIs
    return instruction.amount * (0.999 + Math.random() * 0.002); // Small variation
  }

  private startAutomatedReconciliation(): void {
    // Run reconciliation every hour
    setInterval(async () => {
      await this.performDailyReconciliation();
    }, 60 * 60 * 1000);
  }

  private async performDailyReconciliation(): Promise<void> {
    // Reconcile all movements from past 24 hours
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentSettlements = Array.from(this.settlements.values())
      .filter(s => s.createdAt > yesterday);

    for (const settlement of recentSettlements) {
      await this.reconcileSettlement(settlement);
    }

    this.emit('dailyReconciliationComplete', {
      settlementsProcessed: recentSettlements.length,
      discrepancies: Array.from(this.reconciliationItems.values())
        .filter(item => item.status === 'unmatched').length
    });
  }

  // API methods
  async getSettlement(settlementId: string): Promise<Settlement | undefined> {
    return this.settlements.get(settlementId);
  }

  async getSettlementsForClient(clientId: string): Promise<Settlement[]> {
    return Array.from(this.settlements.values())
      .filter(s => s.clientId === clientId);
  }

  async getReconciliationItems(status?: string): Promise<ReconciliationItem[]> {
    const items = Array.from(this.reconciliationItems.values());
    return status ? items.filter(item => item.status === status) : items;
  }

  async updateReconciliationItem(itemId: string, updates: Partial<ReconciliationItem>): Promise<boolean> {
    const item = this.reconciliationItems.get(itemId);
    if (item) {
      Object.assign(item, updates);
      this.reconciliationItems.set(itemId, item);
      this.emit('reconciliationItemUpdated', item);
      return true;
    }
    return false;
  }

  private async getWalletAddress(clientId: string, asset: string): Promise<string> {
    // Simulate wallet address generation/retrieval
    return `${asset.toLowerCase()}_${clientId}_${Math.random().toString(36).substr(2, 10)}`;
  }

  private async getBankDetails(clientId: string): Promise<BankDetails> {
    // Simulate bank details retrieval
    return {
      bankName: 'Example Bank',
      accountNumber: '1234567890',
      routingNumber: '021000021',
      swiftCode: 'CHASUS33',
      beneficiaryName: `Client ${clientId}`,
      reference: `TRADE_${clientId}`
    };
  }
}

export const settlementReconciliationService = new SettlementReconciliationService();