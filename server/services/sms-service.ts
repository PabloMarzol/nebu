import twilio from 'twilio';

interface SMSMessage {
  to: string;
  message: string;
  type?: 'alert' | 'notification' | 'security' | 'general';
}

interface PriceAlert {
  symbol: string;
  currentPrice: number;
  targetPrice: number;
  direction: 'above' | 'below';
}

interface TradeNotification {
  symbol: string;
  action: 'buy' | 'sell';
  amount: string;
  price: string;
  status: 'executed' | 'filled' | 'cancelled';
}

class SMSService {
  private client: twilio.Twilio | null = null;
  private fromNumber: string | null = null;
  private isConfigured: boolean = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
    const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();
    const phoneNumber = process.env.TWILIO_PHONE_NUMBER?.trim();

    if (accountSid && authToken && phoneNumber) {
      try {
        // Validate Account SID format
        if (!accountSid.startsWith('AC')) {
          console.log('[SMS] Invalid TWILIO_ACCOUNT_SID format - must start with AC');
          this.isConfigured = false;
          return;
        }
        
        this.client = twilio(accountSid, authToken);
        this.fromNumber = phoneNumber;
        this.isConfigured = true;
        console.log('[SMS] Twilio service initialized successfully');
      } catch (error) {
        console.error('[SMS] Failed to initialize Twilio:', error);
        this.isConfigured = false;
      }
    } else {
      console.log('[SMS] Twilio credentials not provided - SMS service disabled');
      this.isConfigured = false;
    }
  }

  public isServiceConfigured(): boolean {
    return this.isConfigured;
  }

  public async sendSMS(smsData: SMSMessage): Promise<boolean> {
    if (!this.isConfigured || !this.client || !this.fromNumber) {
      console.warn('[SMS] Service not configured - cannot send SMS');
      return false;
    }

    try {
      // Validate phone number format
      const cleanNumber = this.formatPhoneNumber(smsData.to);
      if (!cleanNumber) {
        console.error('[SMS] Invalid phone number format:', smsData.to);
        return false;
      }

      const message = await this.client.messages.create({
        body: smsData.message,
        from: this.fromNumber,
        to: cleanNumber
      });

      console.log('[SMS] Message sent successfully:', message.sid);
      return true;
    } catch (error) {
      console.error('[SMS] Failed to send SMS:', error);
      return false;
    }
  }

  public async sendPriceAlert(phoneNumber: string, alert: PriceAlert): Promise<boolean> {
    const direction = alert.direction === 'above' ? 'above' : 'below';
    const message = `🚨 PRICE ALERT: ${alert.symbol} is now $${alert.currentPrice.toFixed(4)} (${direction} your target of $${alert.targetPrice.toFixed(4)})`;
    
    return this.sendSMS({
      to: phoneNumber,
      message,
      type: 'alert'
    });
  }

  public async sendTradeNotification(phoneNumber: string, trade: TradeNotification): Promise<boolean> {
    const action = trade.action.toUpperCase();
    const statusEmoji = trade.status === 'executed' ? '✅' : trade.status === 'filled' ? '🎯' : '❌';
    
    const message = `${statusEmoji} TRADE ${trade.status.toUpperCase()}: ${action} ${trade.amount} ${trade.symbol} at $${trade.price}`;
    
    return this.sendSMS({
      to: phoneNumber,
      message,
      type: 'notification'
    });
  }

  public async sendSecurityAlert(phoneNumber: string, alertType: string, details?: string): Promise<boolean> {
    let message = '';
    
    switch (alertType) {
      case 'login':
        message = '🔐 SECURITY ALERT: New login detected on your NebulaX account';
        break;
      case 'withdrawal':
        message = '💰 SECURITY ALERT: Withdrawal request initiated on your account';
        break;
      case 'password_change':
        message = '🔑 SECURITY ALERT: Password changed on your NebulaX account';
        break;
      case 'api_key':
        message = '🔧 SECURITY ALERT: API key activity detected on your account';
        break;
      default:
        message = `🚨 SECURITY ALERT: ${alertType}`;
    }

    if (details) {
      message += `. ${details}`;
    }

    message += '. If this wasn\'t you, contact support immediately.';
    
    return this.sendSMS({
      to: phoneNumber,
      message,
      type: 'security'
    });
  }

  public async sendWelcomeMessage(phoneNumber: string, username: string): Promise<boolean> {
    const message = `Welcome to NebulaX, ${username}! 🚀 Your account is now active. You'll receive important trading alerts and security notifications here. Trade safely!`;
    
    return this.sendSMS({
      to: phoneNumber,
      message,
      type: 'general'
    });
  }

  public async sendVerificationCode(phoneNumber: string, code: string): Promise<boolean> {
    const message = `Your NebulaX verification code is: ${code}. This code expires in 10 minutes. Don't share this code with anyone.`;
    
    return this.sendSMS({
      to: phoneNumber,
      message,
      type: 'security'
    });
  }

  private formatPhoneNumber(phoneNumber: string): string | null {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Check if it's a valid US number (10 digits) or international (11+ digits)
    if (cleaned.length === 10) {
      return `+1${cleaned}`;
    } else if (cleaned.length >= 11) {
      return `+${cleaned}`;
    }
    
    return null;
  }

  // Bulk SMS for notifications
  public async sendBulkSMS(recipients: string[], message: string): Promise<{ sent: number; failed: number }> {
    if (!this.isConfigured) {
      return { sent: 0, failed: recipients.length };
    }

    let sent = 0;
    let failed = 0;

    for (const recipient of recipients) {
      const success = await this.sendSMS({
        to: recipient,
        message,
        type: 'general'
      });

      if (success) {
        sent++;
      } else {
        failed++;
      }

      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return { sent, failed };
  }

  // Get SMS delivery status
  public async getMessageStatus(messageSid: string): Promise<string | null> {
    if (!this.isConfigured || !this.client) {
      return null;
    }

    try {
      const message = await this.client.messages(messageSid).fetch();
      return message.status;
    } catch (error) {
      console.error('[SMS] Failed to get message status:', error);
      return null;
    }
  }
}

export const smsService = new SMSService();
export type { SMSMessage, PriceAlert, TradeNotification };