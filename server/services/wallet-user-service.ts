import { db } from "../db";
import { users, type InsertUser } from "@shared/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

/**
 * Wallet User Service
 * Handles mapping between wallet addresses and user accounts
 */
export class WalletUserService {
  /**
   * Find or create user by wallet address
   * Uses email field temporarily to store wallet address until we add a proper walletAddress field
   */
  async findOrCreateUserByWallet(walletAddress: string): Promise<string> {
    try {
      // Try to find existing user by wallet address (stored in email field temporarily)
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, walletAddress.toLowerCase()))
        .limit(1);

      if (existingUser) {
        return existingUser.id;
      }

      // Create new user with wallet address
      const newUserId = randomUUID();
      const userData: InsertUser = {
        id: newUserId,
        email: walletAddress.toLowerCase(), // Temporary: store wallet address in email field
        firstName: null,
        lastName: null,
        profileImageUrl: null,
        passwordHash: null, // No password for wallet-only accounts
        emailVerified: true, // Consider wallet connection as verified
        accountStatus: 'active',
        accountTier: 'basic',
        kycStatus: 'none',
        kycLevel: 0,
      };

      await db.insert(users).values(userData);

      console.log(`[WalletUser] Created new user ${newUserId} for wallet ${walletAddress}`);

      return newUserId;
    } catch (error: any) {
      console.error('[WalletUser] Error finding/creating user:', error);
      throw new Error(`Failed to find or create user for wallet: ${error.message}`);
    }
  }

  /**
   * Get user by wallet address
   */
  async getUserByWallet(walletAddress: string) {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, walletAddress.toLowerCase()))
        .limit(1);

      return user;
    } catch (error: any) {
      console.error('[WalletUser] Error getting user by wallet:', error);
      return null;
    }
  }

  /**
   * Check if wallet address is already registered
   */
  async isWalletRegistered(walletAddress: string): Promise<boolean> {
    try {
      const user = await this.getUserByWallet(walletAddress);
      return !!user;
    } catch (error: any) {
      console.error('[WalletUser] Error checking wallet registration:', error);
      return false;
    }
  }
}

export const walletUserService = new WalletUserService();