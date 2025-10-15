import { createHash } from 'crypto';
import nodemailer from 'nodemailer';

interface SMSProvider {
  name: string;
  send(to: string, message: string): Promise<SMSResult>;
  getBalance?(): Promise<number>;
  isConfigured(): boolean;
}

interface SMSResult {
  success: boolean;
  messageId?: string;
  error?: string;
  cost?: number;
  provider: string;
}

interface SMSMessage {
  to: string;
  message: string;
  type?: 'alert' | 'notification' | 'security' | 'general';
  priority?: 'low' | 'normal' | 'high';
}

// Built-in SMS providers
class TextBeltProvider implements SMSProvider {
  name = 'TextBelt';
  private apiKey: string | null = null;

  constructor() {
    this.apiKey = process.env.TEXTBELT_API_KEY || null;
  }

  isConfigured(): boolean {
    return this.apiKey !== null;
  }

  async send(to: string, message: string): Promise<SMSResult> {
    try {
      const response = await fetch('https://textbelt.com/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: to,
          message: message,
          key: this.apiKey || 'textbelt'
        })
      });

      const result = await response.json() as any;
      
      return {
        success: result.success,
        messageId: result.textId,
        error: result.error,
        cost: this.apiKey ? 0.01 : 0, // Free tier or paid
        provider: this.name
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        provider: this.name
      };
    }
  }

  async getBalance(): Promise<number> {
    if (!this.apiKey) return 1; // Free tier has 1 message
    
    try {
      const response = await fetch(`https://textbelt.com/quota/${this.apiKey}`);
      const result = await response.json() as any;
      return result.quotaRemaining || 0;
    } catch {
      return 0;
    }
  }
}

class SMSAPIProvider implements SMSProvider {
  name = 'SMSAPI';
  private apiKey: string | null = null;

  constructor() {
    this.apiKey = process.env.SMSAPI_KEY || null;
  }

  isConfigured(): boolean {
    return this.apiKey !== null;
  }

  async send(to: string, message: string): Promise<SMSResult> {
    if (!this.apiKey) {
      return { success: false, error: 'API key not configured', provider: this.name };
    }

    try {
      const response = await fetch('https://api.smsapi.com/sms.do', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: to,
          message: message,
          from: 'NebulaX'
        })
      });

      const result = await response.json();
      
      return {
        success: result.error === 0,
        messageId: result.id,
        error: result.error > 0 ? result.message : undefined,
        cost: result.points || 0,
        provider: this.name
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        provider: this.name
      };
    }
  }
}

class BulkSMSProvider implements SMSProvider {
  name = 'BulkSMS';
  private username: string | null = null;
  private password: string | null = null;

  constructor() {
    this.username = process.env.BULKSMS_USERNAME || null;
    this.password = process.env.BULKSMS_PASSWORD || null;
  }

  isConfigured(): boolean {
    return this.username !== null && this.password !== null;
  }

  async send(to: string, message: string): Promise<SMSResult> {
    if (!this.username || !this.password) {
      return { success: false, error: 'Credentials not configured', provider: this.name };
    }

    try {
      const auth = Buffer.from(`${this.username}:${this.password}`).toString('base64');
      
      const response = await fetch('https://api.bulksms.com/v1/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: to,
          body: message,
          from: 'NebulaX'
        })
      });

      const result = await response.json();
      
      return {
        success: response.ok,
        messageId: result.id,
        error: result.detail?.message,
        cost: result.credit_cost || 0,
        provider: this.name
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        provider: this.name
      };
    }
  }
}

// Free Email-to-SMS Gateway (using carrier email gateways)
class EmailToSMSProvider implements SMSProvider {
  name = 'Email-to-SMS';
  private transporter: any = null;
  private carriers = {
    'verizon': '@vtext.com',
    'att': '@txt.att.net',
    'tmobile': '@tmomail.net',
    'sprint': '@messaging.sprintpcs.com',
    'boost': '@smsmyboostmobile.com',
    'cricket': '@sms.cricketwireless.net',
    'uscellular': '@email.uscc.net',
    'metro': '@mymetropcs.com',
    'republicwireless': '@text.republicwireless.com',
    'googlelfi': '@msg.fi.google.com'
  };

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT || '587';
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpHost && smtpUser && smtpPass) {
      this.transporter = nodemailer.createTransporter({
        host: smtpHost,
        port: parseInt(smtpPort),
        secure: smtpPort === '465',
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });
      console.log('[SMS-Gateway] Email-to-SMS provider initialized with SMTP');
    }
  }

  isConfigured(): boolean {
    return this.transporter !== null;
  }

  async send(to: string, message: string): Promise<SMSResult> {
    if (!this.transporter) {
      return { success: false, error: 'SMTP not configured', provider: this.name };
    }

    try {
      const phoneNumber = to.replace(/\D/g, '');
      const carriers = Object.keys(this.carriers);
      
      // Try multiple carrier gateways for better delivery
      const emailAddresses = carriers.map(carrier => 
        `${phoneNumber}${this.carriers[carrier as keyof typeof this.carriers]}`
      );

      // Send to the most common carriers
      const primaryCarriers = ['verizon', 'att', 'tmobile'];
      const targetEmails = primaryCarriers.map(carrier => 
        `${phoneNumber}${this.carriers[carrier as keyof typeof this.carriers]}`
      );

      const mailOptions = {
        from: process.env.SMTP_USER,
        to: targetEmails.join(','),
        subject: '', // SMS gateways prefer empty subject
        text: message.substring(0, 160) // SMS length limit
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      return {
        success: true,
        messageId: result.messageId,
        cost: 0, // Free via email
        provider: this.name
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        provider: this.name
      };
    }
  }

  private detectCarrier(phoneNumber: string): string | null {
    // Enhanced carrier detection with more area codes
    const areaCode = phoneNumber.replace(/\D/g, '').substring(0, 3);
    const exchanges: { [key: string]: string } = {
      '212': 'verizon', '718': 'att', '917': 'tmobile',
      '310': 'att', '323': 'tmobile', '424': 'verizon',
      '713': 'att', '281': 'verizon', '832': 'tmobile',
      '214': 'att', '469': 'verizon', '972': 'tmobile'
    };
    return exchanges[areaCode] || 'verizon'; // Default to Verizon
  }
}

// SMTP Server Provider (for dedicated email server)
class SMTPSMSProvider implements SMSProvider {
  name = 'SMTP-SMS';
  private transporter: any = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const smtpConfig = {
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      } : undefined
    };

    if (process.env.SMTP_HOST) {
      this.transporter = nodemailer.createTransporter(smtpConfig);
      console.log('[SMS-Gateway] SMTP SMS provider initialized');
    }
  }

  isConfigured(): boolean {
    return this.transporter !== null && process.env.SMTP_HOST !== undefined;
  }

  async send(to: string, message: string): Promise<SMSResult> {
    if (!this.transporter) {
      return { success: false, error: 'SMTP server not configured', provider: this.name };
    }

    try {
      // Use your own SMS gateway or email-to-SMS service
      const phoneNumber = to.replace(/\D/g, '');
      
      // This assumes you have your own SMS gateway endpoint
      const smsGatewayEmail = process.env.SMS_GATEWAY_EMAIL || `sms@${process.env.SMTP_DOMAIN || 'localhost'}`;
      
      const mailOptions = {
        from: process.env.SMTP_USER || `noreply@${process.env.SMTP_DOMAIN || 'localhost'}`,
        to: smsGatewayEmail,
        subject: `SMS to ${phoneNumber}`,
        text: message,
        headers: {
          'X-SMS-To': phoneNumber,
          'X-SMS-Message': message
        }
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      return {
        success: true,
        messageId: result.messageId,
        cost: 0, // Free with your own server
        provider: this.name
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        provider: this.name
      };
    }
  }
}

// Main SMS Gateway class
class SMSGateway {
  private providers: SMSProvider[] = [];
  private fallbackOrder: string[] = ['TextBelt', 'Email-to-SMS', 'SMTP-SMS', 'SMSAPI', 'BulkSMS'];
  private messageQueue: SMSMessage[] = [];
  private isProcessing = false;

  constructor() {
    this.initializeProviders();
    this.startQueueProcessor();
  }

  private initializeProviders() {
    this.providers = [
      new TextBeltProvider(),
      new EmailToSMSProvider(),
      new SMTPSMSProvider(),
      new SMSAPIProvider(),
      new BulkSMSProvider()
    ];

    const configuredProviders = this.providers.filter(p => p.isConfigured());
    console.log(`[SMS-Gateway] Initialized with ${configuredProviders.length} configured providers:`, 
      configuredProviders.map(p => p.name).join(', '));
    
    if (configuredProviders.length === 0) {
      console.log('[SMS-Gateway] No SMS providers configured. Available options:');
      console.log('  - TextBelt: Set TEXTBELT_API_KEY (or use free tier)');
      console.log('  - Email-to-SMS: Set SMTP_HOST, SMTP_USER, SMTP_PASS');
      console.log('  - SMTP Server: Set SMTP_HOST for your own server');
    }
  }

  public async sendSMS(smsData: SMSMessage): Promise<SMSResult> {
    // Add to queue for processing
    this.messageQueue.push(smsData);
    
    // Process immediately for high priority messages
    if (smsData.priority === 'high') {
      return this.processSingleMessage(smsData);
    }

    return { success: true, provider: 'queued', messageId: `queued-${Date.now()}` };
  }

  private async processSingleMessage(smsData: SMSMessage): Promise<SMSResult> {
    const configuredProviders = this.providers.filter(p => p.isConfigured());
    
    if (configuredProviders.length === 0) {
      return {
        success: false,
        error: 'No SMS providers configured',
        provider: 'none'
      };
    }

    // Try providers in fallback order
    for (const providerName of this.fallbackOrder) {
      const provider = configuredProviders.find(p => p.name === providerName);
      if (!provider) continue;

      try {
        const result = await provider.send(smsData.to, smsData.message);
        if (result.success) {
          console.log(`[SMS-Gateway] Message sent via ${provider.name}:`, result.messageId);
          return result;
        } else {
          console.warn(`[SMS-Gateway] ${provider.name} failed:`, result.error);
        }
      } catch (error) {
        console.error(`[SMS-Gateway] ${provider.name} error:`, error);
      }
    }

    return {
      success: false,
      error: 'All providers failed',
      provider: 'all-failed'
    };
  }

  private startQueueProcessor() {
    setInterval(async () => {
      if (this.isProcessing || this.messageQueue.length === 0) return;

      this.isProcessing = true;
      const message = this.messageQueue.shift();
      
      if (message) {
        await this.processSingleMessage(message);
      }
      
      this.isProcessing = false;
    }, 1000); // Process one message per second
  }

  public async getProviderStatus(): Promise<Array<{name: string, configured: boolean, balance?: number}>> {
    const status = [];
    
    for (const provider of this.providers) {
      const info: any = {
        name: provider.name,
        configured: provider.isConfigured()
      };

      if (provider.getBalance && provider.isConfigured()) {
        try {
          info.balance = await provider.getBalance();
        } catch {
          info.balance = 'unknown';
        }
      }

      status.push(info);
    }

    return status;
  }

  // Convenience methods for different message types
  public async sendPriceAlert(phoneNumber: string, symbol: string, currentPrice: number, targetPrice: number, direction: 'above' | 'below'): Promise<SMSResult> {
    const message = `🚨 PRICE ALERT: ${symbol} is now $${currentPrice.toFixed(4)} (${direction} your target of $${targetPrice.toFixed(4)})`;
    
    return this.sendSMS({
      to: phoneNumber,
      message,
      type: 'alert',
      priority: 'high'
    });
  }

  public async sendTradeNotification(phoneNumber: string, symbol: string, action: string, amount: string, price: string, status: string): Promise<SMSResult> {
    const statusEmoji = status === 'executed' ? '✅' : status === 'filled' ? '🎯' : '❌';
    const message = `${statusEmoji} TRADE ${status.toUpperCase()}: ${action.toUpperCase()} ${amount} ${symbol} at $${price}`;
    
    return this.sendSMS({
      to: phoneNumber,
      message,
      type: 'notification',
      priority: 'normal'
    });
  }

  public async sendSecurityAlert(phoneNumber: string, alertType: string, details?: string): Promise<SMSResult> {
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
      type: 'security',
      priority: 'high'
    });
  }

  public async sendVerificationCode(phoneNumber: string, code: string): Promise<SMSResult> {
    const message = `Your NebulaX verification code is: ${code}. This code expires in 10 minutes. Don't share this code with anyone.`;
    
    return this.sendSMS({
      to: phoneNumber,
      message,
      type: 'security',
      priority: 'high'
    });
  }
}

export const smsGateway = new SMSGateway();
export type { SMSMessage, SMSResult };