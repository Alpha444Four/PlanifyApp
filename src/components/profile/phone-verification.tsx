import { useState } from "react";
import { Loader2, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OtpInput } from "@/components/auth/otp-input";
import { useToast } from "@/components/ui/toast";
import { sendPhoneOtp, verifyPhoneOtp } from "@/services/auth-service";
import { updateProfile } from "@/services/user-service";
import { useAuthStore } from "@/store/auth-store";
import { isSupabaseConfigured } from "@/lib/env";

export function PhoneVerificationCard() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const { toast } = useToast();
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"idle" | "sent">("idle");
  const [loading, setLoading] = useState(false);

  if (!user || !isSupabaseConfigured()) return null;

  const sendOtp = async () => {
    if (!phone.trim()) {
      toast({ title: "Enter a phone number", variant: "warning" });
      return;
    }
    setLoading(true);
    await updateProfile(user.id, { phone: phone.trim() });
    const result = await sendPhoneOtp(phone.trim());
    setLoading(false);
    if (!result.ok) {
      toast({ title: "OTP failed", description: result.error, variant: "destructive" });
      return;
    }
    setStep("sent");
    toast({ title: "Code sent", description: "Check your SMS inbox.", variant: "success" });
  };

  const verify = async () => {
    if (otp.length < 6) return;
    setLoading(true);
    const result = await verifyPhoneOtp(phone.trim(), otp, user.id);
    setLoading(false);
    if (!result.ok) {
      toast({ title: "Invalid code", description: result.error, variant: "destructive" });
      return;
    }
    const updated = await updateProfile(user.id, { phoneVerified: true, phone: phone.trim() });
    if (updated) setUser(updated);
    toast({ title: "Phone verified", variant: "success" });
    setStep("idle");
    setOtp("");
  };

  return (
    <Card className="dark:glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Phone className="h-4 w-4" />
          Phone verification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-muted-foreground">
          Requires SMS provider (Twilio/MessageBird) in Supabase → Authentication → Phone.
        </p>
        {user.phoneVerified ? (
          <Badge>Verified {user.phone}</Badge>
        ) : (
          <>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+212600000000"
            />
            {step === "sent" ? (
              <>
                <OtpInput value={otp} onChange={setOtp} disabled={loading} />
                <Button variant="gradient" className="w-full" disabled={loading} onClick={() => void verify()}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify code"}
                </Button>
              </>
            ) : (
              <Button variant="outline" className="w-full" disabled={loading} onClick={() => void sendOtp()}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send OTP"}
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
