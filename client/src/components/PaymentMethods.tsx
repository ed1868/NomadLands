import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Wallet, Smartphone, Plus, Check } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface PaymentMethod {
  id: number;
  type: string;
  provider: string;
  isDefault: boolean;
  cardLast4?: string;
  cardBrand?: string;
  cryptoWalletAddress?: string;
}

export default function PaymentMethods() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string>("");

  // Fetch payment methods
  const { data: paymentMethods = [], isLoading } = useQuery({
    queryKey: ["/api/payment-methods"],
  });

  // Add payment method mutation
  const addPaymentMethodMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/payment-methods", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payment-methods"] });
      setShowAddForm(false);
      toast({
        title: "Payment Method Added",
        description: "Your payment method has been added successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add payment method",
        variant: "destructive",
      });
    },
  });

  // Set default payment method mutation
  const setDefaultMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("PATCH", `/api/payment-methods/${id}/default`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payment-methods"] });
      toast({
        title: "Default Updated",
        description: "Default payment method updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update default payment method",
        variant: "destructive",
      });
    },
  });

  const handleAddPaymentMethod = (formData: FormData) => {
    const provider = selectedProvider;
    let type = "card";
    let providerData: any = {};

    if (provider === "stripe") {
      type = "stripe_card";
      providerData = {
        card: {
          number: formData.get("cardNumber"),
          exp_month: formData.get("expMonth"),
          exp_year: formData.get("expYear"),
          cvc: formData.get("cvc"),
        },
      };
    } else if (provider === "paypal") {
      type = "paypal";
      providerData = {
        accountId: formData.get("paypalEmail"),
      };
    } else if (provider === "crypto") {
      type = "crypto_wallet";
      providerData = {
        walletAddress: formData.get("walletAddress"),
      };
    }

    addPaymentMethodMutation.mutate({
      type,
      provider,
      providerData,
    });
  };

  const getPaymentMethodIcon = (provider: string, type: string) => {
    switch (provider) {
      case "stripe":
        return <CreditCard className="h-5 w-5" />;
      case "paypal":
        return <Wallet className="h-5 w-5 text-blue-600" />;
      case "apple":
        return <Smartphone className="h-5 w-5" />;
      case "crypto":
        return <Wallet className="h-5 w-5 text-orange-500" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const formatPaymentMethodDisplay = (method: PaymentMethod) => {
    if (method.provider === "stripe" && method.cardLast4) {
      return `${method.cardBrand?.toUpperCase()} •••• ${method.cardLast4}`;
    } else if (method.provider === "paypal") {
      return "PayPal Account";
    } else if (method.provider === "crypto" && method.cryptoWalletAddress) {
      return `${method.cryptoWalletAddress.slice(0, 6)}...${method.cryptoWalletAddress.slice(-4)}`;
    }
    return `${method.provider} ${method.type}`;
  };

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Payment Methods</h2>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Payment Method
        </Button>
      </div>

      {/* Existing Payment Methods */}
      <div className="grid gap-4">
        {paymentMethods.length === 0 ? (
          <Card className="p-8 text-center border-dashed">
            <div className="text-muted-foreground">
              <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No payment methods added yet</p>
              <p className="text-sm">Add a payment method to start purchasing agents and subscriptions</p>
            </div>
          </Card>
        ) : (
          paymentMethods.map((method: PaymentMethod) => (
            <Card key={method.id} className="relative">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getPaymentMethodIcon(method.provider, method.type)}
                    <div>
                      <p className="font-medium">{formatPaymentMethodDisplay(method)}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {method.provider} {method.type.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {method.isDefault && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Default
                      </Badge>
                    )}
                    {!method.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDefaultMutation.mutate(method.id)}
                        disabled={setDefaultMutation.isPending}
                      >
                        Set Default
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add Payment Method Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Provider Selection */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: "stripe", name: "Credit Card", icon: CreditCard },
                { id: "paypal", name: "PayPal", icon: Wallet },
                { id: "apple", name: "Apple Pay", icon: Smartphone },
                { id: "crypto", name: "Crypto Wallet", icon: Wallet },
              ].map(({ id, name, icon: Icon }) => (
                <Button
                  key={id}
                  variant={selectedProvider === id ? "default" : "outline"}
                  className="h-16 flex-col gap-2"
                  onClick={() => setSelectedProvider(id)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs">{name}</span>
                </Button>
              ))}
            </div>

            {/* Provider-specific forms */}
            {selectedProvider && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddPaymentMethod(new FormData(e.currentTarget));
                }}
                className="space-y-4"
              >
                {selectedProvider === "stripe" && (
                  <>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="expMonth">Month</Label>
                          <Input
                            id="expMonth"
                            name="expMonth"
                            placeholder="MM"
                            maxLength={2}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="expYear">Year</Label>
                          <Input
                            id="expYear"
                            name="expYear"
                            placeholder="YY"
                            maxLength={2}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvc">CVC</Label>
                          <Input
                            id="cvc"
                            name="cvc"
                            placeholder="123"
                            maxLength={4}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {selectedProvider === "paypal" && (
                  <div>
                    <Label htmlFor="paypalEmail">PayPal Email</Label>
                    <Input
                      id="paypalEmail"
                      name="paypalEmail"
                      type="email"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                )}

                {selectedProvider === "crypto" && (
                  <div>
                    <Label htmlFor="walletAddress">Wallet Address</Label>
                    <Input
                      id="walletAddress"
                      name="walletAddress"
                      placeholder="0x..."
                      required
                    />
                  </div>
                )}

                {selectedProvider === "apple" && (
                  <div className="text-center p-8 border-2 border-dashed rounded-lg">
                    <Smartphone className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">Apple Pay integration coming soon</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={addPaymentMethodMutation.isPending || selectedProvider === "apple"}
                    className="flex-1"
                  >
                    {addPaymentMethodMutation.isPending ? "Adding..." : "Add Payment Method"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setSelectedProvider("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}