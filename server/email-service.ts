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
        <style>
          @media only screen and (max-width: 600px) {
            .mobile-padding { padding: 30px 20px !important; }
            .mobile-title { font-size: 36px !important; }
            .mobile-subtitle { font-size: 24px !important; }
            .mobile-text { font-size: 16px !important; }
            .mobile-logo { width: 80px !important; height: 80px !important; }
            .mobile-badge { font-size: 14px !important; padding: 12px 20px !important; }
            .mobile-benefit { padding: 20px !important; margin-bottom: 16px !important; }
            .mobile-benefit-title { font-size: 18px !important; }
            .mobile-benefit-text { font-size: 14px !important; }
            .mobile-cta { padding: 16px 30px !important; font-size: 16px !important; }
            .mobile-stats { flex-direction: column !important; gap: 20px !important; }
            .mobile-stat { margin-bottom: 16px !important; }
            .mobile-price { font-size: 36px !important; }
            .mobile-offer-padding { padding: 30px 20px !important; }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
        
        <!-- Main Container -->
        <div style="max-width: 600px; margin: 0 auto; background: #000000; width: 100%;">
          
          <!-- Hero Header -->
          <div class="mobile-padding" style="text-align: center; padding: 50px 30px; background: linear-gradient(135deg, #000000 0%, #1a1a2e 50%, #0f172a 100%); position: relative; overflow: hidden;">
            <!-- Animated background elements -->
            <div style="position: absolute; top: -30px; left: -30px; width: 150px; height: 150px; background: radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%); border-radius: 50%;"></div>
            <div style="position: absolute; bottom: -30px; right: -30px; width: 180px; height: 180px; background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%); border-radius: 50%;"></div>
            
            <!-- AI Nomads Logo/Icon -->
            <div class="mobile-logo" style="width: 100px; height: 100px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 20px; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center; position: relative; z-index: 2; box-shadow: 0 15px 35px rgba(16, 185, 129, 0.3);">
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6"></path>
                <path d="M9 12 1 9l8-3 8 3-8 3Z"></path>
                <path d="M12 1 9 9l8 3-8 3 3 8-3-8-8-3 8-3Z"></path>
              </svg>
            </div>

            <h1 class="mobile-title" style="color: #ffffff; margin: 0 0 16px 0; font-size: 42px; font-weight: 800; letter-spacing: -1px; line-height: 1.1;">
              🎉 You're In!
            </h1>
            
            <h2 class="mobile-subtitle" style="color: #10b981; margin: 0 0 20px 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
              Welcome to AI Nomads
            </h2>

            <div class="mobile-badge" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; display: inline-block; padding: 14px 28px; border-radius: 25px; margin: 0 0 20px 0; font-size: 16px; font-weight: 700; box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);">
              🏆 Waitlist Position: #${position}
            </div>

            <p class="mobile-text" style="color: #d1d5db; margin: 0; font-size: 18px; line-height: 1.6; max-width: 480px; margin: 0 auto;">
              You're about to join the <strong style="color: #10b981;">future of AI automation</strong>. 
              Get ready to build, deploy, and monetize AI Agent Fleets.
            </p>
          </div>

          <!-- What You Get Access To -->
          <div class="mobile-padding" style="padding: 40px 30px; background: linear-gradient(135deg, #111827 0%, #1f2937 100%); margin: 0;">
            <h3 class="mobile-subtitle" style="color: #ffffff; margin: 0 0 12px 0; font-size: 30px; font-weight: 700; text-align: center;">
              What You're Getting Access To
            </h3>
            <p class="mobile-text" style="color: #9ca3af; margin: 0 0 32px 0; font-size: 16px; text-align: center; line-height: 1.6;">
              Join thousands building the future of AI automation
            </p>
            
            <!-- Benefits Grid -->
            <div style="display: block;">
              <!-- Benefit 1 -->
              <div class="mobile-benefit" style="background: linear-gradient(135deg, #1f2937 0%, #111827 100%); border: 2px solid #10b981; border-radius: 16px; padding: 24px; margin-bottom: 20px; position: relative; overflow: hidden;">
                <div style="position: absolute; top: -15px; right: -15px; width: 60px; height: 60px; background: radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%); border-radius: 50%;"></div>
                <div style="display: flex; align-items: flex-start; margin-bottom: 12px; flex-wrap: wrap;">
                  <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-right: 16px; margin-bottom: 8px; flex-shrink: 0;">
                    <span style="font-size: 20px;">🚀</span>
                  </div>
                  <h4 class="mobile-benefit-title" style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 600; line-height: 1.3; flex: 1; min-width: 0;">
                    Build Custom AI Agent Fleets
                  </h4>
                </div>
                <p class="mobile-benefit-text" style="color: #d1d5db; margin: 0; font-size: 15px; line-height: 1.5;">
                  Create powerful automation teams for any business process - from customer service to data analysis to content creation.
                </p>
              </div>

              <!-- Benefit 2 -->
              <div class="mobile-benefit" style="background: linear-gradient(135deg, #1f2937 0%, #111827 100%); border: 2px solid #3b82f6; border-radius: 16px; padding: 24px; margin-bottom: 20px; position: relative; overflow: hidden;">
                <div style="position: absolute; top: -15px; right: -15px; width: 60px; height: 60px; background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%); border-radius: 50%;"></div>
                <div style="display: flex; align-items: flex-start; margin-bottom: 12px; flex-wrap: wrap;">
                  <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-right: 16px; margin-bottom: 8px; flex-shrink: 0;">
                    <span style="font-size: 20px;">💰</span>
                  </div>
                  <h4 class="mobile-benefit-title" style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 600; line-height: 1.3; flex: 1; min-width: 0;">
                    Monetize Your AI Expertise
                  </h4>
                </div>
                <p class="mobile-benefit-text" style="color: #d1d5db; margin: 0; font-size: 15px; line-height: 1.5;">
                  Join the creator economy and earn recurring revenue by selling your AI solutions to businesses worldwide.
                </p>
              </div>

              <!-- Benefit 3 -->
              <div class="mobile-benefit" style="background: linear-gradient(135deg, #1f2937 0%, #111827 100%); border: 2px solid #f59e0b; border-radius: 16px; padding: 24px; margin-bottom: 20px; position: relative; overflow: hidden;">
                <div style="position: absolute; top: -15px; right: -15px; width: 60px; height: 60px; background: radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, transparent 70%); border-radius: 50%;"></div>
                <div style="display: flex; align-items: flex-start; margin-bottom: 12px; flex-wrap: wrap;">
                  <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-right: 16px; margin-bottom: 8px; flex-shrink: 0;">
                    <span style="font-size: 20px;">⚡</span>
                  </div>
                  <h4 class="mobile-benefit-title" style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 600; line-height: 1.3; flex: 1; min-width: 0;">
                    Enterprise-Grade Deployment
                  </h4>
                </div>
                <p class="mobile-benefit-text" style="color: #d1d5db; margin: 0; font-size: 15px; line-height: 1.5;">
                  Deploy your AI agents at scale with enterprise security, monitoring, and support - trusted by Fortune 500 companies.
                </p>
              </div>
            </div>
          </div>

          ${!isRushUser ? `
          <!-- Limited Time Offer -->
          <div class="mobile-offer-padding" style="padding: 0 30px 30px 30px; background: linear-gradient(135deg, #111827 0%, #1f2937 100%); margin: 0; position: relative;">
            <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); border-radius: 16px; padding: 30px 24px; position: relative; overflow: hidden; border: 2px solid #f59e0b;">
              <!-- Simplified background for mobile -->
              <div style="position: absolute; top: -30px; left: -30px; width: 150px; height: 150px; background: radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%); border-radius: 50%;"></div>
              
              <div style="position: relative; z-index: 2; text-align: center;">
                <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #000; display: inline-block; padding: 6px 16px; border-radius: 20px; margin: 0 0 16px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                  🔥 LIMITED TIME
                </div>
                
                <h3 class="mobile-subtitle" style="color: #ffffff; margin: 0 0 12px 0; font-size: 26px; font-weight: 800; line-height: 1.2;">
                  Skip The Wait List
                </h3>
                
                <p class="mobile-text" style="color: #fbbf24; margin: 0 0 20px 0; font-size: 16px; font-weight: 600;">
                  Get Priority Access & Jump Ahead 50% Faster
                </p>
                
                <div style="background: rgba(0, 0, 0, 0.4); border: 2px solid #f59e0b; border-radius: 12px; padding: 20px; margin-bottom: 24px; backdrop-filter: blur(10px);">
                  <div class="mobile-price" style="color: #ffffff; font-size: 40px; font-weight: 900; margin-bottom: 6px; text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);">
                    Only $20
                  </div>
                  <div style="color: #fbbf24; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; line-height: 1.3;">
                    One-Time Payment • Instant Access
                  </div>
                </div>
                
                <a href="https://ainomads-waitlist.replit.app" 
                   class="mobile-cta" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #000000; text-decoration: none; padding: 18px 40px; border-radius: 25px; font-weight: 800; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 8px 20px rgba(245, 158, 11, 0.4); width: 100%; max-width: 280px; box-sizing: border-box;">
                  🚀 Get Priority Access Now
                </a>
                
                <p style="color: #9ca3af; margin: 20px 0 0 0; font-size: 13px;">
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
          <div class="mobile-padding" style="padding: 40px 30px; background: linear-gradient(135deg, #0f172a 0%, #000000 100%); text-align: center;">
            <div style="margin-bottom: 32px;">
              <h4 class="mobile-subtitle" style="color: #ffffff; margin: 0 0 20px 0; font-size: 22px; font-weight: 600;">
                Join the AI Revolution
              </h4>
              <div class="mobile-stats" style="display: flex; justify-content: center; align-items: center; gap: 24px; margin-bottom: 28px; flex-wrap: wrap;">
                <div class="mobile-stat" style="text-align: center; min-width: 100px;">
                  <div style="color: #10b981; font-size: 24px; font-weight: 800; margin-bottom: 4px;">15,000+</div>
                  <div style="color: #9ca3af; font-size: 12px;">Active Agents</div>
                </div>
                <div class="mobile-stat" style="text-align: center; min-width: 100px;">
                  <div style="color: #3b82f6; font-size: 24px; font-weight: 800; margin-bottom: 4px;">$2.4M+</div>
                  <div style="color: #9ca3af; font-size: 12px;">Creator Earnings</div>
                </div>
                <div class="mobile-stat" style="text-align: center; min-width: 100px;">
                  <div style="color: #f59e0b; font-size: 24px; font-weight: 800; margin-bottom: 4px;">500+</div>
                  <div style="color: #9ca3af; font-size: 12px;">Enterprise Clients</div>
                </div>
              </div>
            </div>
            
            <div style="border-top: 1px solid #374151; padding-top: 28px;">
              <a href="https://ainomads-waitlist.replit.app" 
                 class="mobile-cta" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 25px; font-weight: 600; font-size: 15px; margin-bottom: 20px; box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3); width: 100%; max-width: 260px; box-sizing: border-box;">
                🌟 Visit AI Nomads Waitlist
              </a>
              
              <p style="color: #6b7280; margin: 0; font-size: 13px; line-height: 1.5; padding: 0 10px;">
                You're receiving this because you joined the AI Nomads waitlist.
                <br>We're excited to have you on this journey!
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