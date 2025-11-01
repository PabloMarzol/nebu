import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

// Hot wallet configuration
const HOT_WALLET_PRIVATE_KEY = process.env.HOT_WALLET_PRIVATE_KEY;
const HOT_WALLET_ADDRESS = process.env.HOT_WALLET_ADDRESS || '0x4089b27c7679dfef3E9db1F7Df5aE660338e7151';
const ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL || 'https://eth.llamarpc.com';

// USDT contract configuration
const USDT_CONTRACT_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
const USDT_ABI = [
  'function transfer(address to, uint256 value) external returns (bool)',
  'function balanceOf(address owner) external view returns (uint256)',
  'function decimals() external view returns (uint8)',
  'function approve(address spender, uint256 value) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)'
];

// Funding wallet configuration (you'll need to provide this)
const FUNDING_WALLET_PRIVATE_KEY = process.env.FUNDING_WALLET_PRIVATE_KEY; // Add this to your .env

async function fundHotWallet() {
  try {
    console.log('🚀 Starting hot wallet funding process...');
    
    // Initialize provider and wallets
    const provider = new ethers.JsonRpcProvider(ETHEREUM_RPC_URL);
    
    if (!HOT_WALLET_PRIVATE_KEY) {
      throw new Error('HOT_WALLET_PRIVATE_KEY not found in environment variables');
    }

    // Check current balances first
    console.log('\n📊 Checking current hot wallet balances...');
    
    const hotWalletEthBalance = await provider.getBalance(HOT_WALLET_ADDRESS);
    
    // Check USDT balance
    const usdtContract = new ethers.Contract(USDT_CONTRACT_ADDRESS, USDT_ABI, provider);
    const hotWalletUsdtBalance = await usdtContract.balanceOf(HOT_WALLET_ADDRESS);
    const usdtDecimals = await usdtContract.decimals();
    const hotWalletUsdtFormatted = ethers.formatUnits(hotWalletUsdtBalance, usdtDecimals);
    
    console.log(`🔸 Hot wallet ETH balance: ${ethers.formatEther(hotWalletEthBalance)} ETH`);
    console.log(`💵 Hot wallet USDT balance: ${hotWalletUsdtFormatted} USDT`);

    if (!FUNDING_WALLET_PRIVATE_KEY) {
      console.log('⚠️  FUNDING_WALLET_PRIVATE_KEY not found. Please add it to your .env file');
      console.log('   Example: FUNDING_WALLET_PRIVATE_KEY=0x...');
      console.log('\n❌ Cannot proceed with funding without funding wallet private key.');
      return;
    }

    const hotWallet = new ethers.Wallet(HOT_WALLET_PRIVATE_KEY, provider);
    const fundingWallet = new ethers.Wallet(FUNDING_WALLET_PRIVATE_KEY, provider);

    console.log(`📍 Hot wallet address: ${HOT_WALLET_ADDRESS}`);
    console.log(`💰 Funding wallet address: ${fundingWallet.address}`);

    // Check funding wallet balances
    console.log('\n📊 Checking funding wallet balances...');
    const fundingWalletEthBalance = await provider.getBalance(fundingWallet.address);
    const fundingWalletUsdtBalance = await usdtContract.balanceOf(fundingWallet.address);
    const fundingWalletUsdtFormatted = ethers.formatUnits(fundingWalletUsdtBalance, usdtDecimals);
    
    console.log(`🔸 Funding wallet ETH balance: ${ethers.formatEther(fundingWalletEthBalance)} ETH`);
    console.log(`💵 Funding wallet USDT balance: ${fundingWalletUsdtFormatted} USDT`);

    // Funding amounts
    const ETH_FUNDING_AMOUNT = ethers.parseEther('0.1'); // 0.1 ETH for gas
    const USDT_FUNDING_AMOUNT = ethers.parseUnits('1000', 6); // 1000 USDT

    // Fund ETH if needed
    if (hotWalletEthBalance < ETH_FUNDING_AMOUNT) {
      console.log('\n⛽ Funding hot wallet with ETH for gas...');
      
      const ethTx = await fundingWallet.sendTransaction({
        to: HOT_WALLET_ADDRESS,
        value: ETH_FUNDING_AMOUNT
      });

      console.log(`📝 ETH funding transaction sent: ${ethTx.hash}`);
      await ethTx.wait();
      console.log('✅ ETH funding completed!');
    } else {
      console.log('\n✅ Hot wallet already has sufficient ETH for gas');
    }

    // Fund USDT if needed
    if (hotWalletUsdtBalance < USDT_FUNDING_AMOUNT) {
      console.log('\n💰 Funding hot wallet with USDT...');
      
    const usdtContractWithFunding = usdtContract.connect(fundingWallet) as ethers.Contract;
    const usdtTx = await usdtContractWithFunding.transfer(HOT_WALLET_ADDRESS, USDT_FUNDING_AMOUNT);
      
      console.log(`📝 USDT funding transaction sent: ${usdtTx.hash}`);
      await usdtTx.wait();
      console.log('✅ USDT funding completed!');
    } else {
      console.log('\n✅ Hot wallet already has sufficient USDT');
    }

    // Verify final balances
    console.log('\n📋 Verifying final balances...');
    
    const finalHotWalletEthBalance = await provider.getBalance(HOT_WALLET_ADDRESS);
    const finalHotWalletUsdtBalance = await usdtContract.balanceOf(HOT_WALLET_ADDRESS);
    const finalHotWalletUsdtFormatted = ethers.formatUnits(finalHotWalletUsdtBalance, usdtDecimals);
    
    console.log(`🔸 Final hot wallet ETH balance: ${ethers.formatEther(finalHotWalletEthBalance)} ETH`);
    console.log(`💵 Final hot wallet USDT balance: ${finalHotWalletUsdtFormatted} USDT`);

    console.log('\n🎉 Hot wallet funding process completed successfully!');
    console.log('💡 You can now proceed with USDT transfers and other operations.');

  } catch (error) {
    console.error('❌ Error funding hot wallet:', error);
    process.exit(1);
  }
}

// Alternative: Create a simple funding endpoint
async function createFundingEndpoint() {
  console.log('🔧 Setting up funding endpoint...');
  
  // This would be integrated into your existing API
  const fundingEndpoint = `
// Add this to your existing routes file

app.post('/api/wallet/fund-hot-wallet', async (req, res) => {
  try {
    const { ethAmount, usdtAmount, fundingWalletKey } = req.body;
    
    if (!fundingWalletKey) {
      return res.status(400).json({ error: 'Funding wallet private key required' });
    }

    const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
    const fundingWallet = new ethers.Wallet(fundingWalletKey, provider);
    const hotWalletAddress = '0x5812817c149E2C6F5a8689B2e5Df73a509ec2299';

    const results = {
      ethFunded: false,
      usdtFunded: false,
      transactions: []
    };

    // Fund ETH if requested
    if (ethAmount && ethAmount > 0) {
      const ethTx = await fundingWallet.sendTransaction({
        to: hotWalletAddress,
        value: ethers.parseEther(ethAmount.toString())
      });
      await ethTx.wait();
      results.ethFunded = true;
      results.transactions.push({ type: 'ETH', hash: ethTx.hash, amount: ethAmount });
    }

    // Fund USDT if requested
    if (usdtAmount && usdtAmount > 0) {
      const usdtContract = new ethers.Contract(USDT_CONTRACT_ADDRESS, USDT_ABI, fundingWallet);
      const usdtTx = await usdtContract.transfer(
        hotWalletAddress, 
        ethers.parseUnits(usdtAmount.toString(), 6)
      );
      await usdtTx.wait();
      results.usdtFunded = true;
      results.transactions.push({ type: 'USDT', hash: usdtTx.hash, amount: usdtAmount });
    }

    res.json({
      success: true,
      message: 'Hot wallet funded successfully',
      results
    });

  } catch (error) {
    console.error('Funding error:', error);
    res.status(500).json({ error: 'Failed to fund hot wallet' });
  }
});
`;

  console.log('📄 Funding endpoint code:');
  console.log(fundingEndpoint);
  console.log('\n💡 Add this endpoint to your API and call it with:');
  console.log('POST /api/wallet/fund-hot-wallet');
  console.log('Body: { "ethAmount": 0.1, "usdtAmount": 1000, "fundingWalletKey": "0x..." }');
}

// Run the funding script
fundHotWallet().catch(console.error);

export { fundHotWallet, createFundingEndpoint };
