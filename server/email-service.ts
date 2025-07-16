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
        <title>ACCESS GRANTED - AI NOMADS PROTOCOL</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
          
          @media only screen and (max-width: 600px) {
            .mobile-padding { padding: 30px 20px !important; }
            .mobile-title { font-size: 32px !important; }
            .mobile-subtitle { font-size: 20px !important; }
            .mobile-text { font-size: 14px !important; }
            .mobile-logo { width: 100px !important; }
            .mobile-badge { font-size: 12px !important; padding: 10px 16px !important; }
            .mobile-benefit { padding: 16px !important; margin-bottom: 12px !important; }
            .mobile-benefit-title { font-size: 16px !important; }
            .mobile-benefit-text { font-size: 12px !important; }
            .mobile-cta { padding: 14px 24px !important; font-size: 14px !important; }
            .mobile-stats { flex-direction: column !important; gap: 16px !important; }
            .mobile-stat { margin-bottom: 12px !important; }
            .mobile-price { font-size: 28px !important; }
            .mobile-offer-padding { padding: 24px 16px !important; }
          }
          
          .tron-border {
            border: 1px solid #00FFFF;
            box-shadow: 
              0 0 5px rgba(0, 255, 255, 0.5),
              inset 0 0 5px rgba(0, 255, 255, 0.1);
          }
          
          .tron-glow {
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
          }
          
          .circuit-pattern {
            background-image: 
              linear-gradient(90deg, transparent 95%, rgba(0, 255, 255, 0.1) 100%),
              linear-gradient(0deg, transparent 95%, rgba(0, 255, 255, 0.1) 100%);
            background-size: 20px 20px;
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background: #000000; font-family: 'Orbitron', monospace; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
        
        <!-- Main Container -->
        <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(180deg, #000000 0%, #001122 50%, #000000 100%); width: 100%; border-left: 1px solid rgba(0, 255, 255, 0.3); border-right: 1px solid rgba(0, 255, 255, 0.3);">
          
          <!-- Tron Header -->
          <div class="mobile-padding circuit-pattern" style="text-align: center; padding: 40px 30px; background: linear-gradient(135deg, #000000 0%, #001133 50%, #000011 100%); position: relative; overflow: hidden; border-bottom: 2px solid #00FFFF;">
            <!-- Tron Grid Lines -->
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: 
              linear-gradient(90deg, transparent 98%, rgba(0, 255, 255, 0.1) 100%),
              linear-gradient(0deg, transparent 98%, rgba(0, 255, 255, 0.1) 100%);
              background-size: 25px 25px;"></div>
            
            <!-- Cyber Glow Effects -->
            <div style="position: absolute; top: 20%; left: 10%; width: 100px; height: 100px; background: radial-gradient(circle, rgba(0, 255, 255, 0.15) 0%, transparent 70%); border-radius: 50%;"></div>
            <div style="position: absolute; bottom: 20%; right: 10%; width: 120px; height: 120px; background: radial-gradient(circle, rgba(0, 191, 255, 0.1) 0%, transparent 70%); border-radius: 50%;"></div>
            
            <!-- AI Nomads Logo - Using relative path -->
            <div style="margin: 0 auto 24px; position: relative; z-index: 2;">
              <img src="/attached_assets/logo_dark_mode-removebg-preview_1752545790260.png" alt="AI NOMADS PROTOCOL" style="width: 140px; height: auto; max-width: 100%; filter: drop-shadow(0 0 15px rgba(0, 255, 255, 0.6));" class="mobile-logo" />
            </div>

            <div style="border: 2px solid #00FFFF; background: rgba(0, 255, 255, 0.05); padding: 12px 24px; margin: 0 auto 20px; display: inline-block; clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%); position: relative; z-index: 2;">
              <h1 class="mobile-title tron-glow" style="color: #00FFFF; margin: 0; font-size: 36px; font-weight: 900; letter-spacing: 2px; line-height: 1.1; text-align: center;">
                ACCESS GRANTED
              </h1>
            </div>
            
            <h2 class="mobile-subtitle" style="color: #FFFFFF; margin: 0 0 20px 0; font-size: 24px; font-weight: 400; letter-spacing: 3px; text-align: center; text-transform: uppercase;">
              AI NOMADS PROTOCOL
            </h2>

            <div class="mobile-badge tron-border" style="background: linear-gradient(135deg, rgba(0, 255, 255, 0.1) 0%, rgba(0, 191, 255, 0.1) 100%); color: #00FFFF; display: inline-block; padding: 12px 24px; margin: 0 0 20px 0; font-size: 14px; font-weight: 700; clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%); letter-spacing: 1px;">
              QUEUE POSITION: #${position}
            </div>

            <p class="mobile-text" style="color: #B3E5FC; margin: 0 auto; font-size: 16px; line-height: 1.6; max-width: 480px; text-align: center; letter-spacing: 0.5px;">
              NEURAL NETWORK INITIALIZATION COMPLETE<br>
              <span style="color: #00FFFF; font-weight: 700;">AGENT DEPLOYMENT PROTOCOL ACTIVATED</span>
            </p>
          </div>

          <!-- Protocol Features -->
          <div class="mobile-padding circuit-pattern" style="padding: 40px 30px; background: linear-gradient(135deg, #000011 0%, #001122 50%, #000033 100%); margin: 0; text-align: center; border-bottom: 1px solid rgba(0, 255, 255, 0.3);">
            <div style="border: 2px solid #00FFFF; background: rgba(0, 255, 255, 0.05); padding: 8px 20px; margin: 0 auto 24px; display: inline-block; clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);">
              <h3 class="mobile-subtitle tron-glow" style="color: #00FFFF; margin: 0; font-size: 24px; font-weight: 700; text-align: center; letter-spacing: 2px;">
                PROTOCOL FEATURES
              </h3>
            </div>
            <p class="mobile-text" style="color: #B3E5FC; margin: 0 0 32px 0; font-size: 14px; text-align: center; line-height: 1.6; letter-spacing: 0.5px;">
              ADVANCED AI DEPLOYMENT CAPABILITIES
            </p>
            
            <!-- Tron Feature Grid -->
            <div style="display: block; max-width: 500px; margin: 0 auto;">
              <!-- Feature 1 -->
              <div class="mobile-benefit tron-border" style="background: linear-gradient(135deg, rgba(0, 255, 255, 0.03) 0%, rgba(0, 191, 255, 0.03) 100%); padding: 20px; margin-bottom: 16px; position: relative; overflow: hidden; text-align: center; clip-path: polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%);">
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: 
                  linear-gradient(90deg, transparent 98%, rgba(0, 255, 255, 0.1) 100%),
                  linear-gradient(0deg, transparent 98%, rgba(0, 255, 255, 0.1) 100%);
                  background-size: 15px 15px;"></div>
                
                <div style="position: relative; z-index: 2; margin-bottom: 12px;">
                  <div style="width: 40px; height: 40px; background: rgba(0, 255, 255, 0.1); border: 1px solid #00FFFF; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; clip-path: polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%);">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00FFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                      <path d="M2 17l10 5 10-5"/>
                      <path d="M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                  <h4 class="mobile-benefit-title" style="color: #00FFFF; margin: 0; font-size: 16px; font-weight: 700; line-height: 1.3; letter-spacing: 1px;">
                    FLEET DEPLOYMENT
                  </h4>
                </div>
                <p class="mobile-benefit-text" style="color: #B3E5FC; margin: 0; font-size: 12px; line-height: 1.4; text-align: center; letter-spacing: 0.3px;">
                  Deploy autonomous AI agent networks for enterprise-scale automation and process optimization
                </p>
              </div>

              <!-- Feature 2 -->
              <div class="mobile-benefit tron-border" style="background: linear-gradient(135deg, rgba(0, 255, 255, 0.03) 0%, rgba(0, 191, 255, 0.03) 100%); padding: 20px; margin-bottom: 16px; position: relative; overflow: hidden; text-align: center; clip-path: polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%);">
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: 
                  linear-gradient(90deg, transparent 98%, rgba(0, 255, 255, 0.1) 100%),
                  linear-gradient(0deg, transparent 98%, rgba(0, 255, 255, 0.1) 100%);
                  background-size: 15px 15px;"></div>
                
                <div style="position: relative; z-index: 2; margin-bottom: 12px;">
                  <div style="width: 40px; height: 40px; background: rgba(0, 255, 255, 0.1); border: 1px solid #00FFFF; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; clip-path: polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%);">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00FFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 1v22m5-18H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                  </div>
                  <h4 class="mobile-benefit-title" style="color: #00FFFF; margin: 0; font-size: 16px; font-weight: 700; line-height: 1.3; letter-spacing: 1px;">
                    REVENUE STREAM
                  </h4>
                </div>
                <p class="mobile-benefit-text" style="color: #B3E5FC; margin: 0; font-size: 12px; line-height: 1.4; text-align: center; letter-spacing: 0.3px;">
                  Monetize your AI expertise through the creator economy marketplace infrastructure
                </p>
              </div>

              <!-- Feature 3 -->
              <div class="mobile-benefit tron-border" style="background: linear-gradient(135deg, rgba(0, 255, 255, 0.03) 0%, rgba(0, 191, 255, 0.03) 100%); padding: 20px; margin-bottom: 16px; position: relative; overflow: hidden; text-align: center; clip-path: polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%);">
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: 
                  linear-gradient(90deg, transparent 98%, rgba(0, 255, 255, 0.1) 100%),
                  linear-gradient(0deg, transparent 98%, rgba(0, 255, 255, 0.1) 100%);
                  background-size: 15px 15px;"></div>
                
                <div style="position: relative; z-index: 2; margin-bottom: 12px;">
                  <div style="width: 40px; height: 40px; background: rgba(0, 255, 255, 0.1); border: 1px solid #00FFFF; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; clip-path: polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%);">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00FFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/>
                      <line x1="12" y1="22" x2="12" y2="15.5"/>
                      <polyline points="22,8.5 12,15.5 2,8.5"/>
                    </svg>
                  </div>
                  <h4 class="mobile-benefit-title" style="color: #00FFFF; margin: 0; font-size: 16px; font-weight: 700; line-height: 1.3; letter-spacing: 1px;">
                    NEURAL SECURITY
                  </h4>
                </div>
                <p class="mobile-benefit-text" style="color: #B3E5FC; margin: 0; font-size: 12px; line-height: 1.4; text-align: center; letter-spacing: 0.3px;">
                  Enterprise-grade security protocols with encrypted neural network architecture
                </p>
              </div>
            </div>
          </div>

          <!-- Funding Explanation Section -->
          <div class="mobile-padding" style="padding: 40px 30px; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); margin: 0; text-align: center;">
            <h3 class="mobile-subtitle" style="color: #ffffff; margin: 0 0 16px 0; font-size: 28px; font-weight: 700; text-align: center;">
              Why We're Building This
            </h3>
            <div style="max-width: 500px; margin: 0 auto;">
              <p class="mobile-text" style="color: #d1d5db; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; text-align: center;">
                We're creating the world's most advanced AI agent marketplace. Every dollar from priority access goes directly into:
              </p>
              
              <div style="background: linear-gradient(135deg, #1f2937 0%, #111827 100%); border: 1px solid #374151; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <div style="margin-bottom: 16px;">
                  <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 10px; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M12 1v6m0 6v6"/>
                      <path d="M21 12h-6m-6 0H3"/>
                    </svg>
                  </div>
                  <h4 style="color: #10b981; margin: 0 0 8px 0; font-size: 18px; font-weight: 600;">AI Training & Development</h4>
                  <p style="color: #9ca3af; margin: 0; font-size: 14px; line-height: 1.5;">
                    Advanced AI models, training infrastructure, and cutting-edge research to power our agent ecosystem
                  </p>
                </div>
                
                <div style="margin-bottom: 16px;">
                  <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); border-radius: 10px; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                      <line x1="8" y1="21" x2="16" y2="21"/>
                      <line x1="12" y1="17" x2="12" y2="21"/>
                    </svg>
                  </div>
                  <h4 style="color: #3b82f6; margin: 0 0 8px 0; font-size: 18px; font-weight: 600;">Platform Infrastructure</h4>
                  <p style="color: #9ca3af; margin: 0; font-size: 14px; line-height: 1.5;">
                    Enterprise-grade hosting, security, and scalability to support millions of AI agents
                  </p>
                </div>
                
                <div>
                  <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 10px; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                  <h4 style="color: #f59e0b; margin: 0 0 8px 0; font-size: 18px; font-weight: 600;">Creator Tools & Support</h4>
                  <p style="color: #9ca3af; margin: 0; font-size: 14px; line-height: 1.5;">
                    Developer tools, documentation, and support systems to help creators build amazing agents
                  </p>
                </div>
              </div>
            </div>
          </div>

          ${!isRushUser ? `
          <!-- Priority Access Protocol -->
          <div class="mobile-offer-padding circuit-pattern" style="padding: 0 30px 30px 30px; background: linear-gradient(135deg, #000011 0%, #001122 50%, #000033 100%); margin: 0; position: relative; text-align: center; border-bottom: 1px solid rgba(0, 255, 255, 0.3);">
            <div style="background: linear-gradient(135deg, #001133 0%, #002244 100%); padding: 24px 20px; position: relative; overflow: hidden; border: 2px solid #FF6B35; clip-path: polygon(16px 0%, 100% 0%, calc(100% - 16px) 100%, 0% 100%);">
              <!-- Tron Grid Background -->
              <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: 
                linear-gradient(90deg, transparent 98%, rgba(255, 107, 53, 0.1) 100%),
                linear-gradient(0deg, transparent 98%, rgba(255, 107, 53, 0.1) 100%);
                background-size: 20px 20px;"></div>
              
              <!-- Warning Light Effects -->
              <div style="position: absolute; top: 15%; left: 15%; width: 80px; height: 80px; background: radial-gradient(circle, rgba(255, 107, 53, 0.2) 0%, transparent 70%); border-radius: 50%;"></div>
              <div style="position: absolute; bottom: 15%; right: 15%; width: 100px; height: 100px; background: radial-gradient(circle, rgba(255, 107, 53, 0.15) 0%, transparent 70%); border-radius: 50%;"></div>
              
              <div style="position: relative; z-index: 2; text-align: center;">
                <div style="border: 1px solid #FF6B35; background: rgba(255, 107, 53, 0.1); color: #FF6B35; display: inline-block; padding: 4px 12px; margin: 0 0 16px 0; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; clip-path: polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%);">
                  PRIORITY PROTOCOL
                </div>
                
                <h3 class="mobile-subtitle" style="color: #FF6B35; margin: 0 0 12px 0; font-size: 22px; font-weight: 900; line-height: 1.2; letter-spacing: 1px; text-shadow: 0 0 8px rgba(255, 107, 53, 0.6);">
                  SKIP QUEUE PROTOCOL
                </h3>
                
                <p class="mobile-text" style="color: #FFE0D6; margin: 0 0 20px 0; font-size: 14px; font-weight: 600; letter-spacing: 0.5px;">
                  ACCELERATED ACCESS • 50% FASTER DEPLOYMENT
                </p>
                
                <div style="background: rgba(0, 0, 0, 0.5); border: 2px solid #FF6B35; padding: 16px; margin-bottom: 20px; backdrop-filter: blur(10px); clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);">
                  <div class="mobile-price" style="color: #FF6B35; font-size: 32px; font-weight: 900; margin-bottom: 4px; text-shadow: 0 0 10px rgba(255, 107, 53, 0.8); letter-spacing: 1px;">
                    $20.00 CREDITS
                  </div>
                  <div style="color: #FFE0D6; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; line-height: 1.3;">
                    ONE-TIME PROTOCOL ACTIVATION
                  </div>
                </div>
                
                <a href="https://ainomads-waitlist.replit.app" 
                   class="mobile-cta tron-border" style="display: inline-block; background: linear-gradient(135deg, rgba(255, 107, 53, 0.2) 0%, rgba(255, 107, 53, 0.1) 100%); color: #FF6B35; text-decoration: none; padding: 14px 32px; font-weight: 800; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; width: 100%; max-width: 260px; box-sizing: border-box; clip-path: polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%); border: 2px solid #FF6B35;">
                  ACTIVATE PRIORITY PROTOCOL
                </a>
                
                <p style="color: #7B8FA1; margin: 16px 0 0 0; font-size: 10px; letter-spacing: 0.5px;">
                  ${Math.floor(position * 0.3)} AGENTS ALREADY ACCELERATED DEPLOYMENT
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

          <!-- Network Statistics -->
          <div class="mobile-padding circuit-pattern" style="padding: 40px 30px; background: linear-gradient(135deg, #000000 0%, #001122 100%); text-align: center; border-bottom: 1px solid rgba(0, 255, 255, 0.3);">
            <div style="border: 2px solid #00FFFF; background: rgba(0, 255, 255, 0.05); padding: 6px 16px; margin: 0 auto 24px; display: inline-block; clip-path: polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%);">
              <h4 class="mobile-subtitle tron-glow" style="color: #00FFFF; margin: 0; font-size: 18px; font-weight: 700; letter-spacing: 2px;">
                NETWORK STATUS
              </h4>
            </div>
            <div class="mobile-stats" style="display: flex; justify-content: center; align-items: center; gap: 20px; margin-bottom: 28px; flex-wrap: wrap;">
              <div class="mobile-stat tron-border" style="text-align: center; min-width: 90px; padding: 12px 8px; background: rgba(0, 255, 255, 0.03); clip-path: polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%);">
                <div style="color: #00FFFF; font-size: 20px; font-weight: 900; margin-bottom: 4px; letter-spacing: 1px;">${position * 65}</div>
                <div style="color: #B3E5FC; font-size: 10px; letter-spacing: 0.5px; text-transform: uppercase;">ACTIVE NODES</div>
              </div>
              <div class="mobile-stat tron-border" style="text-align: center; min-width: 90px; padding: 12px 8px; background: rgba(0, 255, 255, 0.03); clip-path: polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%);">
                <div style="color: #00FFFF; font-size: 20px; font-weight: 900; margin-bottom: 4px; letter-spacing: 1px;">$${Math.floor(position * 1.2)}K</div>
                <div style="color: #B3E5FC; font-size: 10px; letter-spacing: 0.5px; text-transform: uppercase;">CREDIT FLOW</div>
              </div>
              <div class="mobile-stat tron-border" style="text-align: center; min-width: 90px; padding: 12px 8px; background: rgba(0, 255, 255, 0.03); clip-path: polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%);">
                <div style="color: #00FFFF; font-size: 20px; font-weight: 900; margin-bottom: 4px; letter-spacing: 1px;">${Math.floor(position / 3)}</div>
                <div style="color: #B3E5FC; font-size: 10px; letter-spacing: 0.5px; text-transform: uppercase;">ENTERPRISES</div>
              </div>
            </div>
            
            <div style="border-top: 1px solid rgba(0, 255, 255, 0.3); padding-top: 24px;">
              <a href="https://ainomads-waitlist.replit.app" 
                 class="mobile-cta tron-border" style="display: inline-block; background: rgba(0, 255, 255, 0.1); color: #00FFFF; text-decoration: none; padding: 12px 28px; font-weight: 700; font-size: 13px; margin-bottom: 20px; width: 100%; max-width: 240px; box-sizing: border-box; clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%); letter-spacing: 1px; text-transform: uppercase;">
                ACCESS PROTOCOL INTERFACE
              </a>
              
              <div style="background: rgba(0, 255, 255, 0.05); border: 1px solid rgba(0, 255, 255, 0.2); padding: 16px; margin: 0 auto; max-width: 400px; clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);">
                <p style="color: #7B8FA1; margin: 0; font-size: 11px; line-height: 1.4; letter-spacing: 0.3px;">
                  PROTOCOL CONFIRMATION TRANSMITTED<br>
                  AI NOMADS NEURAL NETWORK ACTIVATED
                </p>
              </div>
            </div>
          </div>

        </div>
      </body>
      </html>
    `;
  }
}

export const emailService = new EmailService();