import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Shield, CheckCircle, Copy, ArrowLeft, Smartphone } from "lucide-react";

const verify2FASchema = z.object({
  token: z.string().length(6, "Please enter a 6-digit code"),
});

type Verify2FAForm = z.infer<typeof verify2FASchema>;

export default function Setup2FA() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState<'setup' | 'verify' | 'complete'>('setup');
  const [secretData, setSecretData] = useState<any>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<Verify2FAForm>({
    resolver: zodResolver(verify2FASchema),
    defaultValues: {
      token: "",
    },
  });

  const setup2FAMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("/api/auth/setup-2fa", {
        method: "POST",
      });
    },
    onSuccess: (data) => {
      setSecretData(data);
      setStep('verify');
    },
    onError: (error: Error) => {
      toast({
        title: "Setup failed",
        description: error.message || "Failed to setup 2FA. Please try again.",
        variant: "destructive",
      });
    },
  });

  const verify2FAMutation = useMutation({
    mutationFn: async (data: Verify2FAForm) => {
      return apiRequest("/api/auth/verify-2fa", {
        method: "POST",
        body: JSON.stringify({
          token: data.token,
          secret: secretData.secret,
          backupCodes: secretData.backupCodes,
        }),
      });
    },
    onSuccess: () => {
      setBackupCodes(secretData.backupCodes);
      setStep('complete');
      toast({
        title: "2FA enabled successfully",
        description: "Your account is now protected with two-factor authentication.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Verification failed",
        description: error.message || "Invalid verification code. Please try again.",
        variant: "destructive",
      });
    },
  });

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The backup codes have been copied to your clipboard.",
    });
  };

  const onSubmit = (data: Verify2FAForm) => {
    verify2FAMutation.mutate(data);
  };

  if (step === 'setup') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-2xl">Setup Two-Factor Authentication</CardTitle>
            <CardDescription>
              Add an extra layer of security to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Two-factor authentication (2FA) significantly improves your account security by requiring a second verification step.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <h3 className="font-semibold">Before you start:</h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Download an authenticator app (Google Authenticator, Authy, etc.)</li>
                  <li>• Make sure your phone is nearby</li>
                  <li>• Save the backup codes in a secure location</li>
                </ul>
              </div>

              <Button
                onClick={() => setup2FAMutation.mutate()}
                disabled={setup2FAMutation.isPending}
                className="w-full"
              >
                {setup2FAMutation.isPending ? "Setting up..." : "Begin Setup"}
              </Button>

              <div className="text-center">
                <Link href="/dashboard" className="text-sm text-gray-600 hover:underline">
                  <ArrowLeft className="w-4 h-4 inline mr-1" />
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'verify') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <Smartphone className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-2xl">Scan QR Code</CardTitle>
            <CardDescription>
              Use your authenticator app to scan the QR code below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-center">
                <img 
                  src={secretData?.qrCodeDataUrl} 
                  alt="2FA QR Code"
                  className="w-48 h-48 border rounded-lg"
                />
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Can't scan? Enter this code manually: <br />
                  <code className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    {secretData?.secret}
                  </code>
                </AlertDescription>
              </Alert>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="token"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Verification Code</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="123456" 
                            {...field}
                            disabled={verify2FAMutation.isPending}
                            maxLength={6}
                            className="text-center text-lg tracking-wider"
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-gray-500">
                          Enter the 6-digit code from your authenticator app
                        </p>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={verify2FAMutation.isPending}
                  >
                    {verify2FAMutation.isPending ? "Verifying..." : "Verify & Enable 2FA"}
                  </Button>
                </form>
              </Form>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl">2FA Setup Complete</CardTitle>
            <CardDescription>
              Your account is now protected with two-factor authentication
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> Save these backup codes in a secure location. You can use them to access your account if you lose your phone.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Backup Codes</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(backupCodes.join('\n'))}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy All
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {backupCodes.map((code, index) => (
                    <Badge key={index} variant="secondary" className="justify-center font-mono">
                      {code}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  Each backup code can only be used once.
                </p>
              </div>

              <Button
                onClick={() => navigate("/dashboard")}
                className="w-full"
              >
                Continue to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}