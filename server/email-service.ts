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
      <div style="background: linear-gradient(135deg, #001133 0%, #000022 100%); 
                  border: 2px solid #ff6600; padding: 24px; margin: 24px 0; position: relative;
                  box-shadow: 0 0 20px rgba(255, 102, 0, 0.3);" class="circuit-border">
        <div style="position: absolute; top: -2px; left: -2px; right: -2px; height: 4px; 
                    background: linear-gradient(90deg, #ff6600, #ffaa00, #ff6600); opacity: 0.8;"></div>
        <h3 style="color: #ff6600; margin: 0 0 16px 0; font-size: 18px; font-weight: 900;
                   letter-spacing: 1px; text-transform: uppercase;" class="neon-text">
          >>> PRIORITY ACCESS AVAILABLE <<<
        </h3>
        <p style="color: #ffcc66; margin: 0 0 16px 0; line-height: 1.6; font-family: 'Courier New', monospace;">
          <span style="color: #ff6600;">[PROTOCOL]</span> Engineers and technical users can activate 
          <strong style="color: #ffaa00;">RUSH MODE</strong> for 50% faster matrix access.
        </p>
        <div style="background: linear-gradient(135deg, #000000 0%, #221100 100%); 
                    border: 1px solid #ff6600; padding: 16px; margin: 16px 0;
                    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));">
          <div style="color: #ff6600; font-weight: 900; font-size: 24px; font-family: 'Courier New', monospace;">
            $20.00 RUSH PROTOCOL
          </div>
          <div style="color: #ffcc66; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">
            >>> ACTIVATE PRIORITY QUEUE <<<
          </div>
        </div>
        <a href="https://buy.stripe.com/your-payment-link" 
           style="display: inline-block; background: linear-gradient(135deg, #ff6600 0%, #cc4400 100%); 
                  color: #ffffff; text-decoration: none; padding: 14px 28px; 
                  font-weight: 900; margin-top: 8px; border: 2px solid #ff6600;
                  clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
                  font-family: 'Courier New', monospace; letter-spacing: 1px; text-transform: uppercase;">
          >>> ACTIVATE RUSH MODE <<<
        </a>
      </div>
    ` : `
      <div style="background: linear-gradient(135deg, #003300 0%, #006600 100%); 
                  border: 2px solid #00ff00; padding: 24px; margin: 24px 0;
                  box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);">
        <h3 style="color: #00ff00; margin: 0 0 16px 0; font-size: 18px; font-weight: 900;
                   letter-spacing: 1px; text-transform: uppercase;" class="neon-text">
          >>> RUSH ACCESS CONFIRMED <<<
        </h3>
        <p style="color: #66ff66; margin: 0; line-height: 1.6; font-family: 'Courier New', monospace;">
          <span style="color: #00ff00;">[PAYMENT]</span> PROCESSED SUCCESSFULLY. 
          <br><span style="color: #00ff00;">[STATUS]</span> Priority access granted with 50% reduced wait time.
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
      <body style="margin: 0; padding: 0; font-family: 'Courier New', monospace; background: linear-gradient(45deg, #000000, #001122, #000033); background-size: 400% 400%; animation: gradientShift 15s ease infinite; color: #ffffff;">
        <style>
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          @keyframes neonGlow {
            0%, 100% { text-shadow: 0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 15px #00ffff; }
            50% { text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff; }
          }
          
          @keyframes circuitPulse {
            0%, 100% { box-shadow: 0 0 5px #00ffff, inset 0 0 10px rgba(0, 255, 255, 0.1); }
            50% { box-shadow: 0 0 20px #00ffff, inset 0 0 20px rgba(0, 255, 255, 0.2); }
          }
          
          .neon-text {
            animation: neonGlow 2s ease-in-out infinite alternate;
          }
          
          .circuit-border {
            animation: circuitPulse 3s ease-in-out infinite;
          }
        </style>
        <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #000011 0%, #001122 50%, #000033 100%); 
                    border: 2px solid #00ffff; box-shadow: 0 0 30px rgba(0, 255, 255, 0.3), inset 0 0 30px rgba(0, 255, 255, 0.1);"
             class="circuit-border">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #000011 0%, #001133 100%); padding: 32px 24px; text-align: center; 
                      border-bottom: 2px solid #00ffff; position: relative;">
            <div style="position: absolute; top: 0; left: 0; right: 0; height: 2px; 
                        background: linear-gradient(90deg, transparent, #00ffff, #0088ff, #00ffff, transparent);
                        animation: circuitPulse 2s ease-in-out infinite;"></div>
            <div style="background: radial-gradient(circle, #00ffff 0%, #0066cc 50%, #003366 100%); 
                        width: 80px; height: 80px; margin: 0 auto 20px; 
                        border: 2px solid #00ffff; box-shadow: 0 0 20px #00ffff;
                        clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
                        display: flex; align-items: center; justify-content: center;" class="circuit-border">
              <span style="color: #ffffff; font-weight: 900; font-size: 20px; text-shadow: 0 0 10px #00ffff;" class="neon-text">AN</span>
            </div>
            <h1 style="color: #00ffff; margin: 0; font-size: 32px; font-weight: 900; letter-spacing: 3px;
                       text-transform: uppercase;" class="neon-text">AI NOMADS</h1>
            <p style="color: #66ccff; margin: 12px 0 0 0; font-size: 14px; letter-spacing: 2px; 
                      text-transform: uppercase; font-weight: 600;">>>> SYSTEM ACTIVATED <<<</p>
            <div style="margin-top: 16px; height: 1px; background: linear-gradient(90deg, transparent, #00ffff, transparent);"></div>
          </div>

          <!-- Main Content -->
          <div style="padding: 32px 24px; background: linear-gradient(180deg, #000011 0%, #001122 100%); position: relative;">
            <div style="position: absolute; top: 0; left: 24px; right: 24px; height: 1px; 
                        background: linear-gradient(90deg, transparent, #00ffff, transparent);"></div>
            
            <h2 style="color: #00ffff; margin: 0 0 24px 0; font-size: 24px; font-weight: 900; 
                       letter-spacing: 2px; text-transform: uppercase;" class="neon-text">
              >>> ACCESS GRANTED <<<
            </h2>
            
            <p style="color: #66ccff; margin: 0 0 24px 0; line-height: 1.8; font-size: 16px; font-family: 'Courier New', monospace;">
              INITIALIZATION COMPLETE. You are now in the AI Nomads matrix. 
              <br><span style="color: #00ffff;">[SYSTEM]</span> Building the most advanced AI agent marketplace.
              <br><span style="color: #00ffff;">[STATUS]</span> Legendary agents being forged in the digital realm.
            </p>

            <!-- Position Info -->
            <div style="background: linear-gradient(135deg, #000022 0%, #001144 100%); 
                        border: 2px solid #00ffff; padding: 24px; margin: 24px 0; 
                        position: relative; box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);" class="circuit-border">
              <div style="position: absolute; top: -1px; left: -1px; right: -1px; height: 2px; 
                          background: linear-gradient(90deg, #00ffff, #0088ff, #00ffff); opacity: 0.8;"></div>
              <div style="position: absolute; bottom: -1px; left: -1px; right: -1px; height: 2px; 
                          background: linear-gradient(90deg, #00ffff, #0088ff, #00ffff); opacity: 0.8;"></div>
              
              <h3 style="color: #00ffff; margin: 0 0 20px 0; font-size: 18px; font-weight: 900; 
                         letter-spacing: 1px; text-transform: uppercase;" class="neon-text">
                >>> QUEUE POSITION <<<
              </h3>
              
              <div style="display: flex; align-items: center; gap: 20px;">
                <div style="background: radial-gradient(circle, #00ffff 0%, #0066cc 70%, #003366 100%); 
                           color: #000000; padding: 20px; font-weight: 900; font-size: 28px; 
                           min-width: 80px; text-align: center; border: 2px solid #00ffff;
                           box-shadow: 0 0 15px #00ffff; clip-path: polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%);">
                  #${position}
                </div>
                <div>
                  <div style="color: #ffffff; font-weight: 700; font-size: 20px; font-family: 'Courier New', monospace;">
                    POSITION: ${position}
                  </div>
                  <div style="color: #66ccff; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">
                    >>> IN QUEUE MATRIX <<<
                  </div>
                </div>
              </div>
            </div>

            ${rushSection}

            <!-- What's Coming -->
            <div style="background: linear-gradient(135deg, #000033 0%, #001155 100%); 
                        border: 2px solid #0088ff; padding: 24px; margin: 24px 0; position: relative;
                        box-shadow: 0 0 20px rgba(0, 136, 255, 0.2);" class="circuit-border">
              <div style="position: absolute; top: -2px; left: -2px; right: -2px; height: 4px; 
                          background: linear-gradient(90deg, #0088ff, #00ccff, #0088ff); opacity: 0.8;"></div>
              <h3 style="color: #00ccff; margin: 0 0 20px 0; font-size: 18px; font-weight: 900;
                         letter-spacing: 1px; text-transform: uppercase;" class="neon-text">
                >>> MATRIX FEATURES LOADING <<<
              </h3>
              <div style="color: #66ccff; line-height: 2.2; margin: 0; font-family: 'Courier New', monospace;">
                <div style="margin-bottom: 12px;">
                  <span style="color: #0088ff;">[MODULE_01]</span> <strong style="color: #ffffff;">LEGENDARY AI AGENTS</strong>
                  <br><span style="color: #66ccff; margin-left: 80px;">→ Built like digital warriors, deployed as silent executors</span>
                </div>
                <div style="margin-bottom: 12px;">
                  <span style="color: #0088ff;">[MODULE_02]</span> <strong style="color: #ffffff;">QUANTUM DEPLOYMENT</strong>
                  <br><span style="color: #66ccff; margin-left: 80px;">→ Idea to production matrix transfer in nanoseconds</span>
                </div>
                <div style="margin-bottom: 12px;">
                  <span style="color: #0088ff;">[MODULE_03]</span> <strong style="color: #ffffff;">ENTERPRISE NEURAL NET</strong>
                  <br><span style="color: #66ccff; margin-left: 80px;">→ n8n workflows + Python cores + custom architectures</span>
                </div>
                <div style="margin-bottom: 12px;">
                  <span style="color: #0088ff;">[MODULE_04]</span> <strong style="color: #ffffff;">CREATOR ECONOMY MATRIX</strong>
                  <br><span style="color: #66ccff; margin-left: 80px;">→ Build once, earn perpetually through the network</span>
                </div>
                <div>
                  <span style="color: #0088ff;">[MODULE_05]</span> <strong style="color: #ffffff;">ZERO-CODE INTERFACE</strong>
                  <br><span style="color: #66ccff; margin-left: 80px;">→ Anyone can deploy AI powerhouses without code</span>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; padding-top: 24px; margin-top: 32px; position: relative;">
              <div style="height: 2px; background: linear-gradient(90deg, transparent, #00ffff, transparent); margin-bottom: 24px;"></div>
              
              <p style="color: #66ccff; margin: 0 0 16px 0; font-size: 14px; font-family: 'Courier New', monospace;
                        letter-spacing: 1px; text-transform: uppercase;">
                <span style="color: #00ffff;">[STATUS]</span> Monitoring queue. Updates incoming.
              </p>
              <p style="color: #0088ff; margin: 0; font-size: 12px; font-family: 'Courier New', monospace;
                        letter-spacing: 2px; text-transform: uppercase;">
                >>> FORGED BY AI NOMADS MATRIX <<<
              </p>
              
              <div style="height: 1px; background: linear-gradient(90deg, transparent, #00ffff, transparent); margin-top: 24px;"></div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export const emailService = new EmailService();