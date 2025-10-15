import axios from 'axios';
import crypto from 'crypto';

interface KYCDocument {
  type: 'passport' | 'driver_license' | 'national_id' | 'utility_bill' | 'bank_statement';
  country: string;
  frontImage: string; // Base64 or file path
  backImage?: string; // For driver licenses
  extractedData?: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    documentNumber?: string;
    expiryDate?: string;
    address?: string;
  };
}

interface KYCVerificationRequest {
  userId: string;
  documents: KYCDocument[];
  personalInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    nationality: string;
    address: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
  };
  biometricData?: {
    selfieImage: string;
    livenessVideo?: string;
  };
}

interface KYCVerificationResult {
  verificationId: string;
  status: 'pending' | 'approved' | 'rejected' | 'requires_review';
  confidence: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high';
  checks: {
    documentAuthenticity: 'pass' | 'fail' | 'warning';
    faceMatch: 'pass' | 'fail' | 'warning';
    addressVerification: 'pass' | 'fail' | 'warning';
    sanctionsScreening: 'pass' | 'fail' | 'warning';
    pepScreening: 'pass' | 'fail' | 'warning';
    duplicateCheck: 'pass' | 'fail' | 'warning';
  };
  extractedData: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    documentNumber: string;
    nationality: string;
    address?: string;
  };
  rejectionReasons?: string[];
  reviewNotes?: string;
  completedAt?: Date;
}

interface BiometricVerification {
  sessionId: string;
  status: 'active' | 'completed' | 'failed';
  livenessScore: number;
  faceMatchScore: number;
  attempts: number;
  maxAttempts: number;
}

class KYCProviderService {
  private jumioApiKey: string | undefined;
  private jumioApiSecret: string | undefined;
  private onfidoApiKey: string | undefined;
  private baseUrlJumio: string;
  private baseUrlOnfido: string;
  private activeProvider: 'jumio' | 'onfido' | 'mock';

  constructor() {
    this.jumioApiKey = process.env.JUMIO_API_KEY;
    this.jumioApiSecret = process.env.JUMIO_API_SECRET;
    this.onfidoApiKey = process.env.ONFIDO_API_KEY;
    
    this.baseUrlJumio = process.env.JUMIO_BASE_URL || 'https://netverify.com/api/v4';
    this.baseUrlOnfido = process.env.ONFIDO_BASE_URL || 'https://api.eu.onfido.com/v3.6';

    // Determine active provider
    if (this.jumioApiKey && this.jumioApiSecret) {
      this.activeProvider = 'jumio';
      console.log('[KYCProvider] Using Jumio for identity verification');
    } else if (this.onfidoApiKey) {
      this.activeProvider = 'onfido';
      console.log('[KYCProvider] Using Onfido for identity verification');
    } else {
      this.activeProvider = 'mock';
      console.log('[KYCProvider] Using mock KYC service - configure JUMIO_API_KEY or ONFIDO_API_KEY for production');
    }
  }

  // Submit KYC verification request
  async submitVerification(request: KYCVerificationRequest): Promise<KYCVerificationResult> {
    switch (this.activeProvider) {
      case 'jumio':
        return this.submitJumioVerification(request);
      case 'onfido':
        return this.submitOnfidoVerification(request);
      default:
        return this.submitMockVerification(request);
    }
  }

  // Get verification status
  async getVerificationStatus(verificationId: string): Promise<KYCVerificationResult> {
    switch (this.activeProvider) {
      case 'jumio':
        return this.getJumioVerificationStatus(verificationId);
      case 'onfido':
        return this.getOnfidoVerificationStatus(verificationId);
      default:
        return this.getMockVerificationStatus(verificationId);
    }
  }

  // Start biometric verification session
  async startBiometricVerification(userId: string): Promise<BiometricVerification> {
    const sessionId = this.generateSessionId();
    
    // In production, this would initiate a real biometric session
    return {
      sessionId,
      status: 'active',
      livenessScore: 0,
      faceMatchScore: 0,
      attempts: 0,
      maxAttempts: 3
    };
  }

  // Process biometric verification
  async processBiometricData(
    sessionId: string,
    selfieImage: string,
    referenceImage?: string
  ): Promise<BiometricVerification> {
    // In production, this would process actual biometric data
    const mockScore = Math.random() * 100;
    
    return {
      sessionId,
      status: mockScore > 70 ? 'completed' : 'failed',
      livenessScore: mockScore,
      faceMatchScore: referenceImage ? Math.random() * 100 : 0,
      attempts: 1,
      maxAttempts: 3
    };
  }

  // Jumio implementation
  private async submitJumioVerification(request: KYCVerificationRequest): Promise<KYCVerificationResult> {
    try {
      const authHeader = this.generateJumioAuthHeader();
      
      const payload = {
        customerInternalReference: request.userId,
        userReference: request.userId,
        workflowId: 200, // Standard ID verification workflow
        customerData: {
          firstName: request.personalInfo.firstName,
          lastName: request.personalInfo.lastName,
          dateOfBirth: request.personalInfo.dateOfBirth,
          country: request.personalInfo.nationality
        }
      };

      const response = await axios.post(
        `${this.baseUrlJumio}/initiate`,
        payload,
        {
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json',
            'User-Agent': 'NebulaX Exchange/1.0'
          }
        }
      );

      const verificationId = response.data.transactionReference;
      
      return {
        verificationId,
        status: 'pending',
        confidence: 0,
        riskLevel: 'medium',
        checks: {
          documentAuthenticity: 'pass',
          faceMatch: 'pass',
          addressVerification: 'pass',
          sanctionsScreening: 'pass',
          pepScreening: 'pass',
          duplicateCheck: 'pass'
        },
        extractedData: {
          firstName: request.personalInfo.firstName,
          lastName: request.personalInfo.lastName,
          dateOfBirth: request.personalInfo.dateOfBirth,
          documentNumber: '',
          nationality: request.personalInfo.nationality
        }
      };
    } catch (error) {
      console.error('[KYCProvider] Jumio verification error:', error);
      throw new Error('Failed to submit Jumio verification');
    }
  }

  private async getJumioVerificationStatus(verificationId: string): Promise<KYCVerificationResult> {
    try {
      const authHeader = this.generateJumioAuthHeader();
      
      const response = await axios.get(
        `${this.baseUrlJumio}/accounts/${verificationId}/result`,
        {
          headers: {
            'Authorization': authHeader,
            'User-Agent': 'NebulaX Exchange/1.0'
          }
        }
      );

      const result = response.data;
      
      return {
        verificationId,
        status: this.mapJumioStatus(result.verificationStatus),
        confidence: result.verificationScore || 0,
        riskLevel: result.riskLevel || 'medium',
        checks: {
          documentAuthenticity: result.identityVerification?.validity || 'pass',
          faceMatch: result.identityVerification?.similarity || 'pass',
          addressVerification: 'pass',
          sanctionsScreening: 'pass',
          pepScreening: 'pass',
          duplicateCheck: 'pass'
        },
        extractedData: {
          firstName: result.document?.firstName || '',
          lastName: result.document?.lastName || '',
          dateOfBirth: result.document?.dateOfBirth || '',
          documentNumber: result.document?.number || '',
          nationality: result.document?.country || ''
        },
        completedAt: result.timestamp ? new Date(result.timestamp) : undefined
      };
    } catch (error) {
      console.error('[KYCProvider] Error fetching Jumio status:', error);
      throw new Error('Failed to get Jumio verification status');
    }
  }

  // Onfido implementation
  private async submitOnfidoVerification(request: KYCVerificationRequest): Promise<KYCVerificationResult> {
    try {
      // Create applicant
      const applicantResponse = await axios.post(
        `${this.baseUrlOnfido}/applicants`,
        {
          first_name: request.personalInfo.firstName,
          last_name: request.personalInfo.lastName,
          dob: request.personalInfo.dateOfBirth,
          address: {
            flat_number: '',
            building_number: request.personalInfo.address.street,
            building_name: '',
            street: request.personalInfo.address.street,
            sub_street: '',
            town: request.personalInfo.address.city,
            state: request.personalInfo.address.state,
            postcode: request.personalInfo.address.postalCode,
            country: request.personalInfo.address.country
          }
        },
        {
          headers: {
            'Authorization': `Token token=${this.onfidoApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const applicantId = applicantResponse.data.id;

      // Create check
      const checkResponse = await axios.post(
        `${this.baseUrlOnfido}/checks`,
        {
          applicant_id: applicantId,
          report_names: ['document', 'facial_similarity_photo', 'watchlist'],
          tags: [request.userId],
          suppress_form_emails: true
        },
        {
          headers: {
            'Authorization': `Token token=${this.onfidoApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const verificationId = checkResponse.data.id;

      return {
        verificationId,
        status: 'pending',
        confidence: 0,
        riskLevel: 'medium',
        checks: {
          documentAuthenticity: 'pass',
          faceMatch: 'pass',
          addressVerification: 'pass',
          sanctionsScreening: 'pass',
          pepScreening: 'pass',
          duplicateCheck: 'pass'
        },
        extractedData: {
          firstName: request.personalInfo.firstName,
          lastName: request.personalInfo.lastName,
          dateOfBirth: request.personalInfo.dateOfBirth,
          documentNumber: '',
          nationality: request.personalInfo.nationality
        }
      };
    } catch (error) {
      console.error('[KYCProvider] Onfido verification error:', error);
      throw new Error('Failed to submit Onfido verification');
    }
  }

  private async getOnfidoVerificationStatus(verificationId: string): Promise<KYCVerificationResult> {
    try {
      const response = await axios.get(
        `${this.baseUrlOnfido}/checks/${verificationId}`,
        {
          headers: {
            'Authorization': `Token token=${this.onfidoApiKey}`
          }
        }
      );

      const check = response.data;

      return {
        verificationId,
        status: this.mapOnfidoStatus(check.status),
        confidence: this.calculateOnfidoConfidence(check.result),
        riskLevel: check.result === 'consider' ? 'medium' : check.result === 'clear' ? 'low' : 'high',
        checks: {
          documentAuthenticity: 'pass',
          faceMatch: 'pass',
          addressVerification: 'pass',
          sanctionsScreening: 'pass',
          pepScreening: 'pass',
          duplicateCheck: 'pass'
        },
        extractedData: {
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          documentNumber: '',
          nationality: ''
        },
        completedAt: check.completed_at_iso8601 ? new Date(check.completed_at_iso8601) : undefined
      };
    } catch (error) {
      console.error('[KYCProvider] Error fetching Onfido status:', error);
      throw new Error('Failed to get Onfido verification status');
    }
  }

  // Mock implementation for development
  private async submitMockVerification(request: KYCVerificationRequest): Promise<KYCVerificationResult> {
    const verificationId = this.generateVerificationId();
    
    // Simulate processing delay
    setTimeout(() => {
      console.log(`[KYCProvider] Mock verification ${verificationId} completed`);
    }, 5000);

    return {
      verificationId,
      status: 'pending',
      confidence: 85,
      riskLevel: 'low',
      checks: {
        documentAuthenticity: 'pass',
        faceMatch: 'pass',
        addressVerification: 'pass',
        sanctionsScreening: 'pass',
        pepScreening: 'pass',
        duplicateCheck: 'pass'
      },
      extractedData: {
        firstName: request.personalInfo.firstName,
        lastName: request.personalInfo.lastName,
        dateOfBirth: request.personalInfo.dateOfBirth,
        documentNumber: 'MOCK123456789',
        nationality: request.personalInfo.nationality,
        address: `${request.personalInfo.address.street}, ${request.personalInfo.address.city}`
      }
    };
  }

  private async getMockVerificationStatus(verificationId: string): Promise<KYCVerificationResult> {
    // Mock approved result
    return {
      verificationId,
      status: 'approved',
      confidence: 92,
      riskLevel: 'low',
      checks: {
        documentAuthenticity: 'pass',
        faceMatch: 'pass',
        addressVerification: 'pass',
        sanctionsScreening: 'pass',
        pepScreening: 'pass',
        duplicateCheck: 'pass'
      },
      extractedData: {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        documentNumber: 'MOCK123456789',
        nationality: 'US'
      },
      completedAt: new Date()
    };
  }

  // Helper methods
  private generateJumioAuthHeader(): string {
    const timestamp = new Date().toISOString();
    const nonce = crypto.randomBytes(16).toString('hex');
    
    // Create signature
    const signatureString = `${this.jumioApiKey}${timestamp}${nonce}`;
    const signature = crypto
      .createHmac('sha256', this.jumioApiSecret || '')
      .update(signatureString)
      .digest('hex');

    return `HMAC-SHA256 apiKey=${this.jumioApiKey}, signature=${signature}, nonce=${nonce}, timestamp=${timestamp}`;
  }

  private mapJumioStatus(status: string): KYCVerificationResult['status'] {
    switch (status) {
      case 'APPROVED_VERIFIED': return 'approved';
      case 'DENIED_FRAUD': 
      case 'DENIED_UNSUPPORTED_ID_TYPE':
      case 'DENIED_UNSUPPORTED_ID_COUNTRY': return 'rejected';
      case 'NO_ID_UPLOADED': return 'requires_review';
      default: return 'pending';
    }
  }

  private mapOnfidoStatus(status: string): KYCVerificationResult['status'] {
    switch (status) {
      case 'complete': return 'approved';
      case 'withdrawn': 
      case 'paused': return 'rejected';
      case 'awaiting_applicant': return 'requires_review';
      default: return 'pending';
    }
  }

  private calculateOnfidoConfidence(result: string): number {
    switch (result) {
      case 'clear': return 95;
      case 'consider': return 75;
      default: return 25;
    }
  }

  private generateVerificationId(): string {
    return `kyc_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
  }

  // Get supported document types for country
  getSupportedDocuments(country: string): string[] {
    const documentsByCountry: Record<string, string[]> = {
      'US': ['driver_license', 'passport', 'national_id'],
      'GB': ['driver_license', 'passport', 'national_id'],
      'DE': ['national_id', 'passport', 'driver_license'],
      'FR': ['national_id', 'passport', 'driver_license'],
      'CA': ['driver_license', 'passport'],
      'AU': ['driver_license', 'passport'],
      'JP': ['driver_license', 'passport', 'national_id']
    };

    return documentsByCountry[country] || ['passport', 'national_id'];
  }

  // Get KYC requirements for risk level
  getKYCRequirements(riskLevel: 'low' | 'medium' | 'high'): {
    documentsRequired: string[];
    biometricRequired: boolean;
    addressVerificationRequired: boolean;
    sourceOfFundsRequired: boolean;
  } {
    switch (riskLevel) {
      case 'low':
        return {
          documentsRequired: ['passport'],
          biometricRequired: false,
          addressVerificationRequired: false,
          sourceOfFundsRequired: false
        };
      case 'medium':
        return {
          documentsRequired: ['passport', 'utility_bill'],
          biometricRequired: true,
          addressVerificationRequired: true,
          sourceOfFundsRequired: false
        };
      case 'high':
        return {
          documentsRequired: ['passport', 'utility_bill', 'bank_statement'],
          biometricRequired: true,
          addressVerificationRequired: true,
          sourceOfFundsRequired: true
        };
    }
  }
}

export const kycProviderService = new KYCProviderService();