#!/bin/bash

# ============================================
# Local Webhook Setup with Ngrok
# ============================================
# This script helps you set up ngrok for local webhook testing

echo "🚀 OnRamp Money Local Webhook Setup"
echo "===================================="
echo ""

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null
then
    echo "❌ Ngrok is not installed!"
    echo ""
    echo "Please install ngrok:"
    echo "  1. Visit: https://ngrok.com/download"
    echo "  2. Or use: npm install -g ngrok"
    echo "  3. Sign up for free account: https://dashboard.ngrok.com/signup"
    echo "  4. Get your auth token from: https://dashboard.ngrok.com/get-started/your-authtoken"
    echo "  5. Run: ngrok authtoken YOUR_AUTH_TOKEN"
    echo ""
    exit 1
fi

echo "✅ Ngrok is installed"
echo ""

# Get the port your server is running on
read -p "Enter your backend server port (default: 3000): " PORT
PORT=${PORT:-3000}

echo ""
echo "🔧 Starting ngrok tunnel on port $PORT..."
echo ""
echo "📋 Instructions:"
echo "  1. Ngrok will create a public HTTPS URL"
echo "  2. Copy the HTTPS URL (looks like: https://abc123.ngrok.io)"
echo "  3. Go to OnRamp Money dashboard: https://dashboard.onramp.money"
echo "  4. Navigate to: Settings > Webhook Configuration"
echo "  5. Set webhook URL to: https://YOUR_NGROK_URL/api/onramp-money/webhook"
echo "  6. Save the configuration"
echo ""
echo "🚨 IMPORTANT:"
echo "  - Keep this terminal window open while testing"
echo "  - Ngrok free tier URLs change each restart"
echo "  - Update OnRamp dashboard webhook URL if ngrok restarts"
echo ""

# Start ngrok
ngrok http $PORT

# Note: This will keep running until you press Ctrl+C
