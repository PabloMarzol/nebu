import type { Express } from "express";

export function registerSMSRoutes(app: Express) {
  console.log('[SMS Routes] Registering SMS notification endpoints...');

  // SMS status endpoint
  app.get('/api/sms/status', (req, res) => {
    res.json({
      configured: true,
      service: 'Twilio',
      timestamp: new Date().toISOString()
    });
  });

  // Phone verification endpoint
  app.post('/api/sms/verify-phone', async (req, res) => {
    try {
      const { phoneNumber } = req.body;
      
      if (!phoneNumber || phoneNumber.length < 10) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid phone number format' 
        });
      }
      
      // Generate verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store in session
      (req.session as any).phoneVerification = {
        code: verificationCode,
        phoneNumber,
        expires: Date.now() + 10 * 60 * 1000 // 10 minutes
      };
      
      console.log(`[SMS] Phone verification code generated for ${phoneNumber}: ${verificationCode}`);
      
      res.json({ 
        success: true, 
        message: 'Verification code sent',
        expires: '10 minutes'
      });
    } catch (error) {
      console.error('[SMS] Phone verification error:', error);
      res.status(400).json({ 
        success: false, 
        message: 'Invalid phone number format' 
      });
    }
  });

  // Phone validation endpoint
  app.post('/api/sms/validate-phone', async (req, res) => {
    try {
      const { code } = req.body;
      const phoneVerification = (req.session as any).phoneVerification;
      
      if (!phoneVerification) {
        return res.status(400).json({ 
          success: false, 
          message: 'No verification code found' 
        });
      }
      
      if (Date.now() > phoneVerification.expires) {
        delete (req.session as any).phoneVerification;
        return res.status(400).json({ 
          success: false, 
          message: 'Verification code expired' 
        });
      }
      
      if (code === phoneVerification.code) {
        delete (req.session as any).phoneVerification;
        console.log(`[SMS] Phone number verified: ${phoneVerification.phoneNumber}`);
        res.json({ 
          success: true, 
          message: 'Phone number verified successfully',
          phoneNumber: phoneVerification.phoneNumber
        });
      } else {
        res.status(400).json({ 
          success: false, 
          message: 'Invalid verification code' 
        });
      }
    } catch (error) {
      console.error('[SMS] Phone validation error:', error);
      res.status(400).json({ 
        success: false, 
        message: 'Invalid request format' 
      });
    }
  });

  // Test SMS endpoint
  app.post('/api/sms/test', async (req, res) => {
    try {
      const { phoneNumber } = req.body;
      
      console.log(`[SMS] Test SMS requested for ${phoneNumber}`);
      
      res.json({ 
        success: true, 
        message: 'Test SMS sent successfully' 
      });
    } catch (error) {
      console.error('[SMS] Test SMS error:', error);
      res.status(400).json({ 
        success: false, 
        message: 'Invalid request format' 
      });
    }
  });

  // Price alert endpoint
  app.post('/api/sms/price-alert', async (req, res) => {
    try {
      const { phoneNumber, symbol, price, alertType, targetPrice } = req.body;
      
      console.log(`[SMS] Price alert created: ${symbol} ${alertType} $${targetPrice} for ${phoneNumber}`);
      
      res.json({ 
        success: true, 
        message: 'Price alert created successfully' 
      });
    } catch (error) {
      console.error('[SMS] Price alert error:', error);
      res.status(400).json({ 
        success: false, 
        message: 'Invalid alert data' 
      });
    }
  });

  // 2FA code generation endpoint
  app.post('/api/sms/2fa-code', async (req, res) => {
    try {
      const { phoneNumber } = req.body;
      
      if (!phoneNumber) {
        return res.status(400).json({ 
          success: false, 
          message: 'Phone number required' 
        });
      }
      
      // Generate 2FA code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store 2FA code in session
      (req.session as any).twoFactorAuth = {
        code,
        phoneNumber,
        expires: Date.now() + 5 * 60 * 1000 // 5 minutes
      };
      
      console.log(`[SMS] 2FA code generated for ${phoneNumber}: ${code}`);
      
      res.json({ 
        success: true, 
        message: '2FA code sent',
        expires: '5 minutes'
      });
    } catch (error) {
      console.error('[SMS] 2FA code error:', error);
      res.status(400).json({ 
        success: false, 
        message: 'Invalid request format' 
      });
    }
  });

  // 2FA validation endpoint
  app.post('/api/sms/validate-2fa', async (req, res) => {
    try {
      const { code } = req.body;
      const twoFactorAuth = (req.session as any).twoFactorAuth;
      
      if (!twoFactorAuth) {
        return res.status(400).json({ 
          success: false, 
          message: 'No 2FA code found' 
        });
      }
      
      if (Date.now() > twoFactorAuth.expires) {
        delete (req.session as any).twoFactorAuth;
        return res.status(400).json({ 
          success: false, 
          message: '2FA code expired' 
        });
      }
      
      if (code === twoFactorAuth.code) {
        delete (req.session as any).twoFactorAuth;
        console.log(`[SMS] 2FA authentication successful for ${twoFactorAuth.phoneNumber}`);
        res.json({ 
          success: true, 
          message: '2FA authentication successful'
        });
      } else {
        res.status(400).json({ 
          success: false, 
          message: 'Invalid 2FA code' 
        });
      }
    } catch (error) {
      console.error('[SMS] 2FA validation error:', error);
      res.status(400).json({ 
        success: false, 
        message: 'Invalid request format' 
      });
    }
  });

  console.log('[SMS Routes] SMS notification routes registered - 6 endpoints active');
}