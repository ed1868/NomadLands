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

  private generateWaitlistEmail(email: string, position: number, isRushUser: boolean): string {
    const rushSection = !isRushUser ? `
      <div style="background: linear-gradient(135deg, #1f2937 0%, #111827 100%); border-radius: 12px; padding: 24px; margin: 24px 0; border: 1px solid #374151;">
        <h3 style="color: #10b981; margin: 0 0 16px 0; font-size: 18px;">⚡ Want to Skip the Line?</h3>
        <p style="color: #d1d5db; margin: 0 0 16px 0; line-height: 1.6;">
          Engineers and technical professionals can get <strong style="color: #10b981;">50% faster access</strong> with our Rush Pass.
        </p>
        <div style="background: #0f172a; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <div style="color: #10b981; font-weight: 600; font-size: 24px;">$20 Rush Fee</div>
          <div style="color: #9ca3af; font-size: 14px;">Cut your wait time in half</div>
        </div>
        <a href="https://buy.stripe.com/your-payment-link" 
           style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
                  color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; 
                  font-weight: 600; margin-top: 8px;">
          Get Rush Access →
        </a>
      </div>
    ` : `
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 12px; padding: 24px; margin: 24px 0;">
        <h3 style="color: white; margin: 0 0 16px 0; font-size: 18px;">⚡ Rush Access Confirmed!</h3>
        <p style="color: white; margin: 0; line-height: 1.6;">
          Your payment has been processed. You'll get priority access with <strong>50% reduced wait time</strong>.
        </p>
      </div>
    `;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AI Nomads Waitlist</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0f172a;">
        <div style="max-width: 600px; margin: 0 auto; background: #1f2937; color: #f9fafb;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1f2937 0%, #111827 100%); padding: 32px 24px; text-align: center; border-bottom: 1px solid #374151;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-weight: 700; font-size: 24px;">AN</span>
            </div>
            <h1 style="color: #f9fafb; margin: 0; font-size: 28px; font-weight: 700;">AI Nomads</h1>
            <p style="color: #9ca3af; margin: 8px 0 0 0; font-size: 16px;">Built in the shadows. Born to disrupt.</p>
          </div>

          <!-- Main Content -->
          <div style="padding: 32px 24px;">
            <h2 style="color: #f9fafb; margin: 0 0 24px 0; font-size: 24px; font-weight: 600;">
              Welcome to the Future! 🚀
            </h2>
            
            <p style="color: #d1d5db; margin: 0 0 24px 0; line-height: 1.6; font-size: 16px;">
              You've successfully joined the AI Nomads waitlist! We're building the most advanced AI agent marketplace 
              where legendary agents are forged.
            </p>

            <!-- Position Info -->
            <div style="background: #0f172a; border-radius: 12px; padding: 24px; margin: 24px 0; border: 1px solid #374151;">
              <h3 style="color: #10b981; margin: 0 0 16px 0; font-size: 18px;">Your Position</h3>
              <div style="display: flex; align-items: center; gap: 16px;">
                <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; 
                           padding: 16px; border-radius: 50%; font-weight: 700; font-size: 24px; min-width: 60px; text-align: center;">
                  #${position}
                </div>
                <div>
                  <div style="color: #f9fafb; font-weight: 600; font-size: 18px;">Position ${position}</div>
                  <div style="color: #9ca3af; font-size: 14px;">in the waitlist queue</div>
                </div>
              </div>
            </div>

            ${rushSection}

            <!-- What's Coming -->
            <div style="background: linear-gradient(135deg, #1f2937 0%, #111827 100%); border-radius: 12px; padding: 24px; margin: 24px 0; border: 1px solid #374151;">
              <h3 style="color: #10b981; margin: 0 0 16px 0; font-size: 18px;">What's Coming</h3>
              <ul style="color: #d1d5db; padding-left: 20px; line-height: 1.8; margin: 0;">
                <li>🤖 <strong>Legendary AI Agents</strong> - Built like warriors, deployed like ninjas</li>
                <li>⚡ <strong>Instant Deployment</strong> - From idea to production in minutes</li>
                <li>🔗 <strong>Enterprise Integration</strong> - n8n, Python, and custom workflows</li>
                <li>💰 <strong>Creator Economy</strong> - Build once, earn forever</li>
                <li>🚀 <strong>Zero-Code Setup</strong> - Anyone can deploy AI powerhouses</li>
              </ul>
            </div>

            <!-- Footer -->
            <div style="text-align: center; padding-top: 24px; border-top: 1px solid #374151; margin-top: 32px;">
              <p style="color: #9ca3af; margin: 0 0 16px 0; font-size: 14px;">
                Stay tuned for updates. We'll notify you when it's your turn.
              </p>
              <p style="color: #6b7280; margin: 0; font-size: 12px;">
                Built with 🔥 by the AI Nomads team
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export const emailService = new EmailService();