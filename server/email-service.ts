import nodemailer from 'nodemailer';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configure with Gmail SMTP - user will provide app password
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Gmail address
        pass: process.env.EMAIL_APP_PASSWORD // App-specific password
      }
    });
  }

  async sendWaitlistConfirmation(email: string, position: number, isRushUser = false) {
    const subject = isRushUser 
      ? '⚡ AI Nomads Waitlist - Rush Access Confirmed!'
      : '🚀 Welcome to AI Nomads Waitlist!';

    const htmlContent = this.generateWaitlistEmail(email, position, isRushUser);

    try {
      await this.transporter.sendMail({
        from: `"AI Nomads" <${process.env.EMAIL_USER}>`,
        to: email,
        subject,
        html: htmlContent
      });
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  async sendContributorNotification(application: any) {
    const subject = '🚀 New Developer Contributor Application - AI Nomads';
    
    const htmlContent = `
      <div style="font-family: 'Courier New', monospace; background: #000000; color: #00ffff; padding: 40px; margin: 0;">
        <div style="max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00ffff; text-align: center; margin-bottom: 30px; text-transform: uppercase; letter-spacing: 2px;">
            [SYSTEM] NEW CONTRIBUTOR APPLICATION
          </h2>
          
          <div style="background: linear-gradient(135deg, #001122 0%, #000011 100%); 
                      border: 2px solid #00ffff; padding: 24px; margin: 24px 0;
                      clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));">
            
            <h3 style="color: #00ffff; margin: 0 0 20px 0; font-size: 16px; text-transform: uppercase;">
              >> DEVELOPER PROFILE DATA <<
            </h3>
            
            <div style="margin-bottom: 16px;">
              <span style="color: #66ccff;">[EMAIL]</span> 
              <strong style="color: #ffffff;">${application.email}</strong>
            </div>
            
            <div style="margin-bottom: 16px;">
              <span style="color: #66ccff;">[GITHUB]</span> 
              <strong style="color: #ffffff;">@${application.githubUsername}</strong>
              <br><span style="color: #00ffff; margin-left: 60px;">→ https://github.com/${application.githubUsername}</span>
            </div>
            
            <div style="margin-bottom: 16px;">
              <span style="color: #66ccff;">[MOTIVATION]</span>
              <br><span style="color: #ffffff; margin-left: 60px; line-height: 1.6;">${application.motivation}</span>
            </div>
            
            <div style="margin-bottom: 16px;">
              <span style="color: #66ccff;">[TIMESTAMP]</span> 
              <strong style="color: #ffffff;">${new Date(application.createdAt).toISOString()}</strong>
            </div>
          </div>
          
          <div style="text-align: center; padding-top: 24px;">
            <div style="height: 2px; background: linear-gradient(90deg, transparent, #00ffff, transparent); margin: 24px 0;"></div>
            <p style="color: #66ccff; margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">
              >>> AI NOMADS RECRUITMENT MATRIX <<<
            </p>
          </div>
        </div>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: `"AI Nomads System" <${process.env.EMAIL_USER}>`,
        to: 'ruizeduardo21@gmail.com',
        subject,
        html: htmlContent
      });
      return true;
    } catch (error) {
      console.error('Contributor notification email failed:', error);
      return false;
    }
  }

  private generateWaitlistEmail(email: string, position: number, isRushUser: boolean): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to AI Nomads!</title>
      </head>
      <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        
        <!-- Main Container -->
        <div style="max-width: 600px; margin: 40px auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);">
          
          <!-- Header with Trophy Icon -->
          <div style="text-align: center; padding: 48px 32px; background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%); position: relative;">
            <div style="position: absolute; top: 20px; left: 20px; width: 72px; height: 72px; background: rgba(72, 187, 120, 0.2); border-radius: 50%; filter: blur(20px);"></div>
            <div style="position: absolute; bottom: 20px; right: 20px; width: 96px; height: 96px; background: rgba(59, 130, 246, 0.2); border-radius: 50%; filter: blur(30px);"></div>
            
            <!-- Trophy Icon -->
            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center; position: relative; z-index: 1;">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                <path d="M4 22h16"></path>
                <path d="M10 14.66V17c0 .55.47.98.97 1.21C11.56 18.75 12.23 19 13 19s1.44-.25 2.03-.79c.5-.23.97-.66.97-1.21v-2.34"></path>
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
              </svg>
            </div>

            <h1 style="color: #10b981; margin: 0 0 16px 0; font-size: 48px; font-weight: 700; letter-spacing: -1px;">
              Welcome to AI Nomads!
            </h1>

            <p style="color: #9ca3af; margin: 0; font-size: 20px; line-height: 1.5;">
              You're now in the queue to build and deploy AI Agent Fleets. Position #${position}.
            </p>
          </div>

          <!-- What Happens Next Section -->
          <div style="padding: 40px 32px; background: linear-gradient(135deg, #374151 0%, #1f2937 100%); border-radius: 16px; margin: 32px; position: relative;">
            <h3 style="color: #10b981; margin: 0 0 24px 0; font-size: 24px; font-weight: 600;">
              What happens next?
            </h3>
            
            <div style="space-y: 20px;">
              <!-- Feature 1 -->
              <div style="display: flex; align-items: center; margin-bottom: 20px;">
                <div style="width: 24px; height: 24px; margin-right: 16px; flex-shrink: 0;">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                </div>
                <span style="color: #d1d5db; font-size: 16px; line-height: 1.5;">
                  Early access to build custom Agent Fleets for any use case
                </span>
              </div>

              <!-- Feature 2 -->
              <div style="display: flex; align-items: center; margin-bottom: 20px;">
                <div style="width: 24px; height: 24px; margin-right: 16px; flex-shrink: 0;">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="m22 21-3-3m1 0a6 6 0 1 1-6-6 6 6 0 0 1 6 6z"></path>
                  </svg>
                </div>
                <span style="color: #d1d5db; font-size: 16px; line-height: 1.5;">
                  Join the creator economy and monetize your automation expertise
                </span>
              </div>

              <!-- Feature 3 -->
              <div style="display: flex; align-items: center;">
                <div style="width: 24px; height: 24px; margin-right: 16px; flex-shrink: 0;">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                </div>
                <span style="color: #d1d5db; font-size: 16px; line-height: 1.5;">
                  Deploy agents for enterprises and earn recurring revenue
                </span>
              </div>
            </div>
          </div>

          ${!isRushUser ? `
          <!-- Rush Payment Section -->
          <div style="padding: 32px; background: linear-gradient(135deg, #1f2937 0%, #111827 100%); margin: 0 32px 32px; border-radius: 16px; border: 2px solid #f59e0b; position: relative;">
            <div style="position: absolute; top: -2px; left: -2px; right: -2px; height: 4px; background: linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b); border-radius: 8px 8px 0 0;"></div>
            
            <h3 style="color: #f59e0b; margin: 0 0 16px 0; font-size: 20px; font-weight: 600;">
              Want to skip the line?
            </h3>
            
            <p style="color: #d1d5db; margin: 0 0 24px 0; font-size: 16px; line-height: 1.5;">
              Get priority access and jump to the front 50% faster for just $20.
            </p>
            
            <div style="background: linear-gradient(135deg, #111827 0%, #0f172a 100%); border: 1px solid #f59e0b; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <div style="color: #f59e0b; font-size: 28px; font-weight: 700; margin-bottom: 8px;">
                $20 Priority Access
              </div>
              <div style="color: #fbbf24; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">
                Skip the Wait • Get Early Access
              </div>
            </div>
            
            <a href="https://ainomads-waitlist.replit.app" 
               style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; text-align: center; width: 100%; box-sizing: border-box;">
              Get Priority Access Now
            </a>
          </div>
          ` : `
          <!-- Rush Confirmed Section -->
          <div style="padding: 32px; background: linear-gradient(135deg, #065f46 0%, #064e3b 100%); margin: 0 32px 32px; border-radius: 16px; border: 2px solid #10b981;">
            <h3 style="color: #10b981; margin: 0 0 16px 0; font-size: 20px; font-weight: 600;">
              Priority Access Confirmed! ⚡
            </h3>
            <p style="color: #a7f3d0; margin: 0; font-size: 16px; line-height: 1.5;">
              Your payment was processed successfully. You now have 50% faster access to the AI Nomads platform!
            </p>
          </div>
          `}

          <!-- Footer -->
          <div style="text-align: center; padding: 32px; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);">
            <a href="https://ainomads-waitlist.replit.app" 
               style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: 600; font-size: 16px;">
              Return to Waitlist
            </a>
          </div>

        </div>
      </body>
      </html>
    `;
  }
}

export const emailService = new EmailService();