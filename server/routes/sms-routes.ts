import type { Express } from "express";
import { z } from "zod";
import { smsService } from "../services/sms-service";
import { verifyWalletAuth } from "../middleware/walletAuth";

// SMS API route schemas
const PhoneVerificationSchema = z.object({
  phoneNumber: z.string().min(10).max(15)
});

const PriceAlertSchema = z.object({
  phoneNumber: z.string(),
  symbol: z.string(),
  price: z.number(),
  alertType: z.enum(['above', 'below']),
  targetPrice: z.number()
});

const TradeNotificationSchema = z.object({
  phoneNumber: z.string(),
  tradeType: z.enum(['buy', 'sell']),
  symbol: z.string(),
  amount: z.number(),
  price: z.number()
});

const TwoFactorSchema = z.object({
  phoneNumber: z.string()
});

const SecurityAlertSchema = z.object({
  phoneNumber: z.string(),
  alertType: z.string(),
  details: z.string().optional()
});

export function registerSMSRoutes(app: Express) {
  // Check SMS service status
  app.get('/api/sms/status', (req, res) => {
    res.json({
      configured: smsService.isServiceConfigured(),
      service: 'Twilio'
    });
  });

  // Send phone verification code
  app.post('/api/sms/verify-phone', verifyWalletAuth, async (req, res) => {
    try {
      const { phoneNumber } = PhoneVerificationSchema.parse(req.body);
      
      const verificationCode = await smsService.sendPhoneVerification(phoneNumber);
      
      if (verificationCode) {
        // Store verification code in session for validation
        (req.session as any).phoneVerification = {
          code: verificationCode,
          phoneNumber,
          expires: Date.now() + 10 * 60 * 1000 // 10 minutes
        };
        
        res.json({ 
          success: true, 
          message: 'Verification code sent',
          expires: '10 minutes'
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: 'Failed to send verification code' 
        });
      }
    } catch (error) {
      console.error('Phone verification error:', error);
      res.status(400).json({ 
        success: false, 
        message: 'Invalid phone number format' 
      });
    }
  });

  // Validate phone verification code
  app.post('/api/sms/validate-phone', verifyWalletAuth, async (req, res) => {
    try {
      const { code } = z.object({ code: z.string() }).parse(req.body);
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
      res.status(400).json({ 
        success: false, 
        message: 'Invalid request format' 
      });
    }
  });

  // Send 2FA code
  app.post('/api/sms/2fa-code', verifyWalletAuth, async (req, res) => {
    try {
      const { phoneNumber } = TwoFactorSchema.parse(req.body);
      
      const code = await smsService.send2FACode(phoneNumber);
      
      if (code) {
        // Store 2FA code in session
        (req.session as any).twoFactorAuth = {
          code,
          phoneNumber,
          expires: Date.now() + 5 * 60 * 1000 // 5 minutes
        };
        
        res.json({ 
          success: true, 
          message: '2FA code sent',
          expires: '5 minutes'
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: 'Failed to send 2FA code' 
        });
      }
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: 'Invalid request format' 
      });
    }
  });

  // Validate 2FA code
  app.post('/api/sms/validate-2fa', verifyWalletAuth, async (req, res) => {
    try {
      const { code } = z.object({ code: z.string() }).parse(req.body);
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
      res.status(400).json({ 
        success: false, 
        message: 'Invalid request format' 
      });
    }
  });

  // Send price alert
  app.post('/api/sms/price-alert', verifyWalletAuth, async (req, res) => {
    try {
      const alertData = PriceAlertSchema.parse(req.body);
      
      const success = await smsService.sendPriceAlert(
        alertData.phoneNumber,
        alertData.symbol,
        alertData.price,
        alertData.alertType,
        alertData.targetPrice
      );
      
      if (success) {
        res.json({ 
          success: true, 
          message: 'Price alert sent successfully' 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: 'Failed to send price alert' 
        });
      }
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: 'Invalid alert data' 
      });
    }
  });

  // Send trade notification
  app.post('/api/sms/trade-notification', verifyWalletAuth, async (req, res) => {
    try {
      const tradeData = TradeNotificationSchema.parse(req.body);
      
      const success = await smsService.sendTradeNotification(
        tradeData.phoneNumber,
        tradeData.tradeType,
        tradeData.symbol,
        tradeData.amount,
        tradeData.price
      );
      
      if (success) {
        res.json({ 
          success: true, 
          message: 'Trade notification sent successfully' 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: 'Failed to send trade notification' 
        });
      }
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: 'Invalid trade data' 
      });
    }
  });

  // Send security alert
  app.post('/api/sms/security-alert', verifyWalletAuth, async (req, res) => {
    try {
      const alertData = SecurityAlertSchema.parse(req.body);
      
      const success = await smsService.sendSecurityAlert(
        alertData.phoneNumber,
        alertData.alertType,
        alertData.details
      );
      
      if (success) {
        res.json({ 
          success: true, 
          message: 'Security alert sent successfully' 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: 'Failed to send security alert' 
        });
      }
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: 'Invalid alert data' 
      });
    }
  });

  // Test SMS functionality
  app.post('/api/sms/test', verifyWalletAuth, async (req, res) => {
    try {
      const { phoneNumber, message } = z.object({
        phoneNumber: z.string(),
        message: z.string().optional().default('NebulaX SMS Test: Your SMS notifications are working correctly!')
      }).parse(req.body);
      
      const success = await smsService.sendSMS({
        to: phoneNumber,
        message,
        type: 'general'
      });
      
      if (success) {
        res.json({ 
          success: true, 
          message: 'Test SMS sent successfully' 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: 'Failed to send test SMS' 
        });
      }
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: 'Invalid request format' 
      });
    }
  });

  console.log('[SMS Routes] SMS notification routes registered');
}