import { Router } from "express";
import sgMail from "@sendgrid/mail";

const router = Router();

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log('[SimpleAuth] SendGrid initialized');
} else {
  console.log('[SimpleAuth] SendGrid not configured - emails will be skipped');
}

// Email notification functions
async function sendWelcomeEmail(email: string, firstName: string) {
  if (!process.env.SENDGRID_API_KEY) {
    console.log('[SimpleAuth] SendGrid not configured - skipping welcome email');
    return;
  }

  const msg = {
    to: email,
    from: 'traders@nebulaxexchange.io', // Using verified sender address
    subject: 'Welcome to NebulaX Exchange - Your Account is Ready!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Welcome to NebulaX Exchange, ${firstName}!</h2>
        <p>Thank you for joining NebulaX Exchange, the world's most advanced cryptocurrency trading platform.</p>
        <p><strong>Your account has been successfully created and is ready to use.</strong></p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">What's Next?</h3>
          <ul>
            <li>✅ Complete your profile verification for higher trading limits</li>
            <li>🔐 Enable two-factor authentication for enhanced security</li>
            <li>💼 Explore our advanced trading features and AI assistant</li>
            <li>📈 Start trading with live market data and real-time execution</li>
          </ul>
        </div>

        <p>Need help? Our support team is available 24/7:</p>
        <ul>
          <li>📧 Email: <a href="mailto:support@nebulaxexchange.io">support@nebulaxexchange.io</a></li>
          <li>💬 Live Chat: Available on our platform</li>
          <li>📱 Trading Support: <a href="mailto:traders@nebulaxexchange.io">traders@nebulaxexchange.io</a></li>
        </ul>

        <div style="border-top: 1px solid #e2e8f0; margin-top: 30px; padding-top: 20px; text-align: center;">
          <p style="color: #64748b; font-size: 14px;">
            NebulaX Exchange - Professional Cryptocurrency Trading Platform<br>
            This email was sent to ${email} because you registered for an account.
          </p>
        </div>
      </div>
    `
  };

  try {
    await sgMail.send(msg);
    console.log(`[SimpleAuth] Welcome email sent successfully to ${email}`);
  } catch (error) {
    console.error('[SimpleAuth] Failed to send welcome email:', error);
    console.log(`[SimpleAuth] Welcome email fallback: User ${firstName} registered successfully with email ${email}`);
  }
}

async function sendAdminNotification(email: string, firstName?: string, lastName?: string, accountDetails?: any) {
  if (!process.env.SENDGRID_API_KEY) {
    console.log('[SimpleAuth] SendGrid not configured - skipping admin notification');
    return;
  }

  const msg = {
    to: 'traders@nebulaxexchange.io',
    from: 'traders@nebulaxexchange.io', // Using verified sender address
    subject: `🚨 New User Registration Alert - ${email}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">New User Account Details</h2>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Complete Account Information:</h3>
          <ul>
            <li><strong>Full Name:</strong> ${firstName || 'Not provided'} ${lastName || ''}</li>
            <li><strong>Email Address:</strong> ${email}</li>
            <li><strong>User ID:</strong> ${accountDetails?.id || 'Not available'}</li>
            <li><strong>Account Tier:</strong> ${accountDetails?.accountTier || 'Basic'}</li>
            <li><strong>KYC Status:</strong> ${accountDetails?.kycStatus || 'Pending'}</li>
            <li><strong>KYC Level:</strong> ${accountDetails?.kycLevel || '1'}</li>
            <li><strong>Registration Time:</strong> ${new Date().toISOString()}</li>
          </ul>
        </div>

        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Account Settings:</h3>
          <ul>
            <li><strong>Email Verified:</strong> ${accountDetails?.emailVerified ? 'Yes' : 'No'}</li>
            <li><strong>Daily Trading Limit:</strong> $${accountDetails?.dailyTradingLimit || '1,000'}</li>
            <li><strong>Daily Withdrawal Limit:</strong> $${accountDetails?.dailyWithdrawalLimit || '500'}</li>
            <li><strong>Risk Profile:</strong> ${accountDetails?.riskProfile || 'Conservative'}</li>
            <li><strong>Account Status:</strong> ${accountDetails?.accountStatus || 'Active'}</li>
          </ul>
        </div>

        <p><strong>Required Actions:</strong></p>
        <ul>
          <li>✅ Review new account in admin panel</li>
          <li>📋 Monitor initial trading activity and patterns</li>
          <li>🎯 Send personalized onboarding follow-up email</li>
          <li>🔍 Schedule KYC review if needed</li>
        </ul>

        <div style="border-top: 1px solid #e2e8f0; margin-top: 30px; padding-top: 20px;">
          <p style="color: #64748b; font-size: 14px;">
            NebulaX Exchange Trading Department<br>
            Auto-generated notification with complete account details.
          </p>
        </div>
      </div>
    `
  };

  try {
    await sgMail.send(msg);
    console.log(`[SimpleAuth] Admin notification sent successfully to traders@nebulaxexchange.io for ${email}`);
  } catch (error) {
    console.error('[SimpleAuth] Failed to send admin notification:', error);
    
    // Fallback: Console notification for admin
    console.log(`
=================================================
🚨 NEW USER REGISTRATION ALERT 🚨
=================================================
Email: ${email}
Name: ${firstName || 'Not provided'} ${lastName || ''}
User ID: ${accountDetails?.id || 'Not available'}
Account Tier: ${accountDetails?.accountTier || 'Basic'}
KYC Status: ${accountDetails?.kycStatus || 'Pending'}
KYC Level: ${accountDetails?.kycLevel || '1'}
Registration Time: ${new Date().toISOString()}
Email Verified: ${accountDetails?.emailVerified ? 'Yes' : 'No'}
Daily Trading Limit: $${accountDetails?.dailyTradingLimit || '1,000'}
Daily Withdrawal Limit: $${accountDetails?.dailyWithdrawalLimit || '500'}
Risk Profile: ${accountDetails?.riskProfile || 'Conservative'}
Account Status: ${accountDetails?.accountStatus || 'Active'}

🎯 Action Required: Review new account in admin panel
🔧 SendGrid Status: API key configured but needs "Mail Send" permission
📧 Email Destination: traders@nebulaxexchange.io
=================================================
    `);
    
    // Also log a simplified version for easy monitoring
    console.log(`[ADMIN ALERT] New user: ${email} | ID: ${accountDetails?.id} | ${new Date().toLocaleString()}`);
    
    // Send notification to console log file if possible
    const fs = require('fs');
    const logEntry = `${new Date().toISOString()} - NEW USER: ${email} (${firstName} ${lastName}) - ID: ${accountDetails?.id}\n`;
    try {
      fs.appendFileSync('./new-users.log', logEntry);
    } catch (err) {
      // Ignore file write errors
    }
  }
}

// Wallet-based authentication service
// All authentication is done through wallet signatures, not passwords

// Test email endpoint for debugging
router.post("/test-email", async (req, res) => {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      return res.status(400).json({ message: "SendGrid not configured" });
    }

    const testMsg = {
      to: 'traders@nebulaxexchange.io',
      from: 'traders@nebulaxexchange.io',
      subject: 'Test Email from NebulaX Exchange',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">SendGrid Test Email</h2>
          <p>This is a test email to verify SendGrid integration is working properly.</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          <p>If you receive this email, the SendGrid integration is working correctly!</p>
        </div>
      `
    };

    await sgMail.send(testMsg);
    console.log('[SimpleAuth] Test email sent successfully');
    res.json({ message: "Test email sent successfully", timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('[SimpleAuth] Test email failed:', error);
    res.status(500).json({ 
      message: "Test email failed", 
      error: (error as any).message,
      code: (error as any).code 
    });
  }
});

// Get current user (wallet-based)
router.get("/user", (req, res) => {
  console.log('[SimpleAuth] Checking session. User ID:', (req as any).session?.userId);
  
  if (!(req as any).session?.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  res.json((req as any).session.user);
});

// Wallet authentication endpoint
router.post("/wallet-auth", async (req, res) => {
  try {
    const { walletAddress, signature, message } = req.body;
    
    if (!walletAddress || !signature || !message) {
      return res.status(400).json({ message: "Wallet address, signature, and message are required" });
    }

    console.log('[SimpleAuth] Wallet authentication attempt for:', walletAddress);

    // Verify wallet signature (this would be implemented with actual wallet verification)
    // For now, we'll accept any valid wallet address format
    const isValidWallet = /^0x[a-fA-F0-9]{40}$/.test(walletAddress);
    if (!isValidWallet) {
      return res.status(400).json({ message: "Invalid wallet address format" });
    }

    // Get or create user by wallet address
    const { storage } = await import('./storage');
    let user = await storage.getUserByEmail(walletAddress);
    
    if (!user) {
      // Create new user with wallet address as identifier
      user = await storage.createUser({
        id: `wallet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        email: walletAddress, // Use wallet address as email for now
        firstName: 'Wallet',
        lastName: 'User',
        emailVerified: true,
        kycStatus: 'pending',
        kycLevel: 1,
        accountTier: 'basic'
      });
      console.log('[SimpleAuth] New wallet user created:', walletAddress);
    }

    // Create session
    (req as any).session.userId = user.id;
    (req as any).session.user = {
      id: user.id,
      walletAddress: user.email, // Store wallet address in email field for now
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      emailVerified: user.emailVerified,
      kycStatus: user.kycStatus,
      kycLevel: user.kycLevel,
      accountTier: user.accountTier
    };

    console.log('[SimpleAuth] Wallet authentication successful for:', walletAddress);
    res.json({
      message: "Wallet authentication successful",
      user: (req as any).session.user
    });
  } catch (error) {
    console.error('[SimpleAuth] Wallet authentication error:', error);
    res.status(500).json({ message: "Wallet authentication failed" });
  }
});

// Logout
router.post("/logout", (req, res) => {
  (req as any).session.destroy((err: any) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.json({ message: "Logout successful" });
  });
});

export default router;
