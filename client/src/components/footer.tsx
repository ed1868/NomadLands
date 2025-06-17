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
      <footer className="py-12 bg-slate-900 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Bot className="text-white text-lg" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">
                  AI Nomads
                </span>
              </div>
              <p className="text-gray-400 mb-6">
                The future of AI automation is here. Transform your digital workflow with intelligent agents.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-github"></i>
                </a>
              </div>
            </div>
            
            {footerSections.map((section, index) => (
              <div key={index}>
                <h4 className="text-lg font-semibold mb-4 text-white">{section.title}</h4>
                <ul className="space-y-2 text-gray-400">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href="#" className="hover:text-white transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AI Nomads. All rights reserved. Built with ❤️ for the future of work.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
