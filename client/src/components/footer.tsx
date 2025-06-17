import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

const footerSections = [
  {
    title: "Products",
    links: [
      "Agent Marketplace",
      "Custom Agents",
      "Enterprise Solutions",
      "API Access"
    ]
  },
  {
    title: "Resources",
    links: [
      "Documentation",
      "Tutorials",
      "Support",
      "Community"
    ]
  },
  {
    title: "Company",
    links: [
      "About Us",
      "Careers",
      "Privacy Policy",
      "Terms of Service"
    ]
  }
];

export default function Footer() {
  return (
    <>
      {/* CTA Section */}
      <section className="py-32 aggressive-mesh relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center px-6 relative z-10">
          <h2 className="text-6xl md:text-7xl font-black mb-12 text-foreground tracking-tight">READY TO DOMINATE?</h2>
          <p className="text-2xl md:text-3xl text-foreground mb-16 font-bold leading-relaxed">
            Join the elite circle of <span className="electric-gradient bg-clip-text text-transparent">aggressive achievers</span> who've mastered the art of 
            <span className="fire-gradient bg-clip-text text-transparent"> mindful domination</span> through AI warfare.
          </p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <Button className="electric-gradient px-16 py-6 rounded-full text-2xl font-black hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-500 transform hover:scale-110 text-white animate-power-glow">
              UNLEASH YOUR POWER
            </Button>
            <Button 
              variant="outline"
              className="border-foreground/40 px-16 py-6 rounded-full text-2xl font-black hover:bg-foreground/10 transition-all duration-300 fire-gradient text-white border-none"
            >
              JOIN THE REVOLUTION
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-muted/20 border-t border-muted-foreground/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 sage-gradient rounded-2xl flex items-center justify-center">
                  <Bot className="text-white text-lg" />
                </div>
                <span className="text-2xl font-medium bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                  AI Nomads
                </span>
              </div>
              <p className="text-muted-foreground mb-6 font-light leading-relaxed">
                Mindful technology for conscious professionals. Embrace AI that aligns with your values and enhances your natural flow.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-300">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-300">
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-300">
                  <i className="fab fa-github"></i>
                </a>
              </div>
            </div>
            
            {footerSections.map((section, index) => (
              <div key={index}>
                <h4 className="text-lg font-medium mb-4 text-foreground">{section.title}</h4>
                <ul className="space-y-3 text-muted-foreground">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href="#" className="hover:text-foreground transition-colors duration-300 font-light">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-muted-foreground/10 mt-12 pt-8 text-center text-muted-foreground">
            <p className="font-light">&copy; 2025 AI Nomads. All rights reserved. Crafted with intention for mindful professionals.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
