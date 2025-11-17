#!/bin/bash

# ============================================
# OnRamp Money Issue Diagnostic Tool
# ============================================

echo "🔍 OnRamp Money Integration Diagnostic"
echo "======================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check 1: Environment Variables
echo "1️⃣ Checking Environment Variables..."
echo "-----------------------------------"

if [ -f .env ]; then
  echo "✅ .env file exists"

  # Check ONRAMP_APP_ID
  if grep -q "ONRAMP_APP_ID=" .env; then
    APP_ID=$(grep "ONRAMP_APP_ID=" .env | cut -d '=' -f2)
    if [ -z "$APP_ID" ]; then
      echo -e "${RED}❌ ONRAMP_APP_ID is empty${NC}"
    elif [ "$APP_ID" = "2" ]; then
      echo -e "${YELLOW}⚠️  ONRAMP_APP_ID is set to sandbox (2)${NC}"
    else
      echo -e "${GREEN}✅ ONRAMP_APP_ID is set: $APP_ID${NC}"
    fi
  else
    echo -e "${RED}❌ ONRAMP_APP_ID not found in .env${NC}"
  fi

  # Check ONRAMP_BASE_URL
  if grep -q "ONRAMP_BASE_URL=" .env; then
    BASE_URL=$(grep "ONRAMP_BASE_URL=" .env | cut -d '=' -f2)
    if [[ "$BASE_URL" == *"?"* ]] || [[ "$BASE_URL" == *"&"* ]]; then
      echo -e "${RED}❌ ONRAMP_BASE_URL contains query parameters (WRONG!)${NC}"
      echo "   Current: $BASE_URL"
      echo "   Should be: https://onramp.money"
    elif [ "$BASE_URL" = "https://onramp.money" ]; then
      echo -e "${GREEN}✅ ONRAMP_BASE_URL is correct${NC}"
    else
      echo -e "${YELLOW}⚠️  ONRAMP_BASE_URL: $BASE_URL${NC}"
    fi
  else
    echo -e "${RED}❌ ONRAMP_BASE_URL not found in .env${NC}"
  fi

  # Check ONRAMP_API_KEY
  if grep -q "ONRAMP_API_KEY=" .env; then
    API_KEY=$(grep "ONRAMP_API_KEY=" .env | cut -d '=' -f2)
    if [ -z "$API_KEY" ]; then
      echo -e "${RED}❌ ONRAMP_API_KEY is empty${NC}"
    else
      echo -e "${GREEN}✅ ONRAMP_API_KEY is set: ${API_KEY:0:10}...${NC}"
    fi
  else
    echo -e "${RED}❌ ONRAMP_API_KEY not found in .env${NC}"
  fi

else
  echo -e "${RED}❌ .env file not found${NC}"
fi

echo ""

# Check 2: Backend Server
echo "2️⃣ Checking Backend Server..."
echo "----------------------------"

BACKEND_PORTS=(3000 3001 5001 8080)
BACKEND_RUNNING=false

for PORT in "${BACKEND_PORTS[@]}"; do
  if curl -s --max-time 2 http://localhost:$PORT > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend server running on port $PORT${NC}"
    BACKEND_PORT=$PORT
    BACKEND_RUNNING=true
    break
  fi
done

if [ "$BACKEND_RUNNING" = false ]; then
  echo -e "${RED}❌ Backend server not running on common ports${NC}"
  echo "   Tried ports: ${BACKEND_PORTS[@]}"
  echo "   Start your backend with: npm run dev"
fi

echo ""

# Check 3: Database Connection
echo "3️⃣ Checking Database..."
echo "----------------------"

if [ -f "server/db.ts" ] || [ -f "server/db/index.ts" ]; then
  echo "✅ Database module found"

  # Check if PostgreSQL is running
  if command -v psql &> /dev/null; then
    if psql -U postgres -lqt | cut -d \| -f 1 | grep -qw nebu; then
      echo -e "${GREEN}✅ Database 'nebu' exists${NC}"
    else
      echo -e "${YELLOW}⚠️  Database 'nebu' not found${NC}"
    fi
  else
    echo -e "${YELLOW}⚠️  psql not in PATH, skipping database check${NC}"
  fi
else
  echo -e "${YELLOW}⚠️  Database module not found at expected location${NC}"
fi

echo ""

# Check 4: OnRamp Money Table
echo "4️⃣ Checking OnRamp Money Orders Table..."
echo "----------------------------------------"

if [ -f "migrations/004_add_onramp_money_orders_table.sql" ]; then
  echo "✅ Migration file exists"
else
  echo -e "${RED}❌ Migration file not found${NC}"
fi

echo ""

# Check 5: Ngrok Status
echo "5️⃣ Checking Ngrok Tunnel..."
echo "-------------------------"

if curl -s http://localhost:4040/api/tunnels > /dev/null 2>&1; then
  NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | python3 -c "import sys, json; print(json.load(sys.stdin)['tunnels'][0]['public_url'] if json.load(sys.stdin).get('tunnels') else 'N/A')" 2>/dev/null)

  if [ ! -z "$NGROK_URL" ] && [ "$NGROK_URL" != "N/A" ]; then
    echo -e "${GREEN}✅ Ngrok tunnel active${NC}"
    echo "   Public URL: $NGROK_URL"
    echo "   Webhook URL: $NGROK_URL/api/onramp-money/webhook"
    echo ""
    echo -e "${YELLOW}📋 Configure this webhook URL in OnRamp Money dashboard:${NC}"
    echo "   https://dashboard.onramp.money > Settings > Webhook"
  else
    echo -e "${YELLOW}⚠️  Ngrok running but no tunnels found${NC}"
  fi
else
  echo -e "${RED}❌ Ngrok not running${NC}"
  echo "   Start ngrok with: ngrok http $BACKEND_PORT"
  echo "   Or run: ./scripts/setup-local-webhook.sh"
fi

echo ""

# Check 6: Authentication Endpoints
echo "6️⃣ Checking Authentication..."
echo "----------------------------"

if [ "$BACKEND_RUNNING" = true ]; then
  # Test if auth routes exist
  if curl -s -X POST http://localhost:$BACKEND_PORT/api/onramp-money/create-order 2>&1 | grep -q "401\|Authentication"; then
    echo -e "${YELLOW}⚠️  Authentication required (expected for unauthenticated request)${NC}"
    echo ""
    echo -e "${YELLOW}🔐 TO FIX THE 401 ERROR:${NC}"
    echo "   1. Open your app: http://localhost:5000"
    echo "   2. Click 'Connect Wallet' button"
    echo "   3. Connect with MetaMask or your wallet"
    echo "   4. Verify you see 'Wallet Connected' status"
    echo "   5. Then try creating an OnRamp Money order"
  else
    echo "✅ OnRamp Money routes accessible"
  fi
else
  echo -e "${YELLOW}⚠️  Cannot check (backend not running)${NC}"
fi

echo ""

# Summary
echo "======================================"
echo "📊 Summary & Next Steps"
echo "======================================"
echo ""

if grep -q "ONRAMP_BASE_URL=.*?" .env 2>/dev/null; then
  echo -e "${RED}🔴 CRITICAL: Fix ONRAMP_BASE_URL in .env file${NC}"
  echo "   Current: $(grep ONRAMP_BASE_URL .env | cut -d '=' -f2)"
  echo "   Change to: ONRAMP_BASE_URL=https://onramp.money"
  echo ""
fi

if [ "$BACKEND_RUNNING" = false ]; then
  echo -e "${RED}🔴 Start your backend server:${NC}"
  echo "   npm run dev"
  echo ""
fi

if ! curl -s http://localhost:4040/api/tunnels > /dev/null 2>&1; then
  echo -e "${YELLOW}🟡 Start ngrok for webhook testing:${NC}"
  echo "   ./scripts/setup-local-webhook.sh"
  echo "   OR: ngrok http 3000"
  echo ""
fi

echo -e "${GREEN}📚 For complete guide, see:${NC}"
echo "   docs/ONRAMP_LOCAL_TESTING_GUIDE.md"
echo ""

echo -e "${GREEN}🎯 Quick test order:${NC}"
echo "   1. Connect wallet at http://localhost:5000"
echo "   2. Go to FX Swap > OnRamp Money tab"
echo "   3. Fill form and click 'Proceed to Payment'"
echo ""
