import { Router } from 'express';
import { ethers } from 'ethers';

const router = Router();

// Hot wallet address from environment
const HOT_WALLET_ADDRESS = '0x5812817c149E2C6F5a8689B2e5Df73a509ec2299';
const USDT_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7';

// ERC-20 ABI for USDT
const USDT_ABI = [
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() view returns (uint8)',
];

/**
 * Get funding status for hot wallet
 * Shows current balances and required amounts
 */
router.get('/api/fx-swap/funding-status', async (req, res) => {
  try {
    const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL || 'https://eth.llamarpc.com');
    
    // Get ETH balance
    const ethBalance = await provider.getBalance(HOT_WALLET_ADDRESS);
    const ethBalanceFormatted = ethers.formatEther(ethBalance);
    
    // Get USDT balance
    const usdt = new ethers.Contract(USDT_ADDRESS, USDT_ABI, provider);
    const usdtBalance = await usdt.balanceOf(HOT_WALLET_ADDRESS);
    const usdtDecimals = await usdt.decimals();
    const usdtBalanceFormatted = ethers.formatUnits(usdtBalance, usdtDecimals);
    
    // Calculate minimum required amounts
    const minEthRequired = 0.01; // ETH for gas fees
    const minUsdtRequired = 20; // USDT for transfers (covering your £10 + buffer)
    
    const ethNeeded = Math.max(0, minEthRequired - parseFloat(ethBalanceFormatted));
    const usdtNeeded = Math.max(0, minUsdtRequired - parseFloat(usdtBalanceFormatted));
    
    const response = {
      hotWalletAddress: HOT_WALLET_ADDRESS,
      currentBalances: {
        eth: parseFloat(ethBalanceFormatted),
        usdt: parseFloat(usdtBalanceFormatted)
      },
      minimumRequired: {
        eth: minEthRequired,
        usdt: minUsdtRequired
      },
      fundingNeeded: {
        eth: ethNeeded,
        usdt: usdtNeeded
      },
      status: ethNeeded === 0 && usdtNeeded === 0 ? 'READY' : 'NEEDS_FUNDING',
      fundingInstructions: {
        message: `Send ${ethNeeded} ETH and ${usdtNeeded} USDT to ${HOT_WALLET_ADDRESS}`,
        ethAmount: ethNeeded,
        usdtAmount: usdtNeeded,
        walletAddress: HOT_WALLET_ADDRESS
      }
    };
    
    res.json(response);
    
  } catch (error) {
    console.error('[Funding Status] Error:', error);
    res.status(500).json({
      error: 'Failed to check funding status',
      message: error.message
    });
  }
});

export default router;
