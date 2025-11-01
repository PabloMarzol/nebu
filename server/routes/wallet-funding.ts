import { Router } from 'express';
import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

// Configuration
const HOT_WALLET_ADDRESS = '0x5812817c149E2C6F5a8689B2e5Df73a509ec2299';
const USDT_CONTRACT_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
const USDT_ABI = [
  'function transfer(address to, uint256 value) external returns (bool)',
  'function balanceOf(address owner) external view returns (uint256)',
  'function decimals() external view returns (uint8)'
];

interface FundingResults {
  ethFunded: boolean;
  usdtFunded: boolean;
  transactions: Array<{
    type: string;
    hash: string;
    amount: string | number;
    status: string;
  }>;
  balances: {
    initial: {
      eth?: string;
      usdt?: string;
    };
    final: {
      eth?: string;
      usdt?: string;
    };
  };
}

// Fund hot wallet endpoint
router.post('/fund-hot-wallet', async (req, res) => {
  try {
    const { ethAmount, usdtAmount, fundingWalletKey } = req.body;
    
    if (!fundingWalletKey) {
      return res.status(400).json({ 
        success: false, 
        error: 'Funding wallet private key required' 
      });
    }

    const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
    const fundingWallet = new ethers.Wallet(fundingWalletKey, provider);

    const results: FundingResults = {
      ethFunded: false,
      usdtFunded: false,
      transactions: [],
      balances: {
        initial: {},
        final: {}
      }
    };

    // Check initial balances
    const initialHotWalletEth = await provider.getBalance(HOT_WALLET_ADDRESS);
    const usdtContract = new ethers.Contract(USDT_CONTRACT_ADDRESS, USDT_ABI, provider);
    const initialHotWalletUsdt = await usdtContract.balanceOf(HOT_WALLET_ADDRESS);
    const usdtDecimals = await usdtContract.decimals();

    results.balances.initial = {
      eth: ethers.formatEther(initialHotWalletEth),
      usdt: ethers.formatUnits(initialHotWalletUsdt, usdtDecimals)
    };

    console.log(`[WalletFunding] Initial balances - ETH: ${results.balances.initial.eth}, USDT: ${results.balances.initial.usdt}`);

    // Fund ETH if requested
    if (ethAmount && parseFloat(ethAmount) > 0) {
      console.log(`[WalletFunding] Funding ${ethAmount} ETH to hot wallet...`);
      
      const ethAmountWei = ethers.parseEther(ethAmount.toString());
      const ethTx = await fundingWallet.sendTransaction({
        to: HOT_WALLET_ADDRESS,
        value: ethAmountWei
      });

      console.log(`[WalletFunding] ETH funding tx sent: ${ethTx.hash}`);
      await ethTx.wait();
      
      results.ethFunded = true;
      results.transactions.push({ 
        type: 'ETH', 
        hash: ethTx.hash, 
        amount: ethAmount,
        status: 'completed'
      });
      
      console.log('[WalletFunding] ETH funding completed!');
    }

    // Fund USDT if requested
    if (usdtAmount && parseFloat(usdtAmount) > 0) {
      console.log(`[WalletFunding] Funding ${usdtAmount} USDT to hot wallet...`);
      
      const usdtAmountUnits = ethers.parseUnits(usdtAmount.toString(), 6);
      const usdtContractWithFunding = new ethers.Contract(USDT_CONTRACT_ADDRESS, USDT_ABI, fundingWallet);
      const usdtTx = await usdtContractWithFunding.transfer(HOT_WALLET_ADDRESS, usdtAmountUnits);
      
      console.log(`[WalletFunding] USDT funding tx sent: ${usdtTx.hash}`);
      await usdtTx.wait();
      
      results.usdtFunded = true;
      results.transactions.push({ 
        type: 'USDT', 
        hash: usdtTx.hash, 
        amount: usdtAmount,
        status: 'completed'
      });
      
      console.log('[WalletFunding] USDT funding completed!');
    }

    // Check final balances
    const finalHotWalletEth = await provider.getBalance(HOT_WALLET_ADDRESS);
    const finalHotWalletUsdt = await usdtContract.balanceOf(HOT_WALLET_ADDRESS);

    results.balances.final = {
      eth: ethers.formatEther(finalHotWalletEth),
      usdt: ethers.formatUnits(finalHotWalletUsdt, usdtDecimals)
    };

    console.log(`[WalletFunding] Final balances - ETH: ${results.balances.final.eth}, USDT: ${results.balances.final.usdt}`);

    res.json({
      success: true,
      message: 'Hot wallet funded successfully',
      results
    });

  } catch (error) {
    console.error('[WalletFunding] Error funding hot wallet:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fund hot wallet',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Check hot wallet balance endpoint
router.get('/hot-wallet-balance', async (req, res) => {
  try {
    const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
    const usdtContract = new ethers.Contract(USDT_CONTRACT_ADDRESS, USDT_ABI, provider);
    
    const [ethBalance, usdtBalance, usdtDecimals] = await Promise.all([
      provider.getBalance(HOT_WALLET_ADDRESS),
      usdtContract.balanceOf(HOT_WALLET_ADDRESS),
      usdtContract.decimals()
    ]);

    const balance = {
      address: HOT_WALLET_ADDRESS,
      eth: ethers.formatEther(ethBalance),
      usdt: ethers.formatUnits(usdtBalance, usdtDecimals),
      hasSufficientFunds: {
        eth: ethBalance >= ethers.parseEther('0.01'), // At least 0.01 ETH for gas
        usdt: usdtBalance >= ethers.parseUnits('100', 6) // At least 100 USDT
      }
    };

    res.json({
      success: true,
      balance
    });

  } catch (error) {
    console.error('[WalletFunding] Error checking balance:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to check hot wallet balance'
    });
  }
});

// Get funding requirements endpoint
router.get('/funding-requirements', async (req, res) => {
  try {
    const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
    const usdtContract = new ethers.Contract(USDT_CONTRACT_ADDRESS, USDT_ABI, provider);
    
    const [ethBalance, usdtBalance, usdtDecimals] = await Promise.all([
      provider.getBalance(HOT_WALLET_ADDRESS),
      usdtContract.balanceOf(HOT_WALLET_ADDRESS),
      usdtContract.decimals()
    ]);

    const currentEth = ethers.formatEther(ethBalance);
    const currentUsdt = ethers.formatUnits(usdtBalance, usdtDecimals);

    const requirements = {
      currentBalance: {
        eth: currentEth,
        usdt: currentUsdt
      },
      recommendedFunding: {
        eth: Math.max(0, 0.1 - parseFloat(currentEth)), // 0.1 ETH minimum
        usdt: Math.max(0, 1000 - parseFloat(currentUsdt)) // 1000 USDT minimum
      },
      needsFunding: {
        eth: ethBalance < ethers.parseEther('0.05'),
        usdt: usdtBalance < ethers.parseUnits('500', 6)
      },
      hotWalletAddress: HOT_WALLET_ADDRESS
    };

    res.json({
      success: true,
      requirements
    });

  } catch (error) {
    console.error('[WalletFunding] Error getting requirements:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get funding requirements'
    });
  }
});

export default router;
