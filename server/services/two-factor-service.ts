import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { db } from '../db';
import { users } from '../../shared/schema';
import { eq } from 'drizzle-orm';

export class TwoFactorService {
  /**
   * Generate a new 2FA secret for a user
   */
  static generateSecret(userEmail: string, issuer: string = 'NebulaX Exchange') {
    const secret = speakeasy.generateSecret({
      name: `${issuer} (${userEmail})`,
      issuer,
      length: 32
    });

    return {
      secret: secret.base32,
      otpauthUrl: secret.otpauth_url,
      qrCode: secret.otpauth_url
    };
  }

  /**
   * Generate QR code data URL for the secret
   */
  static async generateQRCode(otpauthUrl: string): Promise<string> {
    try {
      const qrCodeDataURL = await QRCode.toDataURL(otpauthUrl);
      return qrCodeDataURL;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  /**
   * Verify a TOTP token
   */
  static verifyToken(secret: string, token: string, window: number = 1): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window
    });
  }

  /**
   * Enable 2FA for a user
   */
  static async enable2FA(userId: string, secret: string, token: string): Promise<boolean> {
    // Verify the token first
    if (!this.verifyToken(secret, token)) {
      return false;
    }

    // Generate backup codes
    const backupCodes = this.generateBackupCodes();

    try {
      await db
        .update(users)
        .set({
          twoFactorEnabled: true,
          twoFactorSecret: secret,
          twoFactorBackupCodes: backupCodes
        })
        .where(eq(users.id, userId));

      return true;
    } catch (error) {
      console.error('Error enabling 2FA:', error);
      return false;
    }
  }

  /**
   * Disable 2FA for a user
   */
  static async disable2FA(userId: string): Promise<boolean> {
    try {
      await db
        .update(users)
        .set({
          twoFactorEnabled: false,
          twoFactorSecret: null,
          twoFactorBackupCodes: null
        })
        .where(eq(users.id, userId));

      return true;
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      return false;
    }
  }

  /**
   * Verify 2FA token for login
   */
  static async verify2FALogin(userId: string, token: string): Promise<boolean> {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId));

      if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
        return false;
      }

      // Check if it's a backup code
      if (user.twoFactorBackupCodes && user.twoFactorBackupCodes.includes(token)) {
        // Remove used backup code
        const updatedCodes = user.twoFactorBackupCodes.filter(code => code !== token);
        await db
          .update(users)
          .set({ twoFactorBackupCodes: updatedCodes })
          .where(eq(users.id, userId));
        
        return true;
      }

      // Verify TOTP token
      return this.verifyToken(user.twoFactorSecret, token);
    } catch (error) {
      console.error('Error verifying 2FA login:', error);
      return false;
    }
  }

  /**
   * Generate backup codes
   */
  static generateBackupCodes(count: number = 10): string[] {
    const codes = [];
    for (let i = 0; i < count; i++) {
      // Generate 8-character alphanumeric codes
      const code = Math.random().toString(36).substr(2, 8).toUpperCase();
      codes.push(code);
    }
    return codes;
  }

  /**
   * Get user's 2FA status
   */
  static async get2FAStatus(userId: string): Promise<{
    enabled: boolean;
    backupCodesCount: number;
  }> {
    try {
      const [user] = await db
        .select({
          twoFactorEnabled: users.twoFactorEnabled,
          twoFactorBackupCodes: users.twoFactorBackupCodes
        })
        .from(users)
        .where(eq(users.id, userId));

      if (!user) {
        return { enabled: false, backupCodesCount: 0 };
      }

      return {
        enabled: user.twoFactorEnabled || false,
        backupCodesCount: user.twoFactorBackupCodes?.length || 0
      };
    } catch (error) {
      console.error('Error getting 2FA status:', error);
      return { enabled: false, backupCodesCount: 0 };
    }
  }

  /**
   * Regenerate backup codes
   */
  static async regenerateBackupCodes(userId: string): Promise<string[] | null> {
    try {
      const newCodes = this.generateBackupCodes();
      
      await db
        .update(users)
        .set({ twoFactorBackupCodes: newCodes })
        .where(eq(users.id, userId));

      return newCodes;
    } catch (error) {
      console.error('Error regenerating backup codes:', error);
      return null;
    }
  }
}