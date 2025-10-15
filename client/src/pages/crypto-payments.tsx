import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CryptoDepositInterface from "@/components/crypto/crypto-deposit-interface";
import ProtectedTradingWrapper from "@/components/auth/protected-trading-wrapper";
import { Wallet, TrendingDown, Shield, Clock } from "lucide-react";

export default function CryptoPayments() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Crypto Payments</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage cryptocurrency deposits and withdrawals with real blockchain integration
          </p>
        </div>

        {/* Status Banner */}
        <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-green-800 dark:text-green-200">
                  Real Blockchain Integration Active
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Connected to Ethereum mainnet via Infura. All transactions are processed on live blockchain networks.
                </p>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="border-green-300 text-green-700">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  Ethereum Live
                </Badge>
                <Badge variant="outline" className="border-green-300 text-green-700">
                  HD Wallets
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <ProtectedTradingWrapper feature="trading">
          <Tabs defaultValue="deposits" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="deposits">Deposits</TabsTrigger>
              <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="deposits" className="mt-6">
              <CryptoDepositInterface />
            </TabsContent>

            <TabsContent value="withdrawals" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5" />
                    Crypto Withdrawals
                  </CardTitle>
                  <CardDescription>
                    Withdraw cryptocurrency to external wallets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="font-medium mb-2">Withdrawal Interface</h3>
                    <p className="text-sm">
                      Secure withdrawal processing with multi-signature support and gas estimation.
                      This feature is being integrated with the trading engine balance management.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Transaction History
                  </CardTitle>
                  <CardDescription>
                    View all deposit and withdrawal transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="font-medium mb-2">Transaction History</h3>
                    <p className="text-sm">
                      Complete transaction history with blockchain confirmations and status tracking.
                      Real-time monitoring of payment confirmations across multiple networks.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <div className="grid gap-6">
                {/* Supported Networks */}
                <Card>
                  <CardHeader>
                    <CardTitle>Supported Networks</CardTitle>
                    <CardDescription>
                      Blockchain networks and currencies available for deposits and withdrawals
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { name: "Ethereum", symbol: "ETH", confirmations: 12, time: "3-5 min" },
                        { name: "Tether USD", symbol: "USDT", confirmations: 12, time: "3-5 min" },
                        { name: "USD Coin", symbol: "USDC", confirmations: 12, time: "3-5 min" },
                        { name: "Dai Stablecoin", symbol: "DAI", confirmations: 12, time: "3-5 min" },
                        { name: "Chainlink", symbol: "LINK", confirmations: 12, time: "3-5 min" },
                        { name: "Uniswap", symbol: "UNI", confirmations: 12, time: "3-5 min" }
                      ].map((currency) => (
                        <div key={currency.symbol} className="p-4 border rounded-lg">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {currency.symbol.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium">{currency.symbol}</div>
                              <div className="text-xs text-muted-foreground">{currency.name}</div>
                            </div>
                          </div>
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                              <span>Network:</span>
                              <span className="font-medium">Ethereum</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Confirmations:</span>
                              <span className="font-medium">{currency.confirmations}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Est. Time:</span>
                              <span className="font-medium">{currency.time}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Security Features */}
                <Card>
                  <CardHeader>
                    <CardTitle>Security Features</CardTitle>
                    <CardDescription>
                      Advanced security measures for cryptocurrency operations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium">Wallet Security</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>HD Wallet Implementation</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Deterministic Address Generation</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Encrypted Private Key Storage</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Multi-Signature Support</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium">Transaction Monitoring</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Real-time Payment Monitoring</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Blockchain Confirmation Tracking</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Automatic Balance Updates</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Gas Fee Optimization</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </ProtectedTradingWrapper>
      </div>
    </div>
  );
}