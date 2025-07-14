import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Zap, Users, Clock, Shield, Sparkles, Bot, Rocket, Trophy, Calendar, CheckCircle2, Star, ChevronLeft, ChevronRight, Play } from "lucide-react";
import logoImage from "@assets/logo_dark_mode_1750270383392.png";
import agentCreatorImg from "@assets/Screenshot 2025-07-14 at 15.54.39_1752523775495.png";
import fleetTemplatesImg from "@assets/Screenshot 2025-07-14 at 15.54.55_1752523775495.png";
import userDashboardImg from "@assets/Screenshot 2025-07-14 at 15.58.58_1752523775495.png";
import n8nExportImg from "@assets/Screenshot 2025-07-14 at 15.59.12_1752523775495.png";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

// Payment form component
function RushPaymentForm({ email, onSuccess }: { email: string; onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment intent
      const { clientSecret, paymentIntentId } = await apiRequest("POST", "/api/waitlist/rush-payment", { email });

      // Confirm payment
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) return;

      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        }
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Confirm with backend
        await apiRequest("POST", "/api/waitlist/confirm-rush", { email, paymentIntentId });
        
        toast({
          title: "Priority Access Confirmed! ⚡",
          description: "You're now in the premium queue with 50% faster access. Check your email for confirmation.",
        });
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
        <CardElement 
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#f9fafb',
                '::placeholder': { color: '#9ca3af' },
                backgroundColor: 'transparent',
              },
            },
          }}
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
      >
        {isProcessing ? "Processing..." : "Pay $20 for Rush Access ⚡"}
      </Button>
    </form>
  );
}

export default function JoinWaitlist() {
  const [email, setEmail] = useState("");
  const [isEngineer, setIsEngineer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRushPayment, setShowRushPayment] = useState(false);
  const [waitlistPosition, setWaitlistPosition] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Contributor application state
  const [contributorEmail, setContributorEmail] = useState("");
  const [githubUsername, setGithubUsername] = useState("");
  const [motivation, setMotivation] = useState("");
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);
  
  const { toast } = useToast();

  const totalSlides = 4;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };

  const handleJoinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await apiRequest("POST", "/api/waitlist/join", { 
        email, 
        isEngineer 
      });

      setWaitlistPosition(result.position);
      
      toast({
        title: "Welcome to AI Nomads! 🚀",
        description: `You're #${result.position} on the waitlist. Check your email for confirmation.`,
      });

      if (!isEngineer) {
        setShowRushPayment(true);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to join waitlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRushPaymentSuccess = () => {
    setShowRushPayment(false);
    setWaitlistPosition(null);
  };

  const handleContributorApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contributorEmail.includes('@') || !githubUsername || !motivation.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingApplication(true);

    try {
      await apiRequest("POST", "/api/contributors/apply", {
        email: contributorEmail,
        githubUsername: githubUsername.replace('@', ''),
        motivation: motivation.trim()
      });

      toast({
        title: "Application Submitted! 🚀",
        description: "Thanks for your interest! We'll review your application and get back to you soon.",
      });

      // Clear form
      setContributorEmail("");
      setGithubUsername("");
      setMotivation("");
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingApplication(false);
    }
  };

  if (waitlistPosition && !showRushPayment) {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Success State */}
        <div className="relative min-h-screen flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Welcome to AI Nomads! 
              </h1>
              
              <p className="text-xl text-gray-300 mb-6">
                You're now in the queue to build and deploy AI Agent Fleets. Position #{waitlistPosition}.
              </p>

              <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-emerald-400 mb-3">What happens next?</h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3">
                    <Bot className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-gray-300">Early access to build custom Agent Fleets for any use case</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-gray-300">Join the creator economy and monetize your automation expertise</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Rocket className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-gray-300">Deploy agents for enterprises and earn recurring revenue</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => window.location.href = "/"}
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 px-8"
              >
                Return to AI Nomads
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
        
        {/* Ambient background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            {/* Real AI Nomads Logo */}
            <div className="mb-8">
              <img 
                src={logoImage} 
                alt="AI Nomads" 
                className="w-32 h-32 mx-auto mb-4 object-contain" 
              />
              <h2 className="text-2xl font-bold text-emerald-400">AI NOMADS</h2>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Create AI Agents
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Build Entire Fleets
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Start with single AI agents for email, sales, development, or customer support. Then scale up to complete Agent Fleets that can mimic entire companies and departments. 
              Deploy once, earn forever in the creator economy.
            </p>

            <div className="flex items-center justify-center gap-8 mb-12">
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 px-4 py-2">
                <Bot className="w-4 h-4 mr-2" />
                Single Agents
              </Badge>
              <Badge variant="outline" className="border-blue-500/30 text-blue-400 px-4 py-2">
                <Users className="w-4 h-4 mr-2" />
                Company Fleets
              </Badge>
              <Badge variant="outline" className="border-purple-500/30 text-purple-400 px-4 py-2">
                <Zap className="w-4 h-4 mr-2" />
                Creator Economy
              </Badge>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Waitlist Form */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white">Join the Waitlist</CardTitle>
                <CardDescription className="text-gray-400">
                  Be among the first to access legendary AI agents
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!showRushPayment ? (
                  <form onSubmit={handleJoinWaitlist} className="space-y-4">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                      required
                    />
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="engineer"
                        checked={isEngineer}
                        onChange={(e) => setIsEngineer(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 bg-gray-800 border-gray-600 rounded focus:ring-emerald-500"
                      />
                      <label htmlFor="engineer" className="text-sm text-gray-300">
                        I'm an engineer/technical professional
                      </label>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                    >
                      {isSubmitting ? "Joining..." : "Join Waitlist"}
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
                      <Zap className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                      <h3 className="text-lg font-semibold text-emerald-400">Skip the Line</h3>
                      <p className="text-sm text-gray-300">
                        Engineers can cut wait time by 50% with Rush Access
                      </p>
                    </div>

                    <Elements stripe={stripePromise}>
                      <RushPaymentForm email={email} onSuccess={handleRushPaymentSuccess} />
                    </Elements>

                    <Button 
                      onClick={() => setShowRushPayment(false)}
                      variant="outline"
                      className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      No thanks, I'll wait
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* MVP Timeline */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-6">MVP Release Timeline</h3>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4 p-6 bg-emerald-900/30 rounded-lg border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center mt-1 flex-shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.8)]">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-emerald-400 text-lg">NOW - Beta Testing</h4>
                    <p className="text-gray-300 text-sm mt-2">Beta testers are already using the platform and creating amazing agents</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-blue-900/20 rounded-lg border border-blue-500/30">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-400 text-lg">Aug 5 - MVP Release</h4>
                    <p className="text-gray-300 text-sm mt-2">Full access for all beta users and engineers</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-purple-900/20 rounded-lg border border-purple-500/30">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                    <Rocket className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-400 text-lg">Sept 5 - First Wave</h4>
                    <p className="text-gray-300 text-sm mt-2">Early access for priority waitlist members</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-yellow-900/20 rounded-lg border border-yellow-500/30">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-yellow-400 text-lg">Oct 5 - Free Wave</h4>
                    <p className="text-gray-300 text-sm mt-2">Free access for first wave of users</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-emerald-900/20 rounded-lg border border-emerald-500/30">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                    <Trophy className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-emerald-400 text-lg">Dec 5 - Grand Release</h4>
                    <p className="text-gray-300 text-sm mt-2">Full public launch for everyone</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Extra spacing at bottom of timeline */}
        <div className="pb-20"></div>
      </div>

      {/* Platform Screenshots Carousel */}
      <div className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">See the Platform in Action</h3>
            <p className="text-gray-400 text-lg">Every agent created gets both n8n workflows AND Python code for enterprise deployment</p>
          </div>

          <div className="relative">
            {/* Previous Arrow */}
            <button 
              onClick={() => setCurrentSlide((prev) => (prev - 1 + 4) % 4)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Next Arrow */}
            <button 
              onClick={() => setCurrentSlide((prev) => (prev + 1) % 4)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Screenshot Carousel Container */}
            <div className="overflow-hidden rounded-xl">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                
                {/* Screenshot 1: Agent Creator Chat */}
                <div className="w-full flex-shrink-0">
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 border border-gray-700">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                            <Bot className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-white">Simple Chat to Create Agents</h4>
                            <p className="text-sm text-emerald-400">No coding required • Just describe what you want</p>
                          </div>
                        </div>
                        <p className="text-gray-300 mb-4">
                          Creating agents is as simple as having a conversation. Just tell AI Nomads what you want your agent to do, 
                          add integrations like Gmail, Slack, or Notion, and click send. The platform handles all the technical complexity.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm text-gray-300">Natural language agent creation</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm text-gray-300">Pre-built integration options</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm text-gray-300">Quick starter templates</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                        <img 
                          src={agentCreatorImg} 
                          alt="AI Agent Creator Interface"
                          className="w-full rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Screenshot 2: Fleet Builder */}
                <div className="w-full flex-shrink-0">
                  <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 rounded-xl p-8 border border-blue-500/20">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-white">Enterprise Fleet Templates</h4>
                            <p className="text-sm text-blue-400">Complete department automation • Ready to deploy</p>
                          </div>
                        </div>
                        <p className="text-gray-300 mb-4">
                          Choose from pre-built Fleet templates like Sales Domination, Customer Success, or Enterprise SaaS Company. 
                          Each Fleet contains dozens of specialized agents that work together to automate entire business functions.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-gray-300">Sales Fleet: 28 agents, 247 tools</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-gray-300">Customer Success: 16 agents, 312 tools</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-gray-300">Enterprise SaaS: 85 agents, 487 tools</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                        <img 
                          src={fleetTemplatesImg} 
                          alt="Fleet Templates Dashboard"
                          className="w-full rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Screenshot 3: User Dashboard */}
                <div className="w-full flex-shrink-0">
                  <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 rounded-xl p-8 border border-purple-500/20">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-white">Your Agent Dashboard</h4>
                            <p className="text-sm text-purple-400">Performance tracking • Revenue analytics • Fleet management</p>
                          </div>
                        </div>
                        <p className="text-gray-300 mb-4">
                          Monitor your agents' performance, track revenue, and manage your entire fleet from one dashboard. 
                          See real-time metrics, success rates, and earnings. Download n8n workflows or Python code anytime.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-purple-400" />
                            <span className="text-sm text-gray-300">Real-time performance monitoring</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-purple-400" />
                            <span className="text-sm text-gray-300">Revenue and success tracking</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-purple-400" />
                            <span className="text-sm text-gray-300">One-click workflow export</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                        <img 
                          src={userDashboardImg} 
                          alt="Agent Performance Dashboard"
                          className="w-full rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Screenshot 4: n8n JSON Export */}
                <div className="w-full flex-shrink-0">
                  <div className="bg-gradient-to-br from-orange-900/20 to-red-800/10 rounded-xl p-8 border border-orange-500/20">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                            <Rocket className="w-5 h-5 text-orange-400" />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-white">Developer-Ready Export</h4>
                            <p className="text-sm text-orange-400">n8n JSON workflows • Python enterprise code • Full flexibility</p>
                          </div>
                        </div>
                        <p className="text-gray-300 mb-4">
                          Every agent automatically generates both n8n workflow JSON and Python code. Import directly into n8n for MVP testing, 
                          or use the Python code for enterprise-grade deployment. You own the code completely.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-orange-400" />
                            <span className="text-sm text-gray-300">n8n workflow JSON for quick deployment</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-orange-400" />
                            <span className="text-sm text-gray-300">Production Python code with tests</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-orange-400" />
                            <span className="text-sm text-gray-300">Enterprise deployment documentation</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                        <img 
                          src={n8nExportImg} 
                          alt="n8n JSON Workflow Export"
                          className="w-full rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Screenshot Carousel Navigation */}
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: 4 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    currentSlide === index ? 'bg-emerald-500' : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Example Fleets & Agents Carousel */}
      <div className="py-20 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">See Real Fleets & Agents in Action</h3>
            <p className="text-gray-400 text-lg">From simple email agents to complete company automation</p>
          </div>

          <div className="relative">
            {/* Previous Arrow */}
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Next Arrow */}
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Carousel Container */}
            <div className="overflow-hidden rounded-xl">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                
                {/* Example 1: Sales Email Agent */}
                <div className="w-full flex-shrink-0">
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 border border-gray-700">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                            <Bot className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-white">Sales Email Automation Agent</h4>
                            <p className="text-sm text-emerald-400">Single Agent • $280 price point</p>
                          </div>
                        </div>
                        <p className="text-gray-300 mb-4">
                          This agent automatically responds to sales inquiries, qualifies leads, books meetings, and 
                          follows up with prospects. Built by Marcus T., earning $4,200/month from 15 clients.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm text-gray-300">Converts 23% of email leads to meetings</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm text-gray-300">Books 40+ sales meetings per week</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm text-gray-300">Generates $180K pipeline monthly</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-600">
                        <div className="text-center text-gray-400 mb-4">
                          <Play className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm">Sales Agent Dashboard</p>
                        </div>
                        <div className="bg-gray-900 rounded p-4 text-xs font-mono text-green-400">
                          <div>💰 Lead Qualified: 12 high-value prospects</div>
                          <div>📅 Meetings Booked: 8 this week</div>
                          <div>📧 Follow-ups Sent: 24 personalized</div>
                          <div>🎯 Pipeline Added: $47K today</div>
                          <div className="text-emerald-400 mt-2">✅ 34% email-to-meeting conversion</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Example 2: Sales Department Fleet */}
                <div className="w-full flex-shrink-0">
                  <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 rounded-xl p-8 border border-blue-500/20">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-white">Complete Sales Department Fleet</h4>
                            <p className="text-sm text-blue-400">28 Agents • $12,000 licensing</p>
                          </div>
                        </div>
                        <p className="text-gray-300 mb-4">
                          A full sales organization with 28 specialized agents handling everything from lead generation 
                          to deal closing. Built by Marcus R., licensed to 4 companies for $48K/year.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-gray-300">Lead Qualification Fleet (8 agents)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-gray-300">Follow-up & Nurture Fleet (12 agents)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-gray-300">Closing & CRM Fleet (8 agents)</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-600">
                        <div className="text-center text-gray-400 mb-4">
                          <Users className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm">Fleet Dashboard</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div className="bg-blue-900/30 rounded p-3">
                            <div className="text-blue-400 font-semibold">Lead Gen</div>
                            <div className="text-white">847 leads today</div>
                            <div className="text-gray-400">8 agents active</div>
                          </div>
                          <div className="bg-purple-900/30 rounded p-3">
                            <div className="text-purple-400 font-semibold">Qualification</div>
                            <div className="text-white">203 qualified</div>
                            <div className="text-gray-400">12 agents active</div>
                          </div>
                          <div className="bg-green-900/30 rounded p-3">
                            <div className="text-green-400 font-semibold">Follow-ups</div>
                            <div className="text-white">156 sent</div>
                            <div className="text-gray-400">Auto-scheduled</div>
                          </div>
                          <div className="bg-yellow-900/30 rounded p-3">
                            <div className="text-yellow-400 font-semibold">Closing</div>
                            <div className="text-white">$47K pipeline</div>
                            <div className="text-gray-400">8 deals active</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Example 3: Social Media Creator Fleet */}
                <div className="w-full flex-shrink-0">
                  <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 rounded-xl p-8 border border-purple-500/20">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-white">Social Media Creator Fleet</h4>
                            <p className="text-sm text-purple-400">10 Agents • $3,500 monthly license</p>
                          </div>
                        </div>
                        <p className="text-gray-300 mb-4">
                          Replaces an entire 10-person social media team with automated video creation, image generation, 
                          posting, and engagement. Built by CreatorPro, earning $21K/month from 6 influencers.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-purple-400" />
                            <span className="text-sm text-gray-300">Auto-generates 50+ videos weekly per account</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-purple-400" />
                            <span className="text-sm text-gray-300">Creates custom images and graphics daily</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-purple-400" />
                            <span className="text-sm text-gray-300">Responds to 1000+ comments/DMs automatically</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-600">
                        <div className="text-center text-gray-400 mb-4">
                          <Sparkles className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm">Creator Fleet Dashboard</p>
                        </div>
                        <div className="space-y-3 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Videos Created</span>
                            <span className="text-pink-400">12 today</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Images Generated</span>
                            <span className="text-blue-400">47 unique</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Posts Scheduled</span>
                            <span className="text-purple-400">156 this week</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Engagements</span>
                            <span className="text-green-400">2.3K replies sent</span>
                          </div>
                          <div className="bg-gradient-to-r from-pink-900/50 to-purple-900/50 rounded p-2 mt-3">
                            <div className="text-pink-400 font-semibold">Replacing 10 People</div>
                            <div className="text-gray-300">Video Editor, Graphic Designer, Community Manager, Content Writer, Scheduler, Analytics Expert, Photographer, Copywriter, Engagement Specialist, Strategy Planner</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Example 4: Enterprise Development Company Fleet */}
                <div className="w-full flex-shrink-0">
                  <div className="bg-gradient-to-br from-orange-900/20 to-red-800/10 rounded-xl p-8 border border-orange-500/20">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                            <Rocket className="w-5 h-5 text-orange-400" />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-white">Software Development Company Fleet</h4>
                            <p className="text-sm text-orange-400">85 Agents • $150,000 enterprise license</p>
                          </div>
                        </div>
                        <p className="text-gray-300 mb-4">
                          A complete software development company with 85 agents handling everything from requirements 
                          to deployment, testing, and customer support. Built by TechBuilder Pro, earning $900K/year from 6 Fortune 500 clients.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-orange-400" />
                            <span className="text-sm text-gray-300">Frontend & Backend Development (35 agents)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-orange-400" />
                            <span className="text-sm text-gray-300">DevOps, Testing & QA (25 agents)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-orange-400" />
                            <span className="text-sm text-gray-300">Project Management & Support (25 agents)</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-600">
                        <div className="text-center text-gray-400 mb-4">
                          <Rocket className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm">Development Company Dashboard</p>
                        </div>
                        <div className="space-y-3 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Features Shipped</span>
                            <span className="text-green-400">127 this month</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Tests Automated</span>
                            <span className="text-blue-400">1,847 passed</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Deployments</span>
                            <span className="text-purple-400">43 successful</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Issues Resolved</span>
                            <span className="text-yellow-400">189 auto-fixed</span>
                          </div>
                          <div className="bg-gradient-to-r from-orange-900/50 to-red-900/50 rounded p-2 mt-3">
                            <div className="text-orange-400 font-semibold">Entire Dev Company</div>
                            <div className="text-gray-300">Developers, DevOps Engineers, QA Testers, Project Managers, Architects, UX/UI Designers, Technical Writers, Support Staff</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Carousel Navigation */}
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    currentSlide === index ? 'bg-emerald-500' : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Creator Economy & Use Cases Section */}
      <div className="py-20 bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">From Single Agents to Complete Company Automation</h3>
            <p className="text-gray-400 text-lg">Create individual AI agents or build entire Fleets that can mimic whole companies and departments</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-400 mb-2">2.5K+</div>
              <div className="text-gray-400">Agents Deployed</div>
              <div className="text-sm text-gray-500">Across all Fleets</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">100+</div>
              <div className="text-gray-400">Creators</div>
              <div className="text-sm text-gray-500">Earning monthly</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">$500K+</div>
              <div className="text-gray-400">Creator Revenue</div>
              <div className="text-sm text-gray-500">Per month</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">100+</div>
              <div className="text-gray-400">Enterprise Fleets</div>
              <div className="text-sm text-gray-500">In production</div>
            </div>
          </div>

          {/* Use Cases & Monetization */}
          <div className="mt-16">
            <h4 className="text-xl font-semibold text-white mb-8 text-center">Start with Single Agents, Scale to Complete Company Fleets</h4>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Single Agents */}
              <div className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 rounded-xl p-6 border border-emerald-500/20">
                <h5 className="text-lg font-semibold text-emerald-400 mb-4">Individual AI Agents</h5>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Bot className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-white">Email Management Agent</div>
                      <div className="text-xs text-gray-400">Single agent that sorts, responds, and prioritizes emails. Perfect starter project.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-white">Customer Support Agent</div>
                      <div className="text-xs text-gray-400">One specialized agent trained on company knowledge for instant support.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-white">Sales Lead Qualifier</div>
                      <div className="text-xs text-gray-400">Individual agent that scores and qualifies incoming leads automatically.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Fleets */}
              <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 rounded-xl p-6 border border-blue-500/20">
                <h5 className="text-lg font-semibold text-blue-400 mb-4">Complete Company Fleets</h5>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-white">Entire Sales Department Fleet</div>
                      <div className="text-xs text-gray-400">30+ agents handling lead gen, qualification, follow-ups, CRM, and closing - like a whole sales team.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Rocket className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-white">Development Company Fleet</div>
                      <div className="text-xs text-gray-400">50+ agents for code review, testing, deployment, project management - mimics a software company.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-white">Marketing Agency Fleet</div>
                      <div className="text-xs text-gray-400">40+ agents for content, social media, ads, analytics, SEO - operates like a full agency.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Model */}
            <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl p-6 border border-purple-500/20">
              <h5 className="text-lg font-semibold text-purple-400 mb-4 text-center">Scale Your Revenue: From $50 Agents to $50K Company Fleets</h5>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bot className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="text-sm font-medium text-white mb-1">Single Agent Sales</div>
                  <div className="text-xs text-gray-400">Sell individual agents for $50-$500 each</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="text-sm font-medium text-white mb-1">Department Fleets</div>
                  <div className="text-xs text-gray-400">License 10-30 agent fleets for $5K-$15K</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Trophy className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="text-sm font-medium text-white mb-1">Company-Wide Fleets</div>
                  <div className="text-xs text-gray-400">50+ agent fleets mimicking entire companies for $25K-$100K+</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Contributor Section */}
      <div className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-white mb-4">Want to Contribute?</h3>
            <p className="text-gray-400 text-lg">Join our team of developers building the future of AI agent platforms</p>
          </div>

          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white">Developer Application</CardTitle>
              <CardDescription className="text-gray-400">
                Help us build the most advanced AI agent platform. Submit your application and we'll be in touch.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContributorApplication} className="space-y-6">
                <div>
                  <label htmlFor="contributor-email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <Input
                    id="contributor-email"
                    type="email"
                    placeholder="your@email.com"
                    value={contributorEmail}
                    onChange={(e) => setContributorEmail(e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="github" className="block text-sm font-medium text-gray-300 mb-2">
                    GitHub Username
                  </label>
                  <Input
                    id="github"
                    type="text"
                    placeholder="github-username"
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="motivation" className="block text-sm font-medium text-gray-300 mb-2">
                    Why do you want to contribute to AI Nomads?
                  </label>
                  <Textarea
                    id="motivation"
                    placeholder="Tell us about your experience, what interests you about AI agents, and how you'd like to contribute..."
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 min-h-[120px]"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmittingApplication}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                >
                  {isSubmittingApplication ? "Submitting..." : "Submit Application"}
                </Button>
              </form>

              <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
                <h4 className="font-semibold text-emerald-400 mb-2">What we're looking for:</h4>
                <div className="space-y-1 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span className="font-semibold text-red-400">Most important: Resilience - people who don't give up</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span className="font-semibold text-red-400">We don't care how you get the job done, as long as you get it done</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Full-stack developers (React, Node.js, TypeScript)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>AI/ML engineers with LLM experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Vibe coding enthusiasts who ship fast and iterate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Prompt engineering specialists for AI agent optimization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>DevOps specialists (Docker, Kubernetes, cloud platforms)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Product designers with enterprise software experience</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}