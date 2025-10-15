import type { Express } from "express";
import { z } from "zod";
import { verifyWalletAuth } from "./middleware/walletAuth";
import { crossChainService } from "./services/CrossChainService";

// Validation schemas
const bridgeTransactionSchema = z.object({
  fromChain: z.number(),
  toChain: z.number(),
  fromToken: z.string(),
  toToken: z.string(),
  amount: z.string(),
  recipient: z.string(),
});

const tokenInfoSchema = z.object({
  chainId: z.number(),
  tokenAddress: z.string(),
});

const tokenBalanceSchema = z.object({
  chainId: z.number(),
  tokenAddress: z.string(),
  userAddress: z.string(),
});

const portfolioSchema = z.object({
  userAddress: z.string(),
});

export function registerCrossChainRoutes(app: Express) {
  // Get supported chains
  app.get('/api/crosschain/chains', async (req, res) => {
    try {
      const chains = crossChainService.getSupportedChains();
      res.json({
        success: true,
        chains,
      });
    } catch (error) {
      console.error('[CrossChain] Get chains error:', error);
      res.status(500).json({ message: 'Failed to retrieve supported chains' });
    }
  });

  // Get chain information
  app.get('/api/crosschain/chains/:chainId', async (req, res) => {
    try {
      const chainId = parseInt(req.params.chainId);
      const chainConfig = crossChainService.getChainConfig(chainId);
      
      if (!chainConfig) {
        return res.status(404).json({ message: 'Chain not supported' });
      }

      const gasPrice = await crossChainService.getChainGasPrice(chainId);

      res.json({
        success: true,
        chain: {
          ...chainConfig,
          currentGasPrice: gasPrice,
        },
      });
    } catch (error) {
      console.error('[CrossChain] Get chain info error:', error);
      res.status(500).json({ message: 'Failed to retrieve chain information' });
    }
  });

  // Get token information
  app.post('/api/crosschain/tokens/info', async (req, res) => {
    try {
      const validation = tokenInfoSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: 'Invalid request data',
          errors: validation.error.errors 
        });
      }

      const { chainId, tokenAddress } = validation.data;
      const tokenInfo = await crossChainService.getTokenInfo(chainId, tokenAddress);

      if (!tokenInfo) {
        return res.status(404).json({ message: 'Token not found' });
      }

      res.json({
        success: true,
        token: tokenInfo,
      });
    } catch (error) {
      console.error('[CrossChain] Get token info error:', error);
      res.status(500).json({ message: 'Failed to retrieve token information' });
    }
  });

  // Get token balance
  app.post('/api/crosschain/tokens/balance', async (req, res) => {
    try {
      const validation = tokenBalanceSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: 'Invalid request data',
          errors: validation.error.errors 
        });
      }

      const { chainId, tokenAddress, userAddress } = validation.data;
      const balance = await crossChainService.getTokenBalance(chainId, tokenAddress, userAddress);

      res.json({
        success: true,
        balance,
        chainId,
        tokenAddress,
        userAddress,
      });
    } catch (error) {
      console.error('[CrossChain] Get token balance error:', error);
      res.status(500).json({ message: 'Failed to retrieve token balance' });
    }
  });

  // Estimate bridge fees
  app.post('/api/crosschain/bridge/estimate', async (req, res) => {
    try {
      const { fromChain, toChain, tokenAddress, amount } = req.body;
      
      if (!fromChain || !toChain || !tokenAddress || !amount) {
        return res.status(400).json({ message: 'Missing required parameters' });
      }

      const fees = await crossChainService.estimateBridgeFees(
        fromChain,
        toChain,
        tokenAddress,
        amount
      );

      res.json({
        success: true,
        fees,
        estimatedTime: await crossChainService.getEstimatedBridgeTime(fromChain, toChain),
      });
    } catch (error) {
      console.error('[CrossChain] Estimate bridge fees error:', error);
      res.status(500).json({ message: 'Failed to estimate bridge fees' });
    }
  });

  // Initiate bridge transaction
  app.post('/api/crosschain/bridge/initiate', verifyWalletAuth, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const validation = bridgeTransactionSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: 'Invalid bridge transaction data',
          errors: validation.error.errors 
        });
      }

      const bridgeParams = {
        ...validation.data,
        userAddress: userId, // In a real implementation, this would be the user's wallet address
      };

      const bridgeTransaction = await crossChainService.initiateBridge(bridgeParams);

      res.json({
        success: true,
        transaction: bridgeTransaction,
      });
    } catch (error) {
      console.error('[CrossChain] Initiate bridge error:', error);
      res.status(500).json({ 
        message: 'Failed to initiate bridge transaction',
        error: (error as Error).message 
      });
    }
  });

  // Get bridge transaction status
  app.get('/api/crosschain/bridge/status/:transactionId', verifyWalletAuth, async (req: any, res) => {
    try {
      const { transactionId } = req.params;
      const transaction = await crossChainService.getBridgeStatus(transactionId);

      if (!transaction) {
        return res.status(404).json({ message: 'Bridge transaction not found' });
      }

      res.json({
        success: true,
        transaction,
      });
    } catch (error) {
      console.error('[CrossChain] Get bridge status error:', error);
      res.status(500).json({ message: 'Failed to retrieve bridge transaction status' });
    }
  });

  // Get DeFi positions
  app.post('/api/crosschain/defi/positions', verifyWalletAuth, async (req: any, res) => {
    try {
      const validation = portfolioSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: 'Invalid request data',
          errors: validation.error.errors 
        });
      }

      const { userAddress } = validation.data;
      const positions = await crossChainService.getDeFiPositions(userAddress);

      res.json({
        success: true,
        positions,
      });
    } catch (error) {
      console.error('[CrossChain] Get DeFi positions error:', error);
      res.status(500).json({ message: 'Failed to retrieve DeFi positions' });
    }
  });

  // Get liquidity pools
  app.get('/api/crosschain/defi/pools/:chainId', async (req, res) => {
    try {
      const chainId = parseInt(req.params.chainId);
      const pools = await crossChainService.getLiquidityPools(chainId);

      res.json({
        success: true,
        pools,
        chainId,
      });
    } catch (error) {
      console.error('[CrossChain] Get liquidity pools error:', error);
      res.status(500).json({ message: 'Failed to retrieve liquidity pools' });
    }
  });

  // Get yield opportunities
  app.get('/api/crosschain/defi/yield', async (req, res) => {
    try {
      const opportunities = await crossChainService.getYieldOpportunities();

      res.json({
        success: true,
        opportunities,
      });
    } catch (error) {
      console.error('[CrossChain] Get yield opportunities error:', error);
      res.status(500).json({ message: 'Failed to retrieve yield opportunities' });
    }
  });

  // Get multi-chain portfolio
  app.post('/api/crosschain/portfolio', verifyWalletAuth, async (req: any, res) => {
    try {
      const validation = portfolioSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: 'Invalid request data',
          errors: validation.error.errors 
        });
      }

      const { userAddress } = validation.data;
      const portfolio = await crossChainService.getMultiChainPortfolio(userAddress);

      res.json({
        success: true,
        portfolio,
      });
    } catch (error) {
      console.error('[CrossChain] Get multi-chain portfolio error:', error);
      res.status(500).json({ message: 'Failed to retrieve multi-chain portfolio' });
    }
  });

  // Get arbitrage opportunities
  app.get('/api/crosschain/arbitrage', async (req, res) => {
    try {
      const opportunities = await crossChainService.findArbitrageOpportunities();

      res.json({
        success: true,
        opportunities,
      });
    } catch (error) {
      console.error('[CrossChain] Get arbitrage opportunities error:', error);
      res.status(500).json({ message: 'Failed to retrieve arbitrage opportunities' });
    }
  });

  // Validate address
  app.post('/api/crosschain/validate-address', async (req, res) => {
    try {
      const { chainId, address } = req.body;
      
      if (!chainId || !address) {
        return res.status(400).json({ message: 'Chain ID and address are required' });
      }

      const isValid = await crossChainService.validateAddress(chainId, address);

      res.json({
        success: true,
        isValid,
        chainId,
        address,
      });
    } catch (error) {
      console.error('[CrossChain] Validate address error:', error);
      res.status(500).json({ message: 'Failed to validate address' });
    }
  });

  // Get transaction status
  app.get('/api/crosschain/transaction/:chainId/:txHash', async (req, res) => {
    try {
      const chainId = parseInt(req.params.chainId);
      const { txHash } = req.params;

      const status = await crossChainService.getTransactionStatus(chainId, txHash);

      if (!status) {
        return res.status(404).json({ message: 'Transaction not found' });
      }

      res.json({
        success: true,
        status,
        chainId,
        txHash,
      });
    } catch (error) {
      console.error('[CrossChain] Get transaction status error:', error);
      res.status(500).json({ message: 'Failed to retrieve transaction status' });
    }
  });

  console.log('[CrossChain Routes] Cross-chain and DeFi routes registered successfully');
}