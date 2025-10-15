import nodemailer from 'nodemailer';

interface EmailConfig {
  from: string;
  smtp?: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
  sendgrid?: {
    apiKey: string;
  };
}

class EmailService {
  private config: EmailConfig;
  private transporter: any;

  constructor() {
    this.config = {
      from: process.env.EMAIL_FROM || 'traders@nebulaxexchange.io',
      smtp: process.env.SMTP_HOST ? {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASS || ''
        }
      } : undefined,
      sendgrid: process.env.SENDGRID_API_KEY ? {
        apiKey: process.env.SENDGRID_API_KEY
      } : undefined
    };

    this.initializeTransporter();
  }

  private initializeTransporter() {
    if (this.config.sendgrid?.apiKey) {
      // Use SendGrid
      this.transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: 'apikey',
          pass: this.config.sendgrid.apiKey
        }
      });
      console.log('[Email] SendGrid transporter initialized');
    } else if (this.config.smtp?.host) {
      // Use SMTP
      this.transporter = nodemailer.createTransport(this.config.smtp);
      console.log('[Email] SMTP transporter initialized');
    } else {
      // Use Gmail SMTP for reliable email delivery
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'nebulax.notifications@gmail.com',
          pass: 'xqzp wkls jqml ymrf' // App-specific password for NebulaX notifications
        }
      });
      console.log('[Email] Gmail SMTP transporter initialized - real emails will be sent');
    }
  }

  async sendWelcomeEmail(email: string, firstName: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: this.config.from,
        to: email,
        subject: 'Welcome to NebulaX Exchange!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #6366f1;">Welcome to NebulaX Exchange!</h1>
            <p>Hi ${firstName},</p>
            <p>Thank you for joining NebulaX Exchange, the world's most advanced cryptocurrency trading platform.</p>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #1e293b; margin-top: 0;">Your Account is Ready</h2>
              <p>✅ Email verified<br>
              ✅ Basic trading access enabled<br>
              ✅ Portfolio dashboard available</p>
            </div>
            
            <div style="background: #3b82f6; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <a href="https://${process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000'}" 
                 style="color: white; text-decoration: none; font-weight: bold;">
                Start Trading Now →
              </a>
            </div>
            
            <h3>Next Steps:</h3>
            <ul>
              <li>Complete KYC verification for higher limits</li>
              <li>Add payment methods for fiat deposits</li>
              <li>Explore our advanced trading features</li>
              <li>Join our community on Telegram</li>
            </ul>
            
            <p>If you have any questions, our support team is available 24/7.</p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px;">
              NebulaX Exchange - Institutional Grade Cryptocurrency Trading<br>
              This email was sent to ${email}
            </p>
          </div>
        `,
        text: `Welcome to NebulaX Exchange!
        
Hi ${firstName},

Thank you for joining NebulaX Exchange, the world's most advanced cryptocurrency trading platform.

Your account is ready with:
- Email verified
- Basic trading access enabled  
- Portfolio dashboard available

Start trading now: https://${process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000'}

Next Steps:
- Complete KYC verification for higher limits
- Add payment methods for fiat deposits
- Explore our advanced trading features
- Join our community on Telegram

If you have any questions, our support team is available 24/7.

NebulaX Exchange - Institutional Grade Cryptocurrency Trading
This email was sent to ${email}`
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('[Email] Welcome email sent to:', email);
      return true;
    } catch (error) {
      console.error('[Email] Failed to send welcome email:', error);
      return false;
    }
  }

  async sendPasswordResetEmail(email: string, firstName: string, resetToken: string): Promise<boolean> {
    try {
      const resetUrl = `https://${process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000'}/auth/reset-password?token=${resetToken}`;
      
      const mailOptions = {
        from: this.config.from,
        to: email,
        subject: 'Reset Your NebulaX Password',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #ef4444;">Password Reset Request</h1>
            <p>Hi ${firstName},</p>
            <p>We received a request to reset your NebulaX Exchange password.</p>
            
            <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #dc2626;">⚠️ If you didn't request this password reset, please ignore this email.</p>
            </div>
            
            <div style="background: #ef4444; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <a href="${resetUrl}" 
                 style="color: white; text-decoration: none; font-weight: bold;">
                Reset Password →
              </a>
            </div>
            
            <p>This reset link will expire in 1 hour for security reasons.</p>
            <p>If the button doesn't work, copy and paste this link: ${resetUrl}</p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px;">
              NebulaX Exchange Security Team<br>
              This email was sent to ${email}
            </p>
          </div>
        `,
        text: `Password Reset Request
        
Hi ${firstName},

We received a request to reset your NebulaX Exchange password.

If you didn't request this password reset, please ignore this email.

Reset your password: ${resetUrl}

This reset link will expire in 1 hour for security reasons.

NebulaX Exchange Security Team
This email was sent to ${email}`
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('[Email] Password reset email sent to:', email);
      return true;
    } catch (error) {
      console.error('[Email] Failed to send password reset email:', error);
      return false;
    }
  }

  async sendLoginNotificationEmail(email: string, firstName: string, loginDetails: any): Promise<boolean> {
    try {
      const mailOptions = {
        from: this.config.from,
        to: email,
        subject: 'New Login to Your NebulaX Account',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #059669;">New Login Detected</h1>
            <p>Hi ${firstName},</p>
            <p>We detected a new login to your NebulaX Exchange account.</p>
            
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #059669;">Login Details:</h3>
              <p><strong>Time:</strong> ${new Date().toLocaleString()}<br>
              <strong>IP Address:</strong> ${loginDetails.ip || 'Unknown'}<br>
              <strong>User Agent:</strong> ${loginDetails.userAgent || 'Unknown'}</p>
            </div>
            
            <p>If this was you, no action is needed.</p>
            <p>If you don't recognize this login, please secure your account immediately:</p>
            
            <ul>
              <li>Change your password</li>
              <li>Enable two-factor authentication</li>
              <li>Review your account activity</li>
              <li>Contact support if needed</li>
            </ul>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px;">
              NebulaX Exchange Security Team<br>
              This email was sent to ${email}
            </p>
          </div>
        `,
        text: `New Login Detected
        
Hi ${firstName},

We detected a new login to your NebulaX Exchange account.

Login Details:
Time: ${new Date().toLocaleString()}
IP Address: ${loginDetails.ip || 'Unknown'}
User Agent: ${loginDetails.userAgent || 'Unknown'}

If this was you, no action is needed.

If you don't recognize this login, please secure your account immediately:
- Change your password
- Enable two-factor authentication  
- Review your account activity
- Contact support if needed

NebulaX Exchange Security Team
This email was sent to ${email}`
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('[Email] Login notification sent to:', email);
      return true;
    } catch (error) {
      console.error('[Email] Failed to send login notification:', error);
      return false;
    }
  }

  async sendSignupNotification(userEmail: string, firstName: string, lastName: string, ipAddress: string = 'Unknown'): Promise<boolean> {
    try {
      const adminEmail = 'traders@nebulaxexchange.io';
      const timestamp = new Date().toLocaleString('en-US', {
        timeZone: 'UTC',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      // Log detailed notification for debugging
      console.log('\n=== SIGNUP NOTIFICATION ===');
      console.log(`📧 Admin Email: ${adminEmail}`);
      console.log(`👤 New User: ${firstName} ${lastName} (${userEmail})`);
      console.log(`🕒 Time: ${timestamp} UTC`);
      console.log(`🌐 IP: ${ipAddress}`);
      console.log('===========================\n');

      const mailOptions = {
        from: this.config.from,
        to: adminEmail,
        subject: `🎉 New User Registration - NebulaX Exchange`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
            <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #6366f1; margin: 0; font-size: 28px;">🚀 New User Registration</h1>
                <p style="color: #64748b; margin: 10px 0 0 0;">NebulaX Exchange Platform</p>
              </div>
              
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                <h2 style="margin: 0 0 15px 0; font-size: 20px;">👋 New Trader Joined!</h2>
                <p style="margin: 0; opacity: 0.9;">A new user has successfully registered on the NebulaX Exchange platform.</p>
              </div>
              
              <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #334155; margin: 0 0 15px 0;">📊 User Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Name:</td>
                    <td style="padding: 8px 0; color: #1e293b;">${firstName} ${lastName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Email:</td>
                    <td style="padding: 8px 0; color: #1e293b;">${userEmail}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Registration Time:</td>
                    <td style="padding: 8px 0; color: #1e293b;">${timestamp} UTC</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-weight: bold;">IP Address:</td>
                    <td style="padding: 8px 0; color: #1e293b;">${ipAddress}</td>
                  </tr>
                </table>
              </div>
              
              <div style="background: #ecfdf5; border: 1px solid #a7f3d0; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 0; color: #065f46; font-weight: bold;">✅ Account Status: Active</p>
                <p style="margin: 5px 0 0 0; color: #047857; font-size: 14px;">User has been automatically verified and can begin trading immediately.</p>
              </div>
              
              <div style="background: #fef3c7; border: 1px solid #fbbf24; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
                <h4 style="margin: 0 0 10px 0; color: #92400e;">📋 Recommended Actions:</h4>
                <ul style="margin: 0; padding-left: 20px; color: #a16207;">
                  <li>Monitor user trading activity</li>
                  <li>Send welcome communication if needed</li>
                  <li>Track conversion and engagement metrics</li>
                  <li>Follow up with onboarding support</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <div style="background: #6366f1; color: white; padding: 12px 24px; border-radius: 6px; display: inline-block;">
                  <a href="https://${process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000'}/admin" 
                     style="color: white; text-decoration: none; font-weight: bold;">
                    View Admin Dashboard →
                  </a>
                </div>
              </div>
              
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 14px; text-align: center; margin: 0;">
                NebulaX Exchange - Automated Registration Notification<br>
                This notification was automatically generated by the platform
              </p>
            </div>
          </div>
        `,
        text: `🎉 NEW USER REGISTRATION - NebulaX Exchange

A new user has successfully registered on the NebulaX Exchange platform.

USER DETAILS:
Name: ${firstName} ${lastName}
Email: ${userEmail}
Registration Time: ${timestamp} UTC
IP Address: ${ipAddress}

ACCOUNT STATUS: ✅ Active
User has been automatically verified and can begin trading immediately.

RECOMMENDED ACTIONS:
- Monitor user trading activity
- Send welcome communication if needed
- Track conversion and engagement metrics
- Follow up with onboarding support

View Admin Dashboard: https://${process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000'}/admin

NebulaX Exchange - Automated Registration Notification
This notification was automatically generated by the platform`
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      // For JSON transport, log the email content for debugging
      if (result.envelope) {
        console.log('[Email] JSON transport result:');
        console.log('To:', result.envelope.to);
        console.log('Subject:', mailOptions.subject);
        console.log('Body preview:', mailOptions.text.substring(0, 200) + '...');
      }
      
      console.log('[Email] Signup notification sent to admin:', adminEmail);
      
      // IMPORTANT: Also send immediate notification to console for visibility
      console.log('\n🚨 ADMIN NOTIFICATION - NEW USER SIGNUP 🚨');
      console.log('================================================');
      console.log(`📧 SEND TO: ${adminEmail}`);
      console.log(`👤 NEW USER: ${firstName} ${lastName}`);
      console.log(`✉️  EMAIL: ${userEmail}`);
      console.log(`🕒 TIME: ${timestamp} UTC`);
      console.log(`🌐 IP: ${ipAddress}`);
      console.log('================================================\n');
      
      return true;
    } catch (error) {
      console.error('[Email] Failed to send signup notification:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();