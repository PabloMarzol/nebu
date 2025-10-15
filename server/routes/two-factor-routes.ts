import { Router } from 'express';
import { TwoFactorService } from '../services/two-factor-service';

const router = Router();

/**
 * Generate 2FA setup (secret and QR code)
 */
router.post('/generate', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Generate secret
    const secretData = TwoFactorService.generateSecret(email);
    
    // Generate QR code
    const qrCodeDataURL = await TwoFactorService.generateQRCode(secretData.otpauthUrl || secretData.secret);

    res.json({
      success: true,
      data: {
        secret: secretData.secret,
        qrCode: qrCodeDataURL,
        manualEntryKey: secretData.secret
      }
    });
  } catch (error) {
    console.error('Error generating 2FA secret:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate 2FA setup'
    });
  }
});

/**
 * Enable 2FA for user
 */
router.post('/enable', async (req, res) => {
  try {
    const { userId, secret, token } = req.body;

    if (!userId || !secret || !token) {
      return res.status(400).json({
        success: false,
        message: 'User ID, secret, and token are required'
      });
    }

    const enabled = await TwoFactorService.enable2FA(userId, secret, token);

    if (enabled) {
      res.json({
        success: true,
        message: '2FA enabled successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid token. Please check your authenticator app and try again.'
      });
    }
  } catch (error) {
    console.error('Error enabling 2FA:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to enable 2FA'
    });
  }
});

/**
 * Disable 2FA for user
 */
router.post('/disable', async (req, res) => {
  try {
    const { userId, token } = req.body;

    if (!userId || !token) {
      return res.status(400).json({
        success: false,
        message: 'User ID and token are required'
      });
    }

    // Verify current token before disabling
    const isValid = await TwoFactorService.verify2FALogin(userId, token);
    
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid token. Cannot disable 2FA.'
      });
    }

    const disabled = await TwoFactorService.disable2FA(userId);

    if (disabled) {
      res.json({
        success: true,
        message: '2FA disabled successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to disable 2FA'
      });
    }
  } catch (error) {
    console.error('Error disabling 2FA:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to disable 2FA'
    });
  }
});

/**
 * Verify 2FA token
 */
router.post('/verify', async (req, res) => {
  try {
    const { userId, token } = req.body;

    if (!userId || !token) {
      return res.status(400).json({
        success: false,
        message: 'User ID and token are required'
      });
    }

    const isValid = await TwoFactorService.verify2FALogin(userId, token);

    res.json({
      success: true,
      valid: isValid
    });
  } catch (error) {
    console.error('Error verifying 2FA token:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify token'
    });
  }
});

/**
 * Get 2FA status for user
 */
router.get('/status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const status = await TwoFactorService.get2FAStatus(userId);

    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('Error getting 2FA status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get 2FA status'
    });
  }
});

/**
 * Regenerate backup codes
 */
router.post('/backup-codes/regenerate', async (req, res) => {
  try {
    const { userId, token } = req.body;

    if (!userId || !token) {
      return res.status(400).json({
        success: false,
        message: 'User ID and token are required'
      });
    }

    // Verify current token before regenerating
    const isValid = await TwoFactorService.verify2FALogin(userId, token);
    
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid token. Cannot regenerate backup codes.'
      });
    }

    const newCodes = await TwoFactorService.regenerateBackupCodes(userId);

    if (newCodes) {
      res.json({
        success: true,
        data: {
          backupCodes: newCodes
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to regenerate backup codes'
      });
    }
  } catch (error) {
    console.error('Error regenerating backup codes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to regenerate backup codes'
    });
  }
});

/**
 * Get 2FA status for user
 */
router.get('/status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // For demo purposes, return mock status
    // In production, this would query the database for user's 2FA status
    const mockStatus = {
      enabled: false,
      backupCodesCount: 0
    };

    res.json({
      success: true,
      data: mockStatus
    });
  } catch (error) {
    console.error('Error getting 2FA status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get 2FA status'
    });
  }
});

/**
 * Generate backup codes
 */
router.post('/backup-codes/regenerate', async (req, res) => {
  try {
    const { userId, token } = req.body;

    if (!userId || !token) {
      return res.status(400).json({
        success: false,
        message: 'User ID and token are required'
      });
    }

    // For demo purposes, generate mock backup codes
    const backupCodes = Array.from({ length: 8 }, () => 
      Math.random().toString(36).substring(2, 10).toUpperCase()
    );

    res.json({
      success: true,
      data: {
        backupCodes
      }
    });
  } catch (error) {
    console.error('Error regenerating backup codes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to regenerate backup codes'
    });
  }
});

export { router as twoFactorRoutes };