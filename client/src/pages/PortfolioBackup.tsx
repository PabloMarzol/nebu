import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { 
  Shield, 
  Download, 
  Upload, 
  Key, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Cloud,
  HardDrive,
  Smartphone,
  Lock,
  RefreshCw,
  FileText
} from "lucide-react";

export default function PortfolioBackup() {
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState('daily');

  const backupStatus = {
    lastBackup: '2 hours ago',
    nextBackup: 'In 22 hours',
    totalBackups: 47,
    totalSize: '2.3 GB',
    encryption: 'AES-256',
    cloudSync: true
  };

  const backupLocations = [
    {
      type: 'Cloud Storage',
      icon: <Cloud className="w-5 h-5" />,
      status: 'active',
      lastSync: '2 hours ago',
      size: '1.2 GB',
      encryption: true
    },
    {
      type: 'Local Device',
      icon: <HardDrive className="w-5 h-5" />,
      status: 'active',
      lastSync: '2 hours ago',
      size: '1.2 GB',
      encryption: true
    },
    {
      type: 'Mobile Backup',
      icon: <Smartphone className="w-5 h-5" />,
      status: 'pending',
      lastSync: '3 days ago',
      size: '890 MB',
      encryption: true
    }
  ];

  const recoveryOptions = [
    {
      scenario: 'Lost Device Access',
      difficulty: 'Easy',
      timeEstimate: '5-10 minutes',
      requirements: ['Email verification', 'Backup phrase'],
      success: '99.8%'
    },
    {
      scenario: 'Forgotten Password',
      difficulty: 'Easy',
      timeEstimate: '2-5 minutes',
      requirements: ['Email access', '2FA device'],
      success: '99.9%'
    },
    {
      scenario: 'Compromised Account',
      difficulty: 'Moderate',
      timeEstimate: '15-30 minutes',
      requirements: ['Identity verification', 'Backup files'],
      success: '98.5%'
    },
    {
      scenario: 'Complete Data Loss',
      difficulty: 'Advanced',
      timeEstimate: '30-60 minutes',
      requirements: ['Seed phrase', 'Identity docs', 'Support contact'],
      success: '95.2%'
    }
  ];

  const backupHistory = [
    { date: '2024-06-25 14:30', type: 'Automatic', status: 'success', size: '45.2 MB' },
    { date: '2024-06-24 14:30', type: 'Automatic', status: 'success', size: '44.8 MB' },
    { date: '2024-06-23 14:30', type: 'Automatic', status: 'success', size: '44.1 MB' },
    { date: '2024-06-22 16:45', type: 'Manual', status: 'success', size: '43.9 MB' },
    { date: '2024-06-22 14:30', type: 'Automatic', status: 'success', size: '43.7 MB' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20';
      case 'pending': return 'text-yellow-400 bg-yellow-500/20';
      case 'inactive': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400';
      case 'Moderate': return 'text-yellow-400';
      case 'Advanced': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🛡️ Portfolio Backup & Recovery</h1>
          <p className="text-gray-300">Secure portfolio backup and comprehensive recovery services</p>
        </div>

        {/* Backup Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Backup Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span>Auto-Backup</span>
                <Switch checked={autoBackupEnabled} onCheckedChange={setAutoBackupEnabled} />
              </div>
              <div className="text-sm text-gray-400">
                Last: {backupStatus.lastBackup}
              </div>
              <div className="text-sm text-gray-400">
                Next: {backupStatus.nextBackup}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Storage Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">{backupStatus.totalSize}</div>
              <Progress value={23} className="mb-2" />
              <div className="text-sm text-gray-400">
                {backupStatus.totalBackups} total backups
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Security Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold mb-2 text-green-400">Maximum</div>
              <Badge className="bg-green-500/20 text-green-400 mb-2">
                {backupStatus.encryption}
              </Badge>
              <div className="text-sm text-gray-400">End-to-end encrypted</div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Recovery Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2 text-blue-400">&lt; 10min</div>
              <div className="text-sm text-gray-400">
                Average recovery time
              </div>
              <Button size="sm" className="mt-2 w-full bg-blue-500 hover:bg-blue-600">
                Test Recovery
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="backup" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/20 backdrop-blur-lg">
            <TabsTrigger value="backup">Backup</TabsTrigger>
            <TabsTrigger value="recovery">Recovery</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="backup" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Download className="w-5 h-5" />
                    <span>Backup Locations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {backupLocations.map((location, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {location.icon}
                          <div>
                            <div className="font-semibold">{location.type}</div>
                            <div className="text-sm text-gray-400">
                              Last sync: {location.lastSync}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(location.status)}>
                            {location.status}
                          </Badge>
                          <div className="text-sm text-gray-400">{location.size}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <Button className="flex-1 bg-green-500 hover:bg-green-600">
                      <Download className="w-4 h-4 mr-2" />
                      Backup Now
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Add Location
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle>Backup Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Backup Frequency</label>
                      <div className="grid grid-cols-3 gap-2">
                        <Button 
                          variant={backupFrequency === 'daily' ? 'default' : 'outline'} 
                          size="sm"
                          onClick={() => setBackupFrequency('daily')}
                        >
                          Daily
                        </Button>
                        <Button 
                          variant={backupFrequency === 'weekly' ? 'default' : 'outline'} 
                          size="sm"
                          onClick={() => setBackupFrequency('weekly')}
                        >
                          Weekly
                        </Button>
                        <Button 
                          variant={backupFrequency === 'realtime' ? 'default' : 'outline'} 
                          size="sm"
                          onClick={() => setBackupFrequency('realtime')}
                        >
                          Real-time
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">Include Transaction History</h4>
                          <p className="text-sm text-gray-400">Backup all transaction records</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">Include Settings</h4>
                          <p className="text-sm text-gray-400">Backup app preferences and configurations</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">Compress Backups</h4>
                          <p className="text-sm text-gray-400">Reduce backup file size</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-black/20 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle>What Gets Backed Up</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <h4 className="font-semibold text-blue-400 mb-3">💼 Portfolio Data</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Asset holdings and balances</li>
                      <li>• Transaction history</li>
                      <li>• Trading preferences</li>
                      <li>• Performance metrics</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <h4 className="font-semibold text-green-400 mb-3">🔐 Security Settings</h4>
                    <ul className="text-sm space-y-1">
                      <li>• 2FA configuration</li>
                      <li>• Security preferences</li>
                      <li>• API access tokens</li>
                      <li>• Notification settings</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <h4 className="font-semibold text-purple-400 mb-3">⚙️ App Configuration</h4>
                    <ul className="text-sm space-y-1">
                      <li>• UI preferences</li>
                      <li>• Watchlists and alerts</li>
                      <li>• Custom indicators</li>
                      <li>• Theme and layout</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recovery" className="mt-6">
            <Card className="bg-black/20 backdrop-blur-lg border-white/10 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <RefreshCw className="w-5 h-5" />
                  <span>Recovery Scenarios</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recoveryOptions.map((option, index) => (
                    <div key={index} className="p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{option.scenario}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge className={`${getDifficultyColor(option.difficulty)} bg-transparent border`}>
                            {option.difficulty}
                          </Badge>
                          <span className="text-sm text-gray-400">{option.timeEstimate}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-sm font-semibold mb-2">Requirements:</h5>
                          <ul className="text-sm space-y-1">
                            {option.requirements.map((req, reqIndex) => (
                              <li key={reqIndex} className="flex items-center space-x-2">
                                <CheckCircle className="w-3 h-3 text-green-400" />
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-400 mb-1">Success Rate</div>
                          <div className="text-2xl font-bold text-green-400">{option.success}</div>
                          <Button size="sm" variant="outline" className="mt-2">
                            Test Recovery
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Upload className="w-5 h-5" />
                    <span>Manual Recovery</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <h4 className="font-semibold text-yellow-400 mb-2">⚠️ Important</h4>
                      <p className="text-sm">
                        Only use manual recovery if automated methods fail. Ensure you have your backup files and security keys ready.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <Button className="w-full bg-blue-500 hover:bg-blue-600">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Backup File
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Key className="w-4 h-4 mr-2" />
                        Enter Recovery Phrase
                      </Button>
                      <Button variant="outline" className="w-full">
                        <FileText className="w-4 h-4 mr-2" />
                        Use Recovery Code
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle>Recovery Verification</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Email verification</span>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>2FA authentication</span>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Identity verification</span>
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Backup validation</span>
                      <div className="w-5 h-5 border-2 border-gray-400 rounded-full"></div>
                    </div>
                    <div className="mt-6">
                      <Progress value={75} className="mb-2" />
                      <div className="text-sm text-gray-400">Recovery progress: 75%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lock className="w-5 h-5" />
                    <span>Encryption Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Encryption Algorithm</span>
                      <Badge className="bg-green-500/20 text-green-400">AES-256</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Key Derivation</span>
                      <Badge className="bg-blue-500/20 text-blue-400">PBKDF2</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Backup Integrity</span>
                      <Badge className="bg-purple-500/20 text-purple-400">SHA-256</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Zero Knowledge</span>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <h4 className="font-semibold text-green-400 mb-2">🔒 Security Guarantee</h4>
                    <p className="text-sm">
                      Your data is encrypted with military-grade encryption. We cannot access your backup data without your keys.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle>Security Keys Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">Master Key</span>
                        <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                      </div>
                      <div className="text-sm text-gray-400">
                        Last rotated: 30 days ago
                      </div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">Backup Key</span>
                        <Badge className="bg-blue-500/20 text-blue-400">Stored</Badge>
                      </div>
                      <div className="text-sm text-gray-400">
                        Securely stored offline
                      </div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">Recovery Phrase</span>
                        <Badge className="bg-purple-500/20 text-purple-400">Generated</Badge>
                      </div>
                      <div className="text-sm text-gray-400">
                        24-word mnemonic phrase
                      </div>
                    </div>
                    <Button className="w-full bg-red-500 hover:bg-red-600">
                      Rotate Security Keys
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-black/20 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle>Security Best Practices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-green-400">✅ Recommended Actions</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Enable automatic backups</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Store recovery phrase offline</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Test recovery process monthly</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Use multiple backup locations</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-red-400">⚠️ Security Warnings</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span>Never share your recovery phrase</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span>Don't store passwords in backups</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span>Verify backup integrity regularly</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span>Use secure networks for recovery</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card className="bg-black/20 backdrop-blur-lg border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Backup History</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {backupHistory.map((backup, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <div>
                          <div className="font-semibold">{backup.type} Backup</div>
                          <div className="text-sm text-gray-400">{backup.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-sm">Success</span>
                        </div>
                        <div className="text-sm text-gray-400">{backup.size}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle>Backup Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Backups</span>
                      <span className="font-semibold">47</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Success Rate</span>
                      <span className="font-semibold text-green-400">100%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Average Size</span>
                      <span className="font-semibold">44.2 MB</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Total Storage</span>
                      <span className="font-semibold text-blue-400">2.3 GB</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <CardTitle>Storage Optimization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Compression Ratio</span>
                        <span>76%</span>
                      </div>
                      <Progress value={76} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Deduplication</span>
                        <span>89%</span>
                      </div>
                      <Progress value={89} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Storage Efficiency</span>
                        <span>94%</span>
                      </div>
                      <Progress value={94} />
                    </div>
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <p className="text-sm">
                        💡 Your backups are highly optimized, saving 83% of potential storage space
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}