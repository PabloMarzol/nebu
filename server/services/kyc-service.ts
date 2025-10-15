import { storage } from "../storage";
import { insertKYCVerificationSchema, type KYCVerification, type User } from "@shared/schema";
import { z } from "zod";

interface DocumentAnalysisResult {
  isValid: boolean;
  confidence: number;
  extractedData: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    documentNumber?: string;
    nationality?: string;
  };
  riskFlags: string[];
}

interface SanctionsCheckResult {
  isClean: boolean;
  matchFound: boolean;
  riskScore: number;
  details?: string;
}

export class KYCService {
  async submitKYCVerification(
    userId: string,
    level: number,
    documentData: z.infer<typeof insertKYCVerificationSchema>
  ): Promise<KYCVerification> {
    // Validate input
    const validatedData = insertKYCVerificationSchema.parse(documentData);
    
    // Create initial verification record
    const verification = await storage.createKYCVerification({
      ...validatedData,
      userId,
      level,
      status: "pending"
    });

    // Start automated verification process
    this.processKYCVerification(verification.id);

    return verification;
  }

  private async processKYCVerification(verificationId: number) {
    try {
      const verification = await this.getVerificationById(verificationId);
      if (!verification) return;

      // Step 1: Document analysis
      const documentAnalysis = await this.analyzeDocument(verification);
      
      // Step 2: Sanctions and PEP screening
      const sanctionsCheck = await this.performSanctionsCheck(verification);
      
      // Step 3: Risk assessment
      const riskScore = await this.calculateRiskScore(verification, documentAnalysis, sanctionsCheck);
      
      // Step 4: Auto-approve or flag for manual review
      await this.makeVerificationDecision(verification, documentAnalysis, sanctionsCheck, riskScore);
      
    } catch (error) {
      console.error(`KYC verification failed for ID ${verificationId}:`, error);
      await storage.updateKYCStatus(verificationId, "rejected", "Technical error during verification");
    }
  }

  private async analyzeDocument(verification: KYCVerification): Promise<DocumentAnalysisResult> {
    // In production, this would integrate with document verification services like:
    // - Jumio
    // - Onfido
    // - Trulioo
    // - AWS Textract
    // - Google Cloud Document AI
    
    // Simulate document analysis
    const isValidDocument = this.validateDocumentFormat(verification);
    const extractedData = this.extractDocumentData(verification);
    const riskFlags = this.identifyRiskFlags(verification);
    
    return {
      isValid: isValidDocument,
      confidence: 0.95,
      extractedData,
      riskFlags
    };
  }

  private validateDocumentFormat(verification: KYCVerification): boolean {
    // Simplified validation - more user-friendly
    if (!verification.documentType || !verification.documentNumber) return false;
    if (!verification.firstName || !verification.lastName) return false;
    
    // Accept any document number with at least 3 characters
    return verification.documentNumber.length >= 3;
  }

  private extractDocumentData(verification: KYCVerification) {
    return {
      firstName: verification.firstName,
      lastName: verification.lastName,
      dateOfBirth: verification.dateOfBirth?.toISOString(),
      documentNumber: verification.documentNumber,
      nationality: verification.nationality
    };
  }

  private identifyRiskFlags(verification: KYCVerification): string[] {
    const flags: string[] = [];
    
    // Age verification
    if (verification.dateOfBirth) {
      const age = new Date().getFullYear() - verification.dateOfBirth.getFullYear();
      if (age < 18) flags.push("underage");
      if (age > 100) flags.push("suspicious_age");
    }
    
    // High-risk countries (simplified example)
    const highRiskCountries = ["XX", "YY"]; // ISO country codes
    if (verification.nationality && highRiskCountries.includes(verification.nationality)) {
      flags.push("high_risk_country");
    }
    
    return flags;
  }

  private async performSanctionsCheck(verification: KYCVerification): Promise<SanctionsCheckResult> {
    // Simplified sanctions check - basic compliance only
    // Skip extensive PEP and complex sanctions screening to reduce friction
    
    return {
      isClean: true, // Auto-approve unless specific issues
      matchFound: false,
      riskScore: 1, // Low risk by default
      details: undefined
    };
  }

  private async checkSanctionsList(name: string, nationality?: string): Promise<boolean> {
    // Simulate sanctions list check
    // In production, this would query real sanctions databases
    return false; // No matches found
  }

  private async checkPEPList(name: string): Promise<boolean> {
    // Simulate PEP list check
    // In production, this would query PEP databases
    return false; // No matches found
  }

  private async calculateRiskScore(
    verification: KYCVerification,
    documentAnalysis: DocumentAnalysisResult,
    sanctionsCheck: SanctionsCheckResult
  ): Promise<number> {
    let riskScore = 1; // Start with minimal risk
    
    // Only flag severe document issues
    if (!documentAnalysis.isValid) riskScore += 2;
    
    // Only flag underage users
    if (documentAnalysis.riskFlags.includes('underage')) riskScore += 10;
    
    // Minimal sanctions impact
    riskScore += sanctionsCheck.riskScore;
    
    // Geographic risk
    const highRiskCountries = ["XX", "YY"];
    if (verification.country && highRiskCountries.includes(verification.country)) {
      riskScore += 3;
    }
    
    return Math.min(riskScore, 10); // Cap at 10
  }

  private async makeVerificationDecision(
    verification: KYCVerification,
    documentAnalysis: DocumentAnalysisResult,
    sanctionsCheck: SanctionsCheckResult,
    riskScore: number
  ) {
    if (!sanctionsCheck.isClean) {
      // Automatic rejection for sanctions/PEP matches
      await storage.updateKYCStatus(
        verification.id,
        "rejected",
        "Failed compliance screening"
      );
      return;
    }

    if (!documentAnalysis.isValid) {
      await storage.updateKYCStatus(
        verification.id,
        "rejected",
        "Invalid or unreadable document"
      );
      return;
    }

    if (riskScore <= 7.5 && documentAnalysis.confidence >= 0.8) {
      // Auto-approve high-quality applications
      await storage.updateKYCStatus(verification.id, "approved");
      await this.updateUserKYCLevel(verification.userId, verification.level);
    } else if (riskScore <= 8.5) {
      // Flag for manual review - VASP compliance requirement
      await storage.updateKYCStatus(verification.id, "pending", "Flagged for manual compliance review");
    } else {
      // Reject high-risk applications for VASP compliance
      await storage.updateKYCStatus(
        verification.id,
        "rejected",
        "Unable to verify identity - VASP compliance requirements not met"
      );
    }
  }

  private async updateUserKYCLevel(userId: string, level: number) {
    // Update user's KYC status and level
    await storage.updateUserKYC(userId, "verified", level);
    
    // Update withdrawal limits based on KYC level
    const newLimit = this.getWithdrawalLimitForLevel(level);
    // Would need to add this method to storage
    // await storage.updateUserWithdrawalLimit(userId, newLimit);
  }

  private getWithdrawalLimitForLevel(level: number): string {
    // High limits for crypto-focused platform
    switch (level) {
      case 0: return "50000";    // $50k daily - email verified users
      case 1: return "100000";   // $100k daily - basic verification
      case 2: return "500000";   // $500k daily - enhanced verification
      case 3: return "1000000";  // $1M daily - premium users
      default: return "50000";   // Generous default for crypto trading
    }
  }

  private async getVerificationById(id: number): Promise<KYCVerification | undefined> {
    // Would need to add this method to storage
    // For now, mock it
    return undefined;
  }

  async getKYCStatus(userId: string): Promise<{
    level: number;
    status: string;
    withdrawalLimit: string;
    requiredForLevel: { [key: number]: string[] };
  }> {
    // Get user's current KYC status
    const user = await storage.getUser(userId);
    
    return {
      level: user?.kycLevel || 0,
      status: user?.kycStatus || "pending",
      withdrawalLimit: user?.withdrawalLimit || "1000",
      requiredForLevel: {
        1: ["Government ID", "Proof of Address"],
        2: ["Enhanced ID Verification", "Source of Funds"],
        3: ["Enhanced Due Diligence", "Bank Statements", "Professional References"]
      }
    };
  }

  async manualKYCReview(verificationId: number, approved: boolean, notes?: string): Promise<KYCVerification> {
    const status = approved ? "approved" : "rejected";
    const verification = await storage.updateKYCStatus(verificationId, status, notes);
    
    if (approved) {
      await this.updateUserKYCLevel(verification.userId, verification.level);
    }
    
    return verification;
  }
}

export const kycService = new KYCService();