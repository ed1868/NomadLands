import { useState } from "react";
import { useWallet } from "@/hooks/use-wallet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Phone, Shield, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function PhoneVerification() {
  const { address } = useWallet();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);

  const { data: userProfile } = useQuery({
    queryKey: [`/api/auth/user/${address}`],
    enabled: !!address,
  });

  const sendCodeMutation = useMutation({
    mutationFn: async ({ phoneNumber }: { phoneNumber: string }) => {
      const response = await fetch(`/api/user/${address}/send-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to send verification code");
      }
      return response.json();
    },
    onSuccess: () => {
      setIsCodeSent(true);
      toast({
        title: "Verification Code Sent",
        description: "Check your phone for the 6-digit verification code.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send verification code",
        variant: "destructive",
      });
    },
  });

  const verifyCodeMutation = useMutation({
    mutationFn: async ({ code }: { code: string }) => {
      const response = await fetch(`/api/user/${address}/verify-phone`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to verify phone");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/auth/user/${address}`] });
      toast({
        title: "Phone Verified",
        description: "Your phone number has been successfully verified!",
      });
      setIsCodeSent(false);
      setPhoneNumber("");
      setVerificationCode("");
    },
    onError: (error: any) => {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid or expired verification code",
        variant: "destructive",
      });
    },
  });

  const handleSendCode = () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Phone Required",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }
    sendCodeMutation.mutate({ phoneNumber });
  };

  const handleVerifyCode = () => {
    if (!verificationCode.trim() || verificationCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit verification code",
        variant: "destructive",
      });
      return;
    }
    verifyCodeMutation.mutate({ code: verificationCode });
  };

  if ((userProfile as any)?.phoneVerified) {
    return (
      <Card className="bg-black/40 border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-200 font-light flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-emerald-400" />
            Phone Verified
          </CardTitle>
          <CardDescription className="text-gray-400 font-extralight">
            Your phone number is verified and secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">{(userProfile as any)?.phoneNumber}</span>
            <Badge className="bg-emerald-900/40 text-emerald-400 border-emerald-700">
              Verified
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/40 border-gray-800">
      <CardHeader>
        <CardTitle className="text-gray-200 font-light flex items-center">
          <Phone className="w-5 h-5 mr-2" />
          Phone Verification
        </CardTitle>
        <CardDescription className="text-gray-400 font-extralight">
          Secure your account with phone number verification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isCodeSent ? (
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm font-extralight mb-2 block">
                Phone Number
              </label>
              <Input
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="bg-black/20 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-emerald-600"
              />
            </div>
            <Button
              onClick={handleSendCode}
              disabled={sendCodeMutation.isPending}
              className="w-full sm:w-auto bg-emerald-900/80 hover:bg-emerald-800/90 text-gray-200 border border-emerald-700/50"
            >
              <Shield className="w-4 h-4 mr-2" />
              {sendCodeMutation.isPending ? "Sending..." : "Send Verification Code"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm font-extralight mb-2 block">
                Verification Code
              </label>
              <Input
                type="text"
                placeholder="123456"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                className="bg-black/20 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-emerald-600"
              />
              <p className="text-gray-500 text-xs mt-1 font-extralight">
                Enter the 6-digit code sent to {phoneNumber}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={handleVerifyCode}
                disabled={verifyCodeMutation.isPending}
                className="bg-emerald-900/80 hover:bg-emerald-800/90 text-gray-200 border border-emerald-700/50"
              >
                {verifyCodeMutation.isPending ? "Verifying..." : "Verify Code"}
              </Button>
              <Button
                onClick={() => {
                  setIsCodeSent(false);
                  setVerificationCode("");
                }}
                variant="outline"
                className="border-gray-700 text-gray-400 hover:text-gray-200"
              >
                Change Number
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}