import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Phone, CheckCircle, Clock, RefreshCw } from "lucide-react";

interface PhoneVerificationProps {
  userId: string;
  phoneNumber: string;
  onVerified: () => void;
}

export default function PhoneVerification({ userId, phoneNumber, onVerified }: PhoneVerificationProps) {
  const [code, setCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [canResend, setCanResend] = useState(false);
  const { toast } = useToast();

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Send verification code on mount
  const sendCodeMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/auth/send-verification", {
        userId,
        phoneNumber,
      });
    },
    onSuccess: () => {
      toast({
        title: "Verification code sent",
        description: "Check your phone for the 6-digit code.",
      });
      setTimeLeft(600);
      setCanResend(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send code",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  // Verify phone code
  const verifyMutation = useMutation({
    mutationFn: async (verificationCode: string) => {
      return await apiRequest("POST", "/api/auth/verify-phone", {
        userId,
        code: verificationCode,
      });
    },
    onSuccess: () => {
      toast({
        title: "Phone verified successfully!",
        description: "Your account is now complete.",
      });
      onVerified();
    },
    onError: (error: any) => {
      toast({
        title: "Verification failed",
        description: error.message || "Invalid code. Please try again.",
        variant: "destructive",
      });
      setCode("");
    },
  });

  // Send initial verification code
  useEffect(() => {
    sendCodeMutation.mutate();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 6) {
      verifyMutation.mutate(code);
    }
  };

  const handleResend = () => {
    sendCodeMutation.mutate();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full max-w-md bg-black/40 border-gray-800 backdrop-blur-sm">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
          <Phone className="w-8 h-8 text-blue-400" />
        </div>
        <CardTitle className="text-2xl text-white">Verify Phone Number</CardTitle>
        <CardDescription className="text-gray-400">
          We've sent a 6-digit code to {phoneNumber}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="code" className="text-gray-300">Verification Code</Label>
            <Input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="bg-gray-900/40 border-gray-700 text-white text-center text-2xl tracking-widest"
              placeholder="000000"
              maxLength={6}
              autoComplete="one-time-code"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the 6-digit code sent to your phone
            </p>
          </div>

          <Button
            type="submit"
            disabled={code.length !== 6 || verifyMutation.isPending}
            className="w-full bg-blue-900/40 border border-blue-700/50 text-blue-300 hover:bg-blue-900/60"
          >
            {verifyMutation.isPending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Verify Phone
              </>
            )}
          </Button>
        </form>

        {/* Timer and Resend */}
        <div className="text-center space-y-2">
          {!canResend ? (
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                Code expires in {formatTime(timeLeft)}
              </span>
            </div>
          ) : (
            <div className="text-sm text-gray-400">
              Didn't receive the code?
            </div>
          )}
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!canResend || sendCodeMutation.isPending}
            onClick={handleResend}
            className="text-gray-400 hover:text-white"
          >
            {sendCodeMutation.isPending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              "Resend Code"
            )}
          </Button>
        </div>

        {/* Security Note */}
        <div className="p-3 bg-gray-900/20 border border-gray-700 rounded-lg">
          <p className="text-xs text-gray-400 text-center">
            Your phone number is used for account security and will not be shared with third parties.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}