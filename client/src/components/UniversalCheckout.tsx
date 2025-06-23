import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Wallet, Smartphone, Bitcoin, DollarSign } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import PayPalButton from "./PayPalButton";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "");

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  type: "agent" | "subscription" | "contract";
  description?: string;
}

interface UniversalCheckoutProps {
  items: CheckoutItem[];
  onSuccess?: (paymentData: any) => void;
  onCancel?: () => void;
}

const CheckoutForm: React.FC<{ items: CheckoutItem[]; paymentMethod: string; onSuccess?: (data: any) => void }> = ({
  items,
  paymentMethod,
  onSuccess,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);
  const [cryptoAmount, setCryptoAmount] = useState("");
  const [cryptoWallet, setCryptoWallet] = useState("");

  const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

  // Create payment intent mutation
  const createPaymentIntentMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/create-payment-intent", {
        amount: totalAmount,
        currency: "usd",
      });
    },
  });

  // Purchase agent mutation
  const purchaseAgentMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/purchase-agent", data);
    },
    onSuccess: (data) => {
      toast({
        title: "Purchase Successful",
        description: "Your agent has been purchased successfully!",
      });
      onSuccess?.(data);
    },
    onError: (error: any) => {
      toast({
        title: "Purchase Failed",
        description: error.message || "Failed to purchase agent",
        variant: "destructive",
      });
    },
  });

  // Create subscription mutation
  const createSubscriptionMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/subscriptions", data);
    },
    onSuccess: (data) => {
      toast({
        title: "Subscription Created",
        description: "Your subscription has been activated successfully!",
      });
      onSuccess?.(data);
    },
    onError: (error: any) => {
      toast({
        title: "Subscription Failed",
        description: error.message || "Failed to create subscription",
        variant: "destructive",
      });
    },
  });

  // Crypto exchange mutation
  const cryptoExchangeMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/crypto/exchange", data);
    },
    onSuccess: (data) => {
      toast({
        title: "Crypto Exchange Initiated",
        description: "Your crypto exchange is being processed.",
      });
      onSuccess?.(data);
    },
    onError: (error: any) => {
      toast({
        title: "Exchange Failed",
        description: error.message || "Failed to process crypto exchange",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setProcessing(true);

    try {
      if (paymentMethod === "stripe") {
        if (!stripe || !elements) {
          throw new Error("Stripe not loaded");
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          throw new Error("Card element not found");
        }

        // Create payment intent
        const { clientSecret } = await createPaymentIntentMutation.mutateAsync();

        // Confirm payment
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
          },
        });

        if (error) {
          throw new Error(error.message);
        }

        if (paymentIntent?.status === "succeeded") {
          // Process purchase based on item type
          const item = items[0]; // Assuming single item for now
          if (item.type === "agent") {
            await purchaseAgentMutation.mutateAsync({
              agentId: parseInt(item.id),
              paymentMethodId: 1, // Default payment method
            });
          } else if (item.type === "subscription") {
            await createSubscriptionMutation.mutateAsync({
              planCode: item.id,
              paymentMethodId: 1,
              billingCycle: "monthly",
            });
          }
        }
      } else if (paymentMethod === "crypto") {
        // Handle crypto payment
        await cryptoExchangeMutation.mutateAsync({
          fromCurrency: "USD",
          toCurrency: "ETH",
          fromAmount: totalAmount.toString(),
        });
      }
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || "Payment processing failed",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Method Specific Forms */}
      {paymentMethod === "stripe" && (
        <div className="space-y-4">
          <Label>Card Information</Label>
          <div className="p-4 border rounded-md">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      )}

      {paymentMethod === "paypal" && (
        <div className="space-y-4">
          <PayPalButton
            amount={totalAmount.toString()}
            currency="USD"
            intent="capture"
          />
        </div>
      )}

      {paymentMethod === "apple" && (
        <div className="text-center p-8 border-2 border-dashed rounded-lg">
          <Smartphone className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">Apple Pay integration coming soon</p>
        </div>
      )}

      {paymentMethod === "crypto" && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="cryptoWallet">Wallet Address</Label>
            <Input
              id="cryptoWallet"
              value={cryptoWallet}
              onChange={(e) => setCryptoWallet(e.target.value)}
              placeholder="0x..."
              required
            />
          </div>
          <div>
            <Label htmlFor="cryptoAmount">Amount (ETH)</Label>
            <Input
              id="cryptoAmount"
              value={cryptoAmount}
              onChange={(e) => setCryptoAmount(e.target.value)}
              placeholder="0.001"
              type="number"
              step="0.0001"
              required
            />
          </div>
          <div className="text-sm text-muted-foreground">
            Exchange rate: 1 ETH = $2,500 USD (estimated)
          </div>
        </div>
      )}

      {/* Submit Button */}
      {paymentMethod !== "paypal" && (
        <Button
          type="submit"
          disabled={processing || !stripe || paymentMethod === "apple"}
          className="w-full"
          size="lg"
        >
          {processing ? "Processing..." : `Pay $${totalAmount.toFixed(2)}`}
        </Button>
      )}
    </form>
  );
};

export default function UniversalCheckout({ items, onSuccess, onCancel }: UniversalCheckoutProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("stripe");
  const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

  const paymentMethods = [
    {
      id: "stripe",
      name: "Credit/Debit Card",
      icon: CreditCard,
      description: "Visa, Mastercard, American Express",
      enabled: true,
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: Wallet,
      description: "Pay with your PayPal account",
      enabled: true,
    },
    {
      id: "apple",
      name: "Apple Pay",
      icon: Smartphone,
      description: "Touch ID or Face ID",
      enabled: false,
    },
    {
      id: "crypto",
      name: "Cryptocurrency",
      icon: Bitcoin,
      description: "ETH, BTC, and more",
      enabled: true,
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{item.name}</p>
                {item.description && (
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                )}
                <Badge variant="outline" className="text-xs">
                  {item.type}
                </Badge>
              </div>
              <p className="font-semibold">${item.price.toFixed(2)}</p>
            </div>
          ))}
          <Separator />
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedPaymentMethod === method.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  } ${!method.enabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => method.enabled && setSelectedPaymentMethod(method.id)}
                >
                  <RadioGroupItem value={method.id} disabled={!method.enabled} />
                  <method.icon className="h-5 w-5" />
                  <div className="flex-1">
                    <p className="font-medium flex items-center gap-2">
                      {method.name}
                      {!method.enabled && <Badge variant="secondary">Coming Soon</Badge>}
                    </p>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Elements stripe={stripePromise}>
            <CheckoutForm
              items={items}
              paymentMethod={selectedPaymentMethod}
              onSuccess={onSuccess}
            />
          </Elements>
        </CardContent>
      </Card>

      {/* Cancel Button */}
      {onCancel && (
        <Button variant="outline" onClick={onCancel} className="w-full">
          Cancel
        </Button>
      )}
    </div>
  );
}