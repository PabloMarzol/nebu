import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield,
  Download,
  Upload,
  Clock,
  CheckCircle,
  AlertTriangle,
  Key,
  Lock,
  Unlock,
  FileText,
  Cloud,
  HardDrive,
  Smartphone,
  Copy,
  QrCode,
  Eye,
  EyeOff,
  RefreshCw,
  Zap,
  Archive
} from "lucide-react";

interface BackupStatus {
  id: string;
  type: "full" | "incremental" | "emergency";
  status: "completed" | "in_progress" | "failed" | "scheduled";
  timestamp: string;
  size: string;
  location: "cloud" | "local" | "hardware";
  encrypted: boolean;
  verified: boolean;
  assets: string[];
}

interface RecoveryOption {
  id: string;
  name: string;
  description: string;
  timeToRecover: string;
  dataIntegrity: number;
  securityLevel: "high" | "medium" | "low";
  requirements: string[];
  available: boolean;
}

interface SeedPhrase {
  words: string[];
  checksum: string;
  strength: "128" | "256";
  verified: boolean;
  lastBackup: string;
}

export default function PortfolioBackupRecovery() {
  const [backupProgress, setBackupProgress] = useState(0);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [backupPassword, setBackupPassword] = useState("");
  const [selectedRecoveryMethod, setSelectedRecoveryMethod] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const seedPhrase: SeedPhrase = {
    words: [
      "abandon", "ability", "able", "about", "above", "absent",
      "absorb", "abstract", "absurd", "abuse", "access", "accident",
      "account", "accurate", "achieve", "acid", "acoustic", "acquire",
      "across", "action", "actor", "actress", "actual", "adapt"
    ],
    checksum: "a1b2c3d4",
    strength: "256",
    verified: true,
    lastBackup: "2024-01-15 10:30:00"
  };

  const backupHistory: BackupStatus[] = [
    {
      id: "1",
      type: "full",
      status: "completed",
      timestamp: "2024-01-15 10:30:00",
      size: "2.4 MB",
      location: "cloud",
      encrypted: true,
      verified: true,
      assets: ["BTC", "ETH", "SOL", "USDC"]
    },
    {
      id: "2",
      type: "incremental",
      status: "completed",
      timestamp: "2024-01-14 18:45:00",
      size: "156 KB",
      location: "local",
      encrypted: true,
      verified: true,
      assets: ["ETH", "SOL"]
    },
    {
      id: "3",
      type: "emergency",
      status: "completed",
      timestamp: "2024-01-13 22:15:00",
      size: "1.8 MB",
      location: "hardware",
      encrypted: true,
      verified: true,
      assets: ["BTC", "ETH", "SOL", "USDC"]
    },
    {
      id: "4",
      type: "full",
      status: "failed",
      timestamp: "2024-01-12 14:20:00",
      size: "0 KB",
      location: "cloud",
      encrypted: false,
      verified: false,
      assets: []
    }
  ];

  const recoveryOptions: RecoveryOption[] = [
    {
      id: "seed_phrase",
      name: "Seed Phrase Recovery",
      description: "Restore wallet using 24-word seed phrase",
      timeToRecover: "2-5 minutes",
      dataIntegrity: 100,
      securityLevel: "high",
      requirements: ["24-word seed phrase", "Passphrase (optional)"],
      available: true
    },
    {
      id: "backup_file",
      name: "Encrypted Backup File",
      description: "Restore from encrypted backup file",
      timeToRecover: "1-3 minutes",
      dataIntegrity: 100,
      securityLevel: "high",
      requirements: ["Backup file", "Backup password"],
      available: true
    },
    {
      id: "hardware_wallet",
      name: "Hardware Wallet Import",
      description: "Import existing hardware wallet",
      timeToRecover: "5-10 minutes",
      dataIntegrity: 100,
      securityLevel: "high",
      requirements: ["Compatible hardware wallet", "PIN/Password"],
      available: true
    },
    {
      id: "cloud_restore",
      name: "Cloud Backup Restore",
      description: "Restore from secure cloud backup",
      timeToRecover: "3-7 minutes",
      dataIntegrity: 98,
      securityLevel: "medium",
      requirements: ["Account verification", "2FA authentication"],
      available: true
    },
    {
      id: "social_recovery",
      name: "Social Recovery",
      description: "Recovery using trusted contacts",
      timeToRecover: "24-48 hours",
      dataIntegrity: 95,
      securityLevel: "medium",
      requirements: ["3 of 5 trusted contacts", "Identity verification"],
      available: false
    }
  ];

  const createBackup = async (type: "full" | "incremental" | "emergency") => {
    setIsBackingUp(true);
    setBackupProgress(0);

    // Simulate backup progress
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBackingUp(false);
          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 300);
  };

  const downloadBackup = () => {
    const backupData = {
      version: "1.0",
      timestamp: new Date().toISOString(),
      wallets: [
        {
          address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
          asset: "BTC",
          balance: "2.45673891",
          privateKey: "[ENCRYPTED]"
        },
        {
          address: "0x742d35Cc6672C0532925a3b8D9C5242b9B8d4a5B",
          asset: "ETH", 
          balance: "15.78934521",
          privateKey: "[ENCRYPTED]"
        }
      ],
      settings: {
        encrypted: true,
        checksum: "a1b2c3d4e5f6"
      }
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nebulax-backup-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const initiateRecovery = async (method: string) => {
    setIsRestoring(true);
    setSelectedRecoveryMethod(method);
    
    // Simulate recovery process
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsRestoring(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-400 bg-green-400/10 border-green-400/20";
      case "in_progress": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "failed": return "text-red-400 bg-red-400/10 border-red-400/20";
      case "scheduled": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getLocationIcon = (location: string) => {
    switch (location) {
      case "cloud": return <Cloud className="w-4 h-4" />;
      case "local": return <HardDrive className="w-4 h-4" />;
      case "hardware": return <Smartphone className="w-4 h-4" />;
      default: return <Archive className="w-4 h-4" />;
    }
  };

  const getSecurityLevelColor = (level: string) => {
    switch (level) {
      case "high": return "text-green-400 bg-green-400/10 border-green-400/20";
      case "medium": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "low": return "text-red-400 bg-red-400/10 border-red-400/20";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions Header */}
      <Card className="glass border-blue-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Portfolio Backup & Recovery</h3>
                <p className="text-sm text-muted-foreground">Secure your assets with one-click backup and recovery</p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={() => createBackup("full")}
                disabled={isBackingUp}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                {isBackingUp ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Backing Up...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Quick Backup
                  </>
                )}
              </Button>
              
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Restore
              </Button>
            </div>
          </div>
          
          {isBackingUp && (
            <div className="mt-4">
              <Progress value={backupProgress} className="h-2" />
              <div className="text-sm text-muted-foreground mt-1">
                Creating backup... {Math.round(backupProgress)}%
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="backup" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="backup">Create Backup</TabsTrigger>
          <TabsTrigger value="recovery">Recovery Options</TabsTrigger>
          <TabsTrigger value="seed">Seed Phrase</TabsTrigger>
          <TabsTrigger value="history">Backup History</TabsTrigger>
        </TabsList>

        <TabsContent value="backup" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass border-green-500/30 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Archive className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h4 className="font-semibold text-lg mb-2">Full Backup</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Complete backup of all wallets, keys, and settings
                </p>
                <Button 
                  onClick={() => createBackup("full")}
                  disabled={isBackingUp}
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Create Full Backup
                </Button>
                <div className="mt-2 text-xs text-muted-foreground">
                  Estimated time: 2-3 minutes
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-blue-500/30 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Zap className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h4 className="font-semibold text-lg mb-2">Quick Backup</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Incremental backup of recent changes only
                </p>
                <Button 
                  onClick={() => createBackup("incremental")}
                  disabled={isBackingUp}
                  className="w-full"
                  variant="outline"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Quick Backup
                </Button>
                <div className="mt-2 text-xs text-muted-foreground">
                  Estimated time: 30 seconds
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-red-500/30 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h4 className="font-semibold text-lg mb-2">Emergency Backup</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Secure backup for immediate asset protection
                </p>
                <Button 
                  onClick={() => createBackup("emergency")}
                  disabled={isBackingUp}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Emergency Backup
                </Button>
                <div className="mt-2 text-xs text-muted-foreground">
                  Estimated time: 1 minute
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Backup Options */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Backup Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold mb-2 block">Backup Password</label>
                  <Input
                    type="password"
                    placeholder="Enter backup encryption password"
                    value={backupPassword}
                    onChange={(e) => setBackupPassword(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Strong password required for encryption
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-semibold mb-2 block">Backup Location</label>
                  <select className="w-full p-3 bg-background border border-border rounded-lg">
                    <option value="cloud">Secure Cloud Storage</option>
                    <option value="local">Local Download</option>
                    <option value="hardware">Hardware Device</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Lock className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="font-semibold">Automatic Encryption</div>
                    <div className="text-sm text-muted-foreground">
                      All backups are encrypted with AES-256
                    </div>
                  </div>
                </div>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>

              <Button onClick={downloadBackup} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download Backup File
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recovery" className="space-y-6">
          <div className="space-y-4">
            {recoveryOptions.map((option) => (
              <Card key={option.id} className={`glass hover:shadow-2xl transition-all duration-300 ${!option.available ? 'opacity-50' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h4 className="font-semibold text-lg">{option.name}</h4>
                        <Badge className={getSecurityLevelColor(option.securityLevel)} variant="outline">
                          {option.securityLevel} security
                        </Badge>
                        {!option.available && (
                          <Badge variant="outline" className="text-gray-400">
                            Coming Soon
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4">{option.description}</p>
                      
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="text-xs text-muted-foreground">Recovery Time</div>
                          <div className="font-semibold">{option.timeToRecover}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Data Integrity</div>
                          <div className="font-semibold text-green-400">{option.dataIntegrity}%</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Security Level</div>
                          <div className={`font-semibold ${getSecurityLevelColor(option.securityLevel).split(' ')[0]}`}>
                            {option.securityLevel}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-semibold mb-2">Requirements:</div>
                        <div className="space-y-1">
                          {option.requirements.map((req, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm">
                              <div className="w-1 h-1 bg-blue-400 rounded-full" />
                              <span className="text-muted-foreground">{req}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => initiateRecovery(option.id)}
                      disabled={!option.available || isRestoring}
                      className="ml-6"
                    >
                      {isRestoring && selectedRecoveryMethod === option.id ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Restoring...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Start Recovery
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* File Upload for Recovery */}
          <Card className="glass border-purple-500/30">
            <CardHeader>
              <CardTitle>Upload Backup File</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Drag and drop your backup file here, or click to browse
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,.backup"
                  className="hidden"
                />
              </div>
              
              <div>
                <label className="text-sm font-semibold mb-2 block">Backup Password</label>
                <Input
                  type="password"
                  placeholder="Enter backup decryption password"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seed" className="space-y-6">
          <Card className="glass border-yellow-500/30">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="w-6 h-6 text-yellow-400" />
                <span>Recovery Seed Phrase</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div className="text-sm">
                    <strong>Important:</strong> Your seed phrase is the master key to your wallet. 
                    Store it safely and never share it with anyone.
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">24-Word Recovery Phrase</h4>
                  <p className="text-sm text-muted-foreground">Last backup: {seedPhrase.lastBackup}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSeedPhrase(!showSeedPhrase)}
                  >
                    {showSeedPhrase ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button variant="outline" size="sm">
                    <QrCode className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {showSeedPhrase ? (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {seedPhrase.words.map((word, index) => (
                    <div key={index} className="p-3 bg-slate-800/50 border border-border rounded-lg text-center">
                      <div className="text-xs text-muted-foreground">{index + 1}</div>
                      <div className="font-mono font-semibold">{word}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {Array.from({ length: 24 }, (_, index) => (
                    <div key={index} className="p-3 bg-slate-800/50 border border-border rounded-lg text-center">
                      <div className="text-xs text-muted-foreground">{index + 1}</div>
                      <div className="font-mono font-semibold">••••••</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Strength:</span>
                  <Badge className="bg-green-500/20 text-green-400" variant="outline">
                    {seedPhrase.strength}-bit
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Verified:</span>
                  <Badge className="bg-green-500/20 text-green-400" variant="outline">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Checksum:</span>
                  <code className="text-xs font-mono">{seedPhrase.checksum}</code>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button 
                  className="flex-1"
                  onClick={() => copyToClipboard(seedPhrase.words.join(' '))}
                  disabled={!showSeedPhrase}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Phrase
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" className="flex-1">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Seed Phrase Verification */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Verify Your Seed Phrase</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Test your seed phrase backup by entering specific words to ensure accuracy.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block">Word #7</label>
                  <Input placeholder="Enter the 7th word" />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Word #15</label>
                  <Input placeholder="Enter the 15th word" />
                </div>
              </div>
              
              <Button variant="outline" className="w-full">
                <CheckCircle className="w-4 h-4 mr-2" />
                Verify Seed Phrase
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <div className="space-y-4">
            {backupHistory.map((backup) => (
              <Card key={backup.id} className="glass hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-lg bg-slate-800/50">
                        {getLocationIcon(backup.location)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold capitalize">{backup.type} Backup</h4>
                          <Badge className={getStatusColor(backup.status)} variant="outline">
                            {backup.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{backup.timestamp}</span>
                          <span>{backup.size}</span>
                          <span className="capitalize">{backup.location}</span>
                        </div>
                        {backup.assets.length > 0 && (
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-xs text-muted-foreground">Assets:</span>
                            {backup.assets.map((asset, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {asset}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center space-x-2 text-sm">
                          {backup.encrypted && <Lock className="w-3 h-3 text-green-400" />}
                          {backup.verified && <CheckCircle className="w-3 h-3 text-green-400" />}
                        </div>
                      </div>
                      
                      {backup.status === "completed" && (
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Upload className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}