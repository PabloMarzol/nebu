import { useState, useEffect } from 'react';
import { authenticateWithWallet, storeAuthToken, clearAuthToken, getAuthToken } from '@/lib/walletAuth';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut, Copy, Check } from 'lucide-react';

// Decode JWT without verification (backend verifies)
function decodeJWT(token: string): { walletAddress: string } | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function WalletConnect() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Check if already authenticated on mount
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded?.walletAddress) {
        setWalletAddress(decoded.walletAddress);
      }
    }
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const result = await authenticateWithWallet();
      storeAuthToken(result.token);
      setWalletAddress(result.walletAddress);
      
      // Reload to update auth state everywhere
      window.location.reload();
    } catch (err: any) {
      console.error('Wallet connection error:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    clearAuthToken();
    setWalletAddress(null);
    window.location.reload();
  };

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Connected state - show wallet address with inline buttons
  if (walletAddress) {
    const shortAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
    
    return (
      <div className="flex items-center gap-2">
        {/* Wallet Address Display */}
        <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md">
          <Wallet className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-mono hidden sm:inline">{shortAddress}</span>
          <span className="text-sm font-mono sm:hidden">{walletAddress.slice(0, 4)}...</span>
        </div>
        
        {/* Copy Button */}
        <Button 
          variant="outline" 
          size="sm"
          onClick={copyAddress}
          className="hidden sm:flex"
        >
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
        
        {/* Disconnect Button */}
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleDisconnect}
          className="gap-1"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Disconnect</span>
        </Button>
      </div>
    );
  }

  // Not connected - show connect button
  return (
    <div className="flex flex-col gap-2">
      <Button 
        onClick={handleConnect} 
        disabled={isConnecting}
        className="gap-2"
      >
        <Wallet className="w-4 h-4" />
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </Button>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}