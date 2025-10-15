import { Code, Key, Shield, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function APIDocs() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            NebulaX API Documentation
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Powerful API for automated trading, portfolio management, and data access
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/api-keys">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Key className="w-5 h-5 mr-2" />
                Manage API Keys
              </Button>
            </Link>
            <Button variant="outline" asChild>
              <a href="#getting-started">Get Started</a>
            </Button>
          </div>
        </div>

        {/* Quick Start */}
        <Card className="mb-8" id="getting-started">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Quick Start
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">1. Create API Keys</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  First, create your API keys from the API Keys management page. Choose appropriate permissions for your use case.
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <code className="text-sm">
                    API Key ID: nbx_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/>
                    API Secret: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                  </code>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">2. Authentication</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  Include your API credentials in the request headers:
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <code className="text-sm">
                    X-API-KEY: your_api_key_id<br/>
                    X-API-SECRET: your_api_secret
                  </code>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">3. Make Your First Request</h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <code className="text-sm">
                    curl -X GET "https://api.nebulaxexchange.io/v1/account/balance" \<br/>
                    &nbsp;&nbsp;-H "X-API-KEY: your_api_key_id" \<br/>
                    &nbsp;&nbsp;-H "X-API-SECRET: your_api_secret"
                  </code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Endpoints */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Account & Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">GET</Badge>
                    <code className="text-sm">/v1/account/info</code>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Get account information</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">GET</Badge>
                    <code className="text-sm">/v1/account/balance</code>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Get account balances</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">GET</Badge>
                    <code className="text-sm">/v1/account/history</code>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Get account history</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Trading
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="default">POST</Badge>
                    <code className="text-sm">/v1/orders</code>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Place new order</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">GET</Badge>
                    <code className="text-sm">/v1/orders</code>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Get open orders</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="destructive">DELETE</Badge>
                    <code className="text-sm">/v1/orders/:id</code>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Cancel order</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rate Limits */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Rate Limits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Request Limits</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Read Operations:</span>
                    <span className="font-mono">1000/minute</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Trade Operations:</span>
                    <span className="font-mono">100/minute</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Withdraw Operations:</span>
                    <span className="font-mono">10/hour</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transfer Operations:</span>
                    <span className="font-mono">50/hour</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">HTTP Status Codes</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>200 OK:</span>
                    <span>Success</span>
                  </div>
                  <div className="flex justify-between">
                    <span>401 Unauthorized:</span>
                    <span>Invalid API key</span>
                  </div>
                  <div className="flex justify-between">
                    <span>429 Too Many Requests:</span>
                    <span>Rate limit exceeded</span>
                  </div>
                  <div className="flex justify-between">
                    <span>500 Server Error:</span>
                    <span>Internal error</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Examples */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Code Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">JavaScript/Node.js</h4>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
{`const axios = require('axios');

const apiClient = axios.create({
  baseURL: 'https://api.nebulaxexchange.io/v1',
  headers: {
    'X-API-KEY': 'your_api_key_id',
    'X-API-SECRET': 'your_api_secret'
  }
});

// Get account balance
const balance = await apiClient.get('/account/balance');
console.log(balance.data);

// Place a buy order
const order = await apiClient.post('/orders', {
  symbol: 'BTC/USDT',
  side: 'buy',
  type: 'limit',
  amount: 0.001,
  price: 42000
});`}
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Python</h4>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
{`import requests

class NebulaXAPI:
    def __init__(self, api_key, api_secret):
        self.base_url = 'https://api.nebulaxexchange.io/v1'
        self.headers = {
            'X-API-KEY': api_key,
            'X-API-SECRET': api_secret
        }
    
    def get_balance(self):
        response = requests.get(
            f'{self.base_url}/account/balance',
            headers=self.headers
        )
        return response.json()
    
    def place_order(self, symbol, side, order_type, amount, price=None):
        data = {
            'symbol': symbol,
            'side': side,
            'type': order_type,
            'amount': amount
        }
        if price:
            data['price'] = price
        
        response = requests.post(
            f'{self.base_url}/orders',
            json=data,
            headers=self.headers
        )
        return response.json()

# Usage
api = NebulaXAPI('your_api_key_id', 'your_api_secret')
balance = api.get_balance()
print(balance)`}
                  </pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <Card>
          <CardHeader>
            <CardTitle>Support & Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-3">API Support</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Need help with integration? Our technical team is here to assist.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a href="mailto:developers@nebulaxexchange.io">Contact API Support</a>
                </Button>
              </div>
              <div>
                <h4 className="font-semibold mb-3">SDKs & Libraries</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Official SDKs for popular programming languages coming soon.
                </p>
                <Button variant="outline" size="sm" disabled>
                  SDKs Coming Soon
                </Button>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Webhooks</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Real-time notifications for orders, trades, and account events.
                </p>
                <Button variant="outline" size="sm" disabled>
                  Webhooks Coming Soon
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}