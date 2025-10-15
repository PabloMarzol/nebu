import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { WalletConnect } from "@/components/WalletConnect";

interface AuthError {
  type: 'unauthorized' | 'forbidden' | 'session_expired' | 'network' | 'unknown';
  message: string;
}

interface AuthErrorHandlerProps {
  error?: AuthError;
  onRetry?: () => void;
}

export default function AuthErrorHandler({ error, onRetry }: AuthErrorHandlerProps) {
  if (!error) return null;

  const getErrorConfig = (type: AuthError['type']) => {
    switch (type) {
      case 'unauthorized':
        return {
          title: 'Wallet Not Connected',
          description: 'Please connect your wallet to access this feature.',
          action: 'connect',
        };
      case 'session_expired':
        return {
          title: 'Session Expired',
          description: 'Your session has expired. Please reconnect your wallet.',
          action: 'connect',
        };
      case 'forbidden':
        return {
          title: 'Access Denied',
          description: 'You do not have permission to access this resource.',
          action: null,
        };
      case 'network':
        return {
          title: 'Network Error',
          description: 'Unable to connect to the server. Please check your internet connection.',
          action: 'retry',
        };
      default:
        return {
          title: 'Error',
          description: error.message || 'An unexpected error occurred.',
          action: 'retry',
        };
    }
  };

  const config = getErrorConfig(error.type);

  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{config.title}</AlertTitle>
      <AlertDescription>
        {config.description}
        <div className="mt-4 flex gap-2">
          {config.action === 'connect' && (
            <WalletConnect />
          )}
          {config.action === 'retry' && onRetry && (
            <Button onClick={onRetry} size="sm" variant="outline">
              Retry
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}