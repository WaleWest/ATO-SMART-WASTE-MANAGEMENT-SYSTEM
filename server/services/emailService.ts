import nodemailer from 'nodemailer';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || process.env.EMAIL_USER,
        pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
      },
    });
  }

  async sendUserConfirmationEmail(userEmail: string, userName: string): Promise<void> {
    const mailOptions = {
      from: process.env.SMTP_USER || process.env.EMAIL_USER || 'noreply@atosmartwastemanagement.com',
      to: userEmail,
      subject: 'Welcome to ATO Smart Waste Management - Registration Confirmed',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1E88E5 0%, #43A047 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">ATO Smart Waste Management</h1>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #37474F;">Welcome, ${userName}!</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Thank you for registering with ATO Smart Waste Management. Your account has been successfully created and confirmed.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1E88E5; margin-top: 0;">What's Next?</h3>
              <ul style="color: #666; line-height: 1.6;">
                <li>Your smart bin will be installed within 3-5 business days</li>
                <li>You'll receive automatic notifications when collection is needed</li>
                <li>Monitor your bin status through our system</li>
                <li>Enjoy hassle-free waste management</li>
              </ul>
            </div>
            
            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #1976d2; margin-top: 0;">Important Information</h4>
              <p style="color: #666; margin-bottom: 0;">
                Our smart bins automatically monitor fill levels and alert our team when collection is needed. 
                You don't need to schedule pickups - we'll take care of everything for you!
              </p>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              If you have any questions or need assistance, please don't hesitate to contact our support team.
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                © 2024 ATO Smart Waste Management. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Confirmation email sent to ${userEmail}`);
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
      throw new Error('Failed to send confirmation email');
    }
  }

  async sendAdminAlert(adminEmail: string, binLocation: string, fillLevel: number): Promise<void> {
    const mailOptions = {
      from: process.env.SMTP_USER || process.env.EMAIL_USER || 'alerts@atosmartwastemanagement.com',
      to: adminEmail,
      subject: `🚨 Collection Alert: Bin at ${binLocation} needs attention`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #FF7043; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">⚠️ Collection Alert</h1>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #37474F;">Immediate Action Required</h2>
            
            <div style="background: #fff3e0; border-left: 4px solid #FF7043; padding: 20px; margin: 20px 0;">
              <h3 style="color: #FF7043; margin-top: 0;">Bin Details</h3>
              <ul style="color: #666; line-height: 1.6;">
                <li><strong>Location:</strong> ${binLocation}</li>
                <li><strong>Fill Level:</strong> ${fillLevel}%</li>
                <li><strong>Status:</strong> Collection Needed</li>
                <li><strong>Alert Time:</strong> ${new Date().toLocaleString()}</li>
              </ul>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1E88E5; margin-top: 0;">Recommended Actions</h3>
              <ol style="color: #666; line-height: 1.6;">
                <li>Schedule immediate collection for this location</li>
                <li>Notify the collection team</li>
                <li>Update the collection schedule if needed</li>
                <li>Check for any recurring issues at this location</li>
              </ol>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="background: #FF7043; color: white; padding: 15px; border-radius: 8px; font-size: 18px; font-weight: bold;">
                Fill Level: ${fillLevel}%
              </div>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                ATO Smart Waste Management - Automated Alert System
              </p>
            </div>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Admin alert sent to ${adminEmail} for bin at ${binLocation}`);
    } catch (error) {
      console.error('Failed to send admin alert:', error);
      throw new Error('Failed to send admin alert');
    }
  }
}

export const emailService = new EmailService();
