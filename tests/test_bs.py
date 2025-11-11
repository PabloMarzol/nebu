import requests
import json
import hmac
import hashlib
import os
from dotenv import load_dotenv
import time
from typing import Dict, Any, Optional

load_dotenv()
ALT5_PAY_EMAIL = str(os.getenv("ALT5_PAY_EMAIL"))
ALT5_PAY_PASSWORD = str(os.getenv("ALT5_PAY_PASSWORD"))

class ALT5TradingAPI:
    """Simple ALT5 Trading API client for testing buy/sell capabilities"""
    
    def __init__(self, email: str = None, password: str = None, 
                 public_key: str = None, private_key: str = None, 
                 base_url: str = "https://trade.alt5pro.com"):
        # Support both authentication methods
        self.email = email
        self.password = password
        self.public_key = public_key
        self.private_key = private_key
        self.base_url = base_url
        self.session = requests.Session()
        self.account_id = None
        self.user_id = None
        
    def login_with_credentials(self, two_fa_code: str = None) -> Dict[str, Any]:
        """Login using email/password (for cookie-based auth)"""
        if not self.email or not self.password:
            return {"success": False, "error": "Email and password required"}
        
        # Step 1: Initial login
        login_data = {
            "email": self.email,
            "password": self.password
        }
        
        login_url = f"{self.base_url}/identity/api/v2/identity/exchange-users/users/signin/"
        print(f"[DEBUG] Attempting login to: {login_url}")
        
        response = self.session.post(login_url, json=login_data)
        print(f"[DEBUG] Login response status: {response.status_code}")
        
        if response.status_code != 200:
            try:
                error_data = response.json()
                print(f"[DEBUG] Login error response: {error_data}")
            except:
                print(f"[DEBUG] Login error response (non-JSON): {response.text}")
            
            return {
                "success": False, 
                "status_code": response.status_code,
                "error": "Login failed",
                "data": response.text
            }
        
        print("✅ Step 1: Email/password authentication successful!")
        
        # Step 2: 2FA confirmation
        if two_fa_code is None:
            print("\n📧 Please check your email or authenticator app for the 2FA code")
            two_fa_code = input("Enter 2FA code: ").strip()
        
        twofa_url = f"{self.base_url}/identity/api/v2/identity/exchange-users/users/signin/2fa"
        twofa_data = {"VerificationCode": two_fa_code}
        
        print(f"[DEBUG] Attempting 2FA to: {twofa_url}")
        response = self.session.post(twofa_url, json=twofa_data)
        print(f"[DEBUG] 2FA response status: {response.status_code}")
        
        if response.status_code == 200:
            try:
                user_data = response.json()
                self.user_id = user_data.get("id")
                print(f"✅ Step 2: 2FA successful! User ID: {self.user_id}")
                return {"success": True, "data": user_data}
            except:
                print(f"✅ Step 2: 2FA successful!")
                return {"success": True, "data": "Login successful"}
        else:
            try:
                error_data = response.json()
                print(f"[DEBUG] 2FA error response: {error_data}")
            except:
                print(f"[DEBUG] 2FA error response (non-JSON): {response.text}")
            
            return {
                "success": False,
                "status_code": response.status_code,
                "error": "2FA failed",
                "data": response.text
            }
    
    def _generate_signature(self, timestamp: int, method: str, url_path: str, body: str = "") -> str:
        """Generate HMAC-SHA512 signature for API key authentication"""
        if not self.private_key:
            return ""
        
        signature_source = f"{timestamp}{method}{url_path}{body}"
        signature = hmac.new(
            self.private_key.encode('utf-8'),
            signature_source.encode('utf-8'),
            hashlib.sha512
        ).hexdigest().upper()
        return signature
    
    def _make_request(self, method: str, endpoint: str, data: Optional[Dict] = None, use_frontoffice: bool = True) -> Dict[str, Any]:
        """Make authenticated request to ALT5 API"""
        base_url = f"{self.base_url}/frontoffice" if use_frontoffice else self.base_url
        url = f"{base_url}{endpoint}"
        timestamp = int(time.time() * 1000)
        
        # Prepare request body
        body = json.dumps(data) if data else ""
        
        # Prepare headers
        headers = {"Content-Type": "application/json"}
        
        # Add API key authentication if available
        if self.public_key and self.private_key:
            signature = self._generate_signature(timestamp, method, endpoint, body)
            headers.update({
                "API-Key": self.public_key,
                "API-Sign": signature,
                "API-Timestamp": str(timestamp)
            })
            print(f"[DEBUG] Using API key authentication")
        else:
            print(f"[DEBUG] Using cookie-based authentication")
        
        print(f"[DEBUG] Making {method} request to: {url}")
        print(f"[DEBUG] Headers: {headers}")
        
        # Make request
        if method == "GET":
            response = self.session.get(url, headers=headers)
        elif method == "POST":
            response = self.session.post(url, headers=headers, data=body)
        elif method == "DELETE":
            response = self.session.delete(url, headers=headers)
        else:
            raise ValueError(f"Unsupported HTTP method: {method}")
        
        print(f"[DEBUG] Response status: {response.status_code}")
        
        try:
            result = response.json()
            print(f"[DEBUG] Response body: {json.dumps(result, indent=2)}")
            return {
                "success": response.status_code < 400,
                "status_code": response.status_code,
                "data": result
            }
        except json.JSONDecodeError:
            print(f"[DEBUG] Non-JSON response: {response.text}")
            return {
                "success": response.status_code < 400,
                "status_code": response.status_code,
                "data": response.text
            }
    
    def get_profile(self) -> Dict[str, Any]:
        """Test API connectivity by getting profile info"""
        return self._make_request("GET", "/api/profile")
    
    def get_accounts(self) -> Dict[str, Any]:
        """Get user accounts (needed for account_id)"""
        result = self._make_request("GET", "/api/accounts")
        
        # Store account_id if successful
        if result["success"] and result["data"]:
            accounts = result["data"] if isinstance(result["data"], list) else [result["data"]]
            if accounts and len(accounts) > 0:
                self.account_id = accounts[0].get("id")
                print(f"[DEBUG] Stored account ID: {self.account_id}")
        
        return result
    
    def create_order(self, account_id: str, instrument: str, order_type: str, 
                    amount: float, price: float = None, is_limit: bool = True) -> Dict[str, Any]:
        """Create a buy/sell order"""
        order_data = {
            "Order": {
                "Instrument": instrument,
                "Type": order_type,  # "buy" or "sell"
                "Amount": amount,
                "IsLimit": is_limit,
                "IsStop": False,
                "ActivationPrice": None
            }
        }
        
        # Add price for limit orders
        if is_limit and price is not None:
            order_data["Order"]["Price"] = price
        
        return self._make_request("POST", f"/api/{account_id}/order", order_data)
    
    def get_my_orders(self, account_id: str) -> Dict[str, Any]:
        """Get active orders"""
        return self._make_request("GET", f"/api/{account_id}/orders/my")
    
    def cancel_order(self, account_id: str, order_id: str) -> Dict[str, Any]:
        """Cancel specific order"""
        return self._make_request("DELETE", f"/api/{account_id}/orders/{order_id}")
    
    def cancel_all_orders(self, account_id: str, market: str = None) -> Dict[str, Any]:
        """Cancel all orders (optionally for specific market)"""
        endpoint = f"/api/{account_id}/orders"
        if market:
            endpoint += f"?market={market}"
        return self._make_request("DELETE", endpoint)


def test_alt5_trading():
    """Test function to verify ALT5 trading capabilities"""
    
    print("=" * 50)
    print("ALT5 Trading API Test")
    print("=" * 50)
    
    # Method 1: Try API Key authentication first
    print("\n🔐 METHOD 1: Testing API Key Authentication...")
    api_key_client = ALT5TradingAPI(
        public_key="f37713f9-9130-4c7d-9490-164808d53741",
        private_key="139209"
    )
    
    print("\n1a. Testing profile endpoint with API keys...")
    profile_result = api_key_client.get_profile()
    
    if profile_result["success"]:
        print("✅ API Key authentication successful!")
        
        # Continue with API key method
        print("\n2a. Getting accounts with API keys...")
        accounts_result = api_key_client.get_accounts()
        
        if accounts_result["success"] and api_key_client.account_id:
            print(f"✅ Account ID obtained: {api_key_client.account_id}")
            
            # Test order creation
            print("\n3a. Testing order creation with API keys...")
            test_order_creation(api_key_client, api_key_client.account_id)
            return
        else:
            print(f"❌ Failed to get accounts: {accounts_result}")
    else:
        print(f"❌ API Key authentication failed: {profile_result}")
    
    # Method 2: Try cookie-based authentication
    print("\n🍪 METHOD 2: Testing Cookie-based Authentication...")
    print(f"📧 Using email: {ALT5_PAY_EMAIL}")
    
    if ALT5_PAY_EMAIL and ALT5_PAY_PASSWORD:
        cookie_client = ALT5TradingAPI(email=ALT5_PAY_EMAIL, password=ALT5_PAY_PASSWORD)
        
        print("\n1b. Attempting login...")
        login_result = cookie_client.login_with_credentials()
        
        if login_result["success"]:
            print("✅ Cookie authentication successful!")
            
            print("\n2b. Getting accounts with cookies...")
            accounts_result = cookie_client.get_accounts()
            
            if accounts_result["success"] and cookie_client.account_id:
                print(f"✅ Account ID obtained: {cookie_client.account_id}")
                
                # Test order creation
                print("\n3b. Testing order creation with cookies...")
                test_order_creation(cookie_client, cookie_client.account_id)
                return
            else:
                print(f"❌ Failed to get accounts: {accounts_result}")
        else:
            print(f"❌ Cookie authentication failed: {login_result}")
    else:
        print("❌ Email/password not found in environment variables")
    
    print("\n" + "=" * 50)
    print("❌ Both authentication methods failed!")
    print("Please check:")
    print("1. API key credentials are correct")
    print("2. Account has proper permissions")
    print("3. ALT5 API endpoints are accessible")
    print("4. Environment variables ALT5_PAY_EMAIL and ALT5_PAY_PASSWORD are set")
    print("=" * 50)


def test_order_creation(api_client, account_id: str):
    """Test order creation and cancellation"""
    
    # Test: Get current orders
    print(f"\n📋 Getting current active orders...")
    orders_result = api_client.get_my_orders(account_id)
    
    if orders_result["success"]:
        print("✅ Orders retrieved successfully!")
        current_orders = orders_result["data"] or []
        print(f"📊 Current active orders: {len(current_orders)}")
        
        # Show current orders if any
        if current_orders:
            print("Current orders:")
            for order in current_orders[:3]:  # Show first 3 orders
                print(f"  - {order.get('type', 'N/A')} {order.get('amount', 'N/A')} {order.get('instrument', 'N/A')} at ${order.get('price', 'N/A')}")
    else:
        print(f"⚠️ Failed to get orders: {orders_result}")
    
    # Test: Create small test order
    print(f"\n💰 Testing order creation...")
    print("⚠️  This will create a REAL order with very low price (should not execute)")
    print("⚠️  Order will be cancelled immediately after creation")
    
    confirm = input("\nContinue with test order? (y/N): ").strip().lower()
    if confirm != 'y':
        print("Test order creation skipped.")
        return
    
    # Create test order
    print(f"\n📝 Creating test order: BUY 1 XRP at $0.01...")
    test_order = api_client.create_order(
        account_id=account_id,
        instrument="xrp_usd",
        order_type="buy",
        amount=1.0,  # 1 XRP
        price=0.01,  # Very low price - should not execute
        is_limit=True
    )
    
    if test_order["success"]:
        print("✅ Test order created successfully!")
        order_data = test_order["data"]
        order_id = order_data.get("id") or order_data.get("orderId")
        
        if order_id:
            print(f"📝 Order ID: {order_id}")
            
            # Wait a moment
            print("⏳ Waiting 2 seconds before cancelling...")
            time.sleep(2)
            
            # Cancel the test order
            print(f"\n❌ Cancelling test order {order_id}...")
            cancel_result = api_client.cancel_order(account_id, order_id)
            
            if cancel_result["success"]:
                print("✅ Test order cancelled successfully!")
                print("🎉 ALT5 Trading API is working correctly!")
            else:
                print(f"⚠️ Failed to cancel test order: {cancel_result}")
                print("⚠️ Please manually cancel this order in the ALT5 interface!")
        else:
            print("⚠️ Order created but no ID returned")
            print(f"Order response: {order_data}")
    else:
        print(f"❌ Test order creation failed: {test_order}")
        
        # Check if it's a balance issue
        error_msg = str(test_order.get("data", "")).lower()
        if "insufficient" in error_msg:
            print("💡 This might be due to insufficient balance - which is expected for testing")
        elif "unauthorized" in error_msg or "forbidden" in error_msg:
            print("💡 This might be due to missing trading permissions on the account")


if __name__ == "__main__":
    test_alt5_trading()