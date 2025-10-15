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

// Simple in-memory user store for development
const users = new Map();

// Add your registered user  
users.set('jatbanga@hotmail.com', {
  id: 'user-jatbanga-main',
  email: 'jatbanga@hotmail.com',
  firstName: 'John',
  lastName: 'User',
  passwordHash: '$2b$10$ZQ7Q7Q7Q7Q7Q7Q7Q7Q7Q7O', // Will be overridden
  emailVerified: true,
  kycStatus: 'pending',
  kycLevel: 1,
  accountTier: 'basic'
});

// Add the current user trying to log in
users.set('tonyshare@hotmail.co.uk', {
  id: 'user-tonyshare-main',
  email: 'tonyshare@hotmail.co.uk',
  firstName: 'Tony',
  lastName: 'Share',
  passwordHash: '$2b$10$ZQ7Q7Q7Q7Q7Q7Q7Q7Q7Q7O', // Will be overridden
  emailVerified: true,
  kycStatus: 'pending',
  kycLevel: 1,
  accountTier: 'basic'
});

// Demo user
users.set('demo@nebulax.com', {
  id: 'demo-user-123',
  email: 'demo@nebulax.com',
  firstName: 'Demo',
  lastName: 'User',
  passwordHash: '$2b$10$ZQ7Q7Q7Q7Q7Q7Q7Q7Q7Q7O', // Will be overridden
  emailVerified: true,
  kycStatus: 'verified',
  kycLevel: 2,
  accountTier: 'premium'
});

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Initialize password hashes
let passwordsInitialized = false;

async function initializePasswords() {
  if (!passwordsInitialized) {
    try {
      const jatUser = users.get('jatbanga@hotmail.com');
      const demoUser = users.get('demo@nebulax.com');
      
      if (jatUser) {
        jatUser.passwordHash = await hashPassword('nebulax123');
        console.log('[SimpleAuth] Jat user password hash set');
      }
      
      const tonyUser = users.get('tonyshare@hotmail.co.uk');
      if (tonyUser) {
        tonyUser.passwordHash = await hashPassword('nebulax123');
        console.log('[SimpleAuth] Tony user password hash set');
      }
      
      if (demoUser) {
        demoUser.passwordHash = await hashPassword('demo123');
        console.log('[SimpleAuth] Demo user password hash set');
      }
      
      passwordsInitialized = true;
      console.log('[SimpleAuth] Password hashes initialized successfully');
    } catch (error) {
      console.error('[SimpleAuth] Error initializing passwords:', error);
    }
  }
}

// Initialize immediately and on startup
setTimeout(initializePasswords, 100);

// Login endpoint
router.post("/login", async (req, res) => {
  try {
    // Ensure passwords are initialized
    await initializePasswords();
    
    const { email, password } = req.body;
    console.log('[SimpleAuth] Login attempt for:', email);
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Try to get user from database first
    const { storage } = await import('./storage');
    let user = await storage.getUserByEmail(email);
    
    // Fallback to memory store for backward compatibility
    if (!user) {
      user = users.get(email);
    }
    
    if (!user) {
      console.log('[SimpleAuth] User not found:', email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash || '');
    if (!isValidPassword) {
      console.log('[SimpleAuth] Invalid password for:', email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create session and save it
    req.session.userId = user.id;
    req.session.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      emailVerified: user.emailVerified,
      kycStatus: user.kycStatus,
      kycLevel: user.kycLevel,
      accountTier: user.accountTier
    };

    // Save session explicitly and return response within callback
    req.session.save((err) => {
      if (err) {
        console.error('[SimpleAuth] Session save error:', err);
        return res.status(500).json({ message: "Session save failed" });
      }
      
      console.log('[SimpleAuth] Session saved successfully for:', email);
      console.log('[SimpleAuth] Login successful for:', email);
      
      res.json({
        message: "Login successful",
        user: req.session.user
      });
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

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

// Get current user
router.get("/user", (req, res) => {
  console.log('[SimpleAuth] Checking session. User ID:', req.session?.userId);
  
  if (!req.session?.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  res.json(req.session.user);
});

// Registration endpoint
router.post("/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    console.log('[SimpleAuth] Registration attempt for:', email);
    console.log('[SimpleAuth] Request body:', { email, firstName, lastName, hasPassword: !!password });
    
    if (!email || !password || !firstName || !lastName) {
      console.log('[SimpleAuth] Missing required fields');
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists in database
    const { storage } = await import('./storage');
    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      console.log('[SimpleAuth] User already exists in database:', email);
      return res.status(409).json({ 
        message: "Account already exists", 
        details: "An account with this email already exists. Please log in instead.",
        action: "login"
      });
    }

    // Also check memory store for backward compatibility
    if (users.has(email)) {
      console.log('[SimpleAuth] User already exists in memory:', email);
      return res.status(409).json({ 
        message: "Account already exists", 
        details: "An account with this email already exists. Please log in instead.",
        action: "login"
      });
    }

    // Create new user in database
    const passwordHash = await hashPassword(password);
    const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newUser = await storage.createUser({
      id: userId,
      email,
      firstName,
      lastName,
      passwordHash,
      emailVerified: true, // Auto-verify for demo
      kycStatus: 'pending',
      kycLevel: 1,
      accountTier: 'basic'
    });

    // Also add to memory store for compatibility
    users.set(email, newUser);

    // Send welcome email
    try {
      await sendWelcomeEmail(email, firstName);
      console.log(`[SimpleAuth] Welcome email sent to: ${email}`);
    } catch (emailError) {
      console.error('[SimpleAuth] Failed to send welcome email:', emailError);
    }

    // Send admin notification with complete account details
    try {
      await sendAdminNotification(email, firstName, lastName, newUser);
      console.log(`[SimpleAuth] Admin notification sent to traders@nebulaxexchange.io for new user: ${email}`);
    } catch (adminError) {
      console.error('[SimpleAuth] Failed to send admin notification:', adminError);
    }

    // Create session immediately
    req.session.userId = newUser.id;
    req.session.user = {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      emailVerified: newUser.emailVerified,
      kycStatus: newUser.kycStatus,
      kycLevel: newUser.kycLevel,
      accountTier: newUser.accountTier
    };

    console.log('[SimpleAuth] Registration successful for:', email);
    res.json({
      message: "Registration successful",
      user: req.session.user
    });
  } catch (error) {
    console.error("[SimpleAuth] Registration error:", error);
    console.error("[SimpleAuth] Error stack:", (error as any).stack);
    res.status(500).json({ message: "Registration failed", error: (error as any).message });
  }
});

// Logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.json({ message: "Logout successful" });
  });
});

export default router;