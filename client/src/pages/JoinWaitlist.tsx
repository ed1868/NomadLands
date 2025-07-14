import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Zap, Users, Clock, Shield, Sparkles, Bot, Rocket, Trophy } from "lucide-react";

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
          title: "Rush Access Confirmed! ⚡",
          description: "Your wait time has been reduced by 50%. Check your email for confirmation.",
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
  const { toast } = useToast();

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
                You're In! 
              </h1>
              
              <p className="text-xl text-gray-300 mb-6">
                Welcome to the AI Nomads waitlist. You're position #{waitlistPosition}.
              </p>

              <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-emerald-400 mb-3">What happens next?</h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-gray-300">We'll send you early access when it's your turn</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-gray-300">Get exclusive updates on new legendary agents</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Bot className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-gray-300">First access to deploy world-class AI agents</span>
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
            {/* Logo */}
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-emerald-400">AI NOMADS</h2>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Built in the shadows.
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Born to disrupt.
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              The most advanced AI agent marketplace where legendary agents are forged. 
              Deploy world-class automation in minutes, not months.
            </p>

            <div className="flex items-center justify-center gap-8 mb-12">
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 px-4 py-2">
                <Zap className="w-4 h-4 mr-2" />
                Instant Deploy
              </Badge>
              <Badge variant="outline" className="border-blue-500/30 text-blue-400 px-4 py-2">
                <Rocket className="w-4 h-4 mr-2" />
                Enterprise Ready
              </Badge>
              <Badge variant="outline" className="border-purple-500/30 text-purple-400 px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Zero Code
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

            {/* Features Preview */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-6">What You'll Get</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gray-900/30 rounded-lg border border-gray-700/50">
                  <Bot className="w-6 h-6 text-emerald-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white">Legendary AI Agents</h4>
                    <p className="text-gray-400 text-sm">Deploy agents built like warriors for email, sales, development, and more</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-900/30 rounded-lg border border-gray-700/50">
                  <Zap className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white">Instant Deployment</h4>
                    <p className="text-gray-400 text-sm">From idea to production in minutes with zero-code setup</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-900/30 rounded-lg border border-gray-700/50">
                  <Rocket className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white">Enterprise Ready</h4>
                    <p className="text-gray-400 text-sm">Built for scale with enterprise security and compliance</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-900/30 rounded-lg border border-gray-700/50">
                  <Users className="w-6 h-6 text-emerald-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white">Creator Economy</h4>
                    <p className="text-gray-400 text-sm">Build once, earn forever. Your agents work while you sleep</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-gray-900/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold text-white mb-12">Join the Revolution</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold text-emerald-400 mb-2">10,000+</div>
              <div className="text-gray-400">Agents Deployed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">500+</div>
              <div className="text-gray-400">Enterprise Clients</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-2">99.9%</div>
              <div className="text-gray-400">Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-400 mb-2">24/7</div>
              <div className="text-gray-400">Agent Operations</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}