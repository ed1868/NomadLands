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
            
            ${application.huggingFaceUrl ? `
            <div style="margin-bottom: 16px;">
              <span style="color: #66ccff;">[HUGGING FACE]</span> 
              <strong style="color: #ffffff;">${application.huggingFaceUrl}</strong>
              <br><span style="color: #00ffff; margin-left: 60px;">→ ${application.huggingFaceUrl}</span>
            </div>
            ` : ''}
            
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
        <title>🚀 You're In! Welcome to AI Nomads</title>
      </head>
      <body style="margin: 0; padding: 0; background: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        
        <!-- Main Container -->
        <div style="max-width: 650px; margin: 0 auto; background: #000000;">
          
          <!-- Hero Header -->
          <div style="text-align: center; padding: 60px 40px; background: linear-gradient(135deg, #000000 0%, #1a1a2e 50%, #0f172a 100%); position: relative; overflow: hidden;">
            <!-- Animated background elements -->
            <div style="position: absolute; top: -50px; left: -50px; width: 200px; height: 200px; background: radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%); border-radius: 50%; animation: pulse 3s ease-in-out infinite;"></div>
            <div style="position: absolute; bottom: -50px; right: -50px; width: 250px; height: 250px; background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%); border-radius: 50%; animation: pulse 4s ease-in-out infinite;"></div>
            
            <!-- AI Nomads Logo/Icon -->
            <div style="width: 120px; height: 120px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 24px; margin: 0 auto 32px; display: flex; align-items: center; justify-content: center; position: relative; z-index: 2; box-shadow: 0 20px 40px rgba(16, 185, 129, 0.3);">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6"></path>
                <path d="M9 12 1 9l8-3 8 3-8 3Z"></path>
                <path d="M12 1 9 9l8 3-8 3 3 8-3-8-8-3 8-3Z"></path>
              </svg>
            </div>

            <h1 style="color: #ffffff; margin: 0 0 20px 0; font-size: 56px; font-weight: 800; letter-spacing: -2px; line-height: 1.1;">
              🎉 You're In!
            </h1>
            
            <h2 style="color: #10b981; margin: 0 0 24px 0; font-size: 32px; font-weight: 600; letter-spacing: -0.5px;">
              Welcome to AI Nomads
            </h2>

            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; display: inline-block; padding: 16px 32px; border-radius: 50px; margin: 0 0 24px 0; font-size: 18px; font-weight: 700; box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);">
              🏆 Waitlist Position: #${position}
            </div>

            <p style="color: #d1d5db; margin: 0; font-size: 22px; line-height: 1.6; max-width: 500px; margin: 0 auto;">
              You're about to join the <strong style="color: #10b981;">future of AI automation</strong>. 
              Get ready to build, deploy, and monetize AI Agent Fleets.
            </p>
          </div>

          <!-- What You Get Access To -->
          <div style="padding: 50px 40px; background: linear-gradient(135deg, #111827 0%, #1f2937 100%); margin: 0;">
            <h3 style="color: #ffffff; margin: 0 0 16px 0; font-size: 36px; font-weight: 700; text-align: center;">
              What You're Getting Access To
            </h3>
            <p style="color: #9ca3af; margin: 0 0 40px 0; font-size: 18px; text-align: center; line-height: 1.6;">
              Join thousands building the future of AI automation
            </p>
            
            <!-- Benefits Grid -->
            <div style="display: block;">
              <!-- Benefit 1 -->
              <div style="background: linear-gradient(135deg, #1f2937 0%, #111827 100%); border: 2px solid #10b981; border-radius: 20px; padding: 32px; margin-bottom: 24px; position: relative; overflow: hidden;">
                <div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%); border-radius: 50%;"></div>
                <div style="display: flex; align-items: center; margin-bottom: 16px;">
                  <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-right: 20px;">
                    <span style="font-size: 24px;">🚀</span>
                  </div>
                  <h4 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">
                    Build Custom AI Agent Fleets
                  </h4>
                </div>
                <p style="color: #d1d5db; margin: 0; font-size: 18px; line-height: 1.6;">
                  Create powerful automation teams for any business process - from customer service to data analysis to content creation.
                </p>
              </div>

              <!-- Benefit 2 -->
              <div style="background: linear-gradient(135deg, #1f2937 0%, #111827 100%); border: 2px solid #3b82f6; border-radius: 20px; padding: 32px; margin-bottom: 24px; position: relative; overflow: hidden;">
                <div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%); border-radius: 50%;"></div>
                <div style="display: flex; align-items: center; margin-bottom: 16px;">
                  <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-right: 20px;">
                    <span style="font-size: 24px;">💰</span>
                  </div>
                  <h4 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">
                    Monetize Your AI Expertise
                  </h4>
                </div>
                <p style="color: #d1d5db; margin: 0; font-size: 18px; line-height: 1.6;">
                  Join the creator economy and earn recurring revenue by selling your AI solutions to businesses worldwide.
                </p>
              </div>

              <!-- Benefit 3 -->
              <div style="background: linear-gradient(135deg, #1f2937 0%, #111827 100%); border: 2px solid #f59e0b; border-radius: 20px; padding: 32px; margin-bottom: 24px; position: relative; overflow: hidden;">
                <div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, transparent 70%); border-radius: 50%;"></div>
                <div style="display: flex; align-items: center; margin-bottom: 16px;">
                  <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-right: 20px;">
                    <span style="font-size: 24px;">⚡</span>
                  </div>
                  <h4 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">
                    Enterprise-Grade Deployment
                  </h4>
                </div>
                <p style="color: #d1d5db; margin: 0; font-size: 18px; line-height: 1.6;">
                  Deploy your AI agents at scale with enterprise security, monitoring, and support - trusted by Fortune 500 companies.
                </p>
              </div>
            </div>
          </div>

          ${!isRushUser ? `
          <!-- Limited Time Offer -->
          <div style="padding: 0 40px 40px 40px; background: linear-gradient(135deg, #111827 0%, #1f2937 100%); margin: 0; position: relative;">
            <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); border-radius: 20px; padding: 40px; position: relative; overflow: hidden; border: 3px solid #f59e0b;">
              <!-- Animated glow effect -->
              <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%); border-radius: 50%; animation: pulse 2s ease-in-out infinite;"></div>
              
              <div style="position: relative; z-index: 2; text-align: center;">
                <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #000; display: inline-block; padding: 8px 20px; border-radius: 25px; margin: 0 0 20px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                  🔥 LIMITED TIME
                </div>
                
                <h3 style="color: #ffffff; margin: 0 0 16px 0; font-size: 32px; font-weight: 800; line-height: 1.2;">
                  Skip The Wait List
                </h3>
                
                <p style="color: #fbbf24; margin: 0 0 24px 0; font-size: 20px; font-weight: 600;">
                  Get Priority Access & Jump Ahead 50% Faster
                </p>
                
                <div style="background: rgba(0, 0, 0, 0.4); border: 2px solid #f59e0b; border-radius: 16px; padding: 24px; margin-bottom: 32px; backdrop-filter: blur(10px);">
                  <div style="color: #ffffff; font-size: 48px; font-weight: 900; margin-bottom: 8px; text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);">
                    Only $20
                  </div>
                  <div style="color: #fbbf24; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">
                    One-Time Payment • Instant Access
                  </div>
                </div>
                
                <a href="https://ainomads-waitlist.replit.app" 
                   style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #000000; text-decoration: none; padding: 20px 50px; border-radius: 50px; font-weight: 800; font-size: 18px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 10px 30px rgba(245, 158, 11, 0.4); transition: all 0.3s ease;">
                  🚀 Get Priority Access Now
                </a>
                
                <p style="color: #9ca3af; margin: 24px 0 0 0; font-size: 14px;">
                  Join 500+ priority users who skipped ahead
                </p>
              </div>
            </div>
          </div>
          ` : `
          <!-- Priority Access Confirmed -->
          <div style="padding: 0 40px 40px 40px; background: linear-gradient(135deg, #111827 0%, #1f2937 100%); margin: 0;">
            <div style="background: linear-gradient(135deg, #065f46 0%, #064e3b 100%); border-radius: 20px; padding: 40px; border: 3px solid #10b981; text-align: center; position: relative; overflow: hidden;">
              <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%); border-radius: 50%;"></div>
              
              <div style="position: relative; z-index: 2;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center;">
                  <span style="font-size: 32px;">⚡</span>
                </div>
                
                <h3 style="color: #ffffff; margin: 0 0 16px 0; font-size: 28px; font-weight: 700;">
                  Priority Access Confirmed!
                </h3>
                
                <p style="color: #a7f3d0; margin: 0; font-size: 18px; line-height: 1.6;">
                  Your payment was processed successfully. You now have <strong>50% faster access</strong> to the AI Nomads platform!
                </p>
              </div>
            </div>
          </div>
          `}

          <!-- Social Proof & Footer -->
          <div style="padding: 50px 40px; background: linear-gradient(135deg, #0f172a 0%, #000000 100%); text-align: center;">
            <div style="margin-bottom: 40px;">
              <h4 style="color: #ffffff; margin: 0 0 24px 0; font-size: 24px; font-weight: 600;">
                Join the AI Revolution
              </h4>
              <div style="display: flex; justify-content: center; align-items: center; gap: 30px; margin-bottom: 32px; flex-wrap: wrap;">
                <div style="text-align: center;">
                  <div style="color: #10b981; font-size: 32px; font-weight: 800; margin-bottom: 4px;">15,000+</div>
                  <div style="color: #9ca3af; font-size: 14px;">Active Agents</div>
                </div>
                <div style="text-align: center;">
                  <div style="color: #3b82f6; font-size: 32px; font-weight: 800; margin-bottom: 4px;">$2.4M+</div>
                  <div style="color: #9ca3af; font-size: 14px;">Creator Earnings</div>
                </div>
                <div style="text-align: center;">
                  <div style="color: #f59e0b; font-size: 32px; font-weight: 800; margin-bottom: 4px;">500+</div>
                  <div style="color: #9ca3af; font-size: 14px;">Enterprise Clients</div>
                </div>
              </div>
            </div>
            
            <div style="border-top: 1px solid #374151; padding-top: 32px;">
              <a href="https://ainomads-waitlist.replit.app" 
                 style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: 600; font-size: 16px; margin-bottom: 24px; box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);">
                🌟 Visit AI Nomads Waitlist
              </a>
              
              <p style="color: #6b7280; margin: 0; font-size: 14px; line-height: 1.6;">
                You're receiving this because you joined the AI Nomads waitlist.
                <br>We're excited to have you on this journey!
              </p>
            </div>
          </div>

        </div>
        
        <!-- CSS Animations -->
        <style>
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
          }
        </style>
      </body>
      </html>
    `;
  }
}

export const emailService = new EmailService();