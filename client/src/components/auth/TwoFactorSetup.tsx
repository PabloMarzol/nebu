import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Copy, Download, Eye, EyeOff, Shield, Smartphone, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface TwoFactorSetupProps {
  userId: string;
  userEmail: string;
}

export function TwoFactorSetup({ userId, userEmail }: TwoFactorSetupProps) {
  console.log('TwoFactorSetup initialized with:', { userId, userEmail });
  const [verificationToken, setVerificationToken] = useState('');
  const [currentSecret, setCurrentSecret] = useState<string | null>(null);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const { toast } = useToast();

  // Get current 2FA status
  const { data: status, refetch: refetchStatus } = useQuery({
    queryKey: ['/api/2fa/status', userId],
    enabled: !!userId,
  });

  // Generate 2FA secret and QR code
  const generateMutation = useMutation({
    mutationFn: async () => {
      return apiRequest(`/api/2fa/generate`, {
        method: 'POST',
        body: { email: userEmail }
      });
    },
    onSuccess: (data) => {
      setCurrentSecret(data.secret);
      toast({
        title: "2FA Setup Generated",
        description: "Scan the QR code with your authenticator app.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate 2FA setup. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Enable 2FA
  const enableMutation = useMutation({
    mutationFn: async () => {
      if (!currentSecret || !verificationToken) {
        throw new Error('Secret and token required');
      }
      return apiRequest(`/api/2fa/enable`, {
        method: 'POST',
        body: {
          userId,
          secret: currentSecret,
          token: verificationToken
        }
      });
    },
    onSuccess: () => {
      refetchStatus();
      setVerificationToken('');
      setCurrentSecret(null);
      toast({
        title: "2FA Enabled",
        description: "Two-factor authentication has been successfully enabled.",
      });
    },
    onError: () => {
      toast({
        title: "Verification Failed",
        description: "Invalid token. Please check your authenticator app and try again.",
        variant: "destructive",
      });
    }
  });

  // Disable 2FA
  const disableMutation = useMutation({
    mutationFn: async () => {
      if (!verificationToken) {
        throw new Error('Token required');
      }
      return apiRequest(`/api/2fa/disable`, {
        method: 'POST',
        body: {
          userId,
          token: verificationToken
        }
      });
    },
    onSuccess: () => {
      refetchStatus();
      setVerificationToken('');
      setBackupCodes([]);
      toast({
        title: "2FA Disabled",
        description: "Two-factor authentication has been disabled.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to disable 2FA. Please verify your token.",
        variant: "destructive",
      });
    }
  });

  // Regenerate backup codes
  const regenerateCodesMutation = useMutation({
    mutationFn: async () => {
      if (!verificationToken) {
        throw new Error('Token required');
      }
      return apiRequest(`/api/2fa/backup-codes/regenerate`, {
        method: 'POST',
        body: {
          userId,
          token: verificationToken
        }
      });
    },
    onSuccess: (data) => {
      setBackupCodes(data.backupCodes);
      setShowBackupCodes(true);
      setVerificationToken('');
      toast({
        title: "Backup Codes Regenerated",
        description: "New backup codes have been generated. Save them securely.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to regenerate backup codes.",
        variant: "destructive",
      });
    }
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Copied to clipboard",
    });
  };

  const downloadBackupCodes = () => {
    const codesText = backupCodes.join('\n');
    const blob = new Blob([codesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nebulax-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!status?.data) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <CardTitle>Two-Factor Authentication</CardTitle>
          </div>
          <CardDescription>
            Add an extra layer of security to your account using Google Authenticator or similar TOTP apps.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span>Status:</span>
            <Badge variant="secondary">Disabled</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Click "Set Up 2FA" to begin the authentication setup process.
          </p>
        </CardContent>
      </Card>
    );
  }

  const is2FAEnabled = status.data.enabled;

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <CardTitle>Two-Factor Authentication</CardTitle>
          </div>
          <CardDescription>
            Add an extra layer of security to your account using Google Authenticator or similar TOTP apps.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span>Status:</span>
            <Badge variant={is2FAEnabled ? "default" : "secondary"}>
              {is2FAEnabled ? "Enabled" : "Disabled"}
            </Badge>
            {is2FAEnabled && (
              <Badge variant="outline">
                {status.data.backupCodesCount} backup codes remaining
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Setup/Disable Card */}
      {!is2FAEnabled ? (
        // Setup 2FA
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Set Up Two-Factor Authentication
            </CardTitle>
            <CardDescription>
              Follow these steps to secure your account with 2FA.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!generateMutation.data ? (
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  Step 1: Click the button below to generate your 2FA setup.
                </p>
                <Button 
                  onClick={() => generateMutation.mutate()}
                  disabled={generateMutation.isPending}
                >
                  {generateMutation.isPending ? "Generating..." : "Generate 2FA Setup"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
                  <Smartphone className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800 dark:text-blue-200">
                    <strong>Step 1:</strong> Download Google Authenticator app from your app store first.
                    <br />
                    <span className="text-sm">Available for iOS and Android devices</span>
                  </AlertDescription>
                </Alert>

                <div>
                  <Label className="text-sm font-medium">Step 2: Scan QR Code with Google Authenticator</Label>
                  <div className="mt-2 p-6 bg-white dark:bg-gray-100 rounded-lg border inline-block">
                    <img 
                      src={generateMutation.data.qrCode} 
                      alt="2FA QR Code for Google Authenticator"
                      className="w-52 h-52"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Open Google Authenticator → Tap "+" → Choose "Scan QR Code"
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Alternative: Enter this key manually in Google Authenticator</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input 
                      value={generateMutation.data.manualEntryKey}
                      readOnly
                      className="font-mono text-sm bg-gray-50 dark:bg-gray-800"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(generateMutation.data.manualEntryKey)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Google Authenticator → "+" → "Enter setup key" → paste this code
                  </p>
                </div>

                <Separator />

                <div>
                  <Label htmlFor="token">Step 3: Enter 6-digit code from Google Authenticator</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="token"
                      placeholder="123456"
                      value={verificationToken}
                      onChange={(e) => setVerificationToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      maxLength={6}
                      className="font-mono text-lg text-center"
                    />
                    <Button 
                      onClick={() => enableMutation.mutate()}
                      disabled={verificationToken.length !== 6 || enableMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {enableMutation.isPending ? "Verifying..." : "Enable Google 2FA"}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    The 6-digit number updates every 30 seconds in your Google Authenticator app
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        // Manage 2FA
        <div className="space-y-4">
          {/* Disable 2FA */}
          <Card>
            <CardHeader>
              <CardTitle className="text-destructive">Disable Two-Factor Authentication</CardTitle>
              <CardDescription>
                This will remove 2FA protection from your account. Enter a verification code to confirm.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter 2FA code"
                  value={verificationToken}
                  onChange={(e) => setVerificationToken(e.target.value)}
                  maxLength={6}
                  className="font-mono"
                />
                <Button 
                  variant="destructive"
                  onClick={() => disableMutation.mutate()}
                  disabled={!verificationToken || disableMutation.isPending}
                >
                  {disableMutation.isPending ? "Disabling..." : "Disable 2FA"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Backup Codes */}
          <Card>
            <CardHeader>
              <CardTitle>Backup Codes</CardTitle>
              <CardDescription>
                Use these codes if you lose access to your authenticator app. Each code can only be used once.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter 2FA code to regenerate"
                  value={verificationToken}
                  onChange={(e) => setVerificationToken(e.target.value)}
                  maxLength={6}
                  className="font-mono"
                />
                <Button 
                  onClick={() => regenerateCodesMutation.mutate()}
                  disabled={!verificationToken || regenerateCodesMutation.isPending}
                >
                  {regenerateCodesMutation.isPending ? "Generating..." : "Regenerate Codes"}
                </Button>
              </div>

              {backupCodes.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Your backup codes:</Label>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowBackupCodes(!showBackupCodes)}
                      >
                        {showBackupCodes ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={downloadBackupCodes}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {showBackupCodes && (
                    <div className="grid grid-cols-2 gap-2 p-4 bg-muted rounded-lg">
                      {backupCodes.map((code, index) => (
                        <div key={index} className="font-mono text-sm p-2 bg-background rounded border">
                          {code}
                        </div>
                      ))}
                    </div>
                  )}

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Store these codes securely. They won't be shown again.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}