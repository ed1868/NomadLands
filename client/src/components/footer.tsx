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
      <section className="py-24 gradient-mesh">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-5xl font-light mb-8 text-foreground tracking-tight">Begin Your Mindful Journey</h2>
          <p className="text-xl text-muted-foreground mb-12 font-light leading-relaxed">
            Join a community of conscious professionals who have embraced intentional technology for authentic productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button className="sage-gradient px-12 py-4 rounded-full text-lg font-medium hover:shadow-xl hover:shadow-green-500/20 transition-all duration-500 transform hover:scale-105 text-white">
              Start Your Practice
            </Button>
            <Button 
              variant="outline"
              className="border-muted-foreground/30 px-12 py-4 rounded-full text-lg font-medium hover:bg-muted/50 transition-all duration-300"
            >
              Connect With Us
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
