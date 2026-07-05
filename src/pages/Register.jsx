import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Mail, Lock, Loader2, MapPin, User, ArrowRight, ArrowLeft, Check, Phone, ShieldCheck } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";
import { toast } from "@/components/ui/use-toast";

const CAUSES = ['Companionship', 'Food', 'Home', 'Skills Sharing', 'Technology', 'Transportation', 'Other'];
const CAUSE_EMOJI = { 'Companionship': '\u{1F91D}', 'Food': '\u{1F372}', 'Home': '\u{1F3E0}', 'Skills Sharing': '\u{1F4DA}', 'Technology': '\u{1F4BB}', 'Transportation': '\u{1F697}', 'Other': '\u{1F4A1}' };

export default function Register() {
  const [step, setStep] = useState(1); // 1: account, 2: profile, 3: terms, 4: otp
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCauses, setSelectedCauses] = useState([]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const handleRegister = async () => {
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await base44.auth.register({ email, password });
      setStep(4);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await base44.auth.verifyOtp({ email, otpCode });
      if (result?.access_token) {
        base44.auth.setToken(result.access_token);
      }
      try {
        const me = await base44.auth.me();
        if (name) await base44.auth.updateMe({ full_name: name });
        await base44.entities.VolunteerProfile.create({
          user_id: me.id,
          location,
          phone,
          causes: selectedCauses,
          total_hours: 0,
          events_attended: 0,
          opportunities_completed: 0,
          followers: [],
          following: [],
        });
      } catch {
        // best-effort
      }
      window.location.href = "/";
    } catch (err) {
      setError(err.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      await base44.auth.resendOtp(email);
      toast({ title: "Code sent", description: "Check your email for the new code." });
    } catch (err) {
      setError(err.message || "Failed to resend code");
    }
  };

  const handleGoogle = () => {
    base44.auth.loginWithProvider("google", window.location.origin + "/");
  };

  // Step indicator
  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-6">
      {[1, 2, 3, 4].map((s) => (
        <div key={s} className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
            step > s ? 'bg-primary text-primary-foreground' :
            step === s ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' :
            'bg-muted text-muted-foreground'
          }`}>
            {step > s ? <Check className="w-4 h-4" /> : s}
          </div>
          {s < 4 && <div className={`w-6 h-0.5 ${step > s ? 'bg-primary' : 'bg-muted'}`} />}
        </div>
      ))}
    </div>
  );

  // Step 4: OTP
  if (step === 4) {
    return (
      <AuthLayout icon={Mail} title="Verify your email" subtitle={`We sent a code to ${email}`}>
        <StepIndicator />
        {error && <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
        <div className="flex justify-center mb-6">
          <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode} autoFocus autoComplete="one-time-code">
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button className="w-full h-12 font-medium" onClick={handleVerify} disabled={loading || otpCode.length < 6}>
          {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Verifying...</> : "Verify & Join"}
        </Button>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Did not receive the code?{" "}
          <button onClick={handleResend} className="text-primary font-medium hover:underline">Resend</button>
        </p>
      </AuthLayout>
    );
  }

  // Step 3: Terms & Conditions
  if (step === 3) {
    return (
      <AuthLayout
        icon={ShieldCheck}
        title="Terms & Conditions"
        subtitle="Please review and accept to complete your registration"
        footer={<>Already have an account?{" "}<Link to="/login" className="text-primary font-medium hover:underline">Log in</Link></>}
      >
        <StepIndicator />
        {error && <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
        <div className="space-y-5">
          <div className="rounded-xl border border-border bg-muted/30 p-5 max-h-60 overflow-y-auto text-sm text-muted-foreground space-y-3">
            <div>
              <p className="font-semibold text-foreground mb-1">1. Community Guidelines</p>
              <p>Circles of Giving is a community built on mutual respect. Members must treat each other with kindness and dignity. Harassment, discrimination, or abusive behavior will result in account termination.</p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">2. Privacy & Data</p>
              <p>Your personal information (name, email, phone, location) is used to connect you with volunteering opportunities and community members. We do not sell your data to third parties. Your phone number may be used for WhatsApp group coordination.</p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">3. Volunteering & Liability</p>
              <p>Volunteering activities are undertaken at your own risk. Circles of Giving facilitates connections but is not liable for interactions between members. Always exercise reasonable caution when meeting new people.</p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">4. Content & Conduct</p>
              <p>You are responsible for all content you post. Prohibited content includes spam, illegal activities, commercial solicitation, and false information. Moderators may remove content that violates these terms.</p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">5. Account Termination</p>
              <p>We reserve the right to suspend or terminate accounts that violate these terms. You may delete your account at any time by contacting support.</p>
            </div>
          </div>

          <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-border hover:border-primary/40 transition-colors">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 w-5 h-5 rounded border-border accent-primary"
            />
            <span className="text-sm text-muted-foreground">
              I have read and agree to the{" "}
              <Link to="/terms" className="text-primary font-medium hover:underline">Terms of Use</Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-primary font-medium hover:underline">Privacy Policy</Link>.
            </span>
          </label>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="h-12" onClick={() => { setError(""); setStep(2); }}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <Button
              className="flex-1 h-12 font-medium"
              onClick={handleRegister}
              disabled={loading || !agreedToTerms}
            >
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating account...</> : <>Create account <ArrowRight className="w-4 h-4 ml-1" /></>}
            </Button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // Step 2: Profile (optional)
  if (step === 2) {
    return (
      <AuthLayout
        icon={UserPlus}
        title="Tell us about you"
        subtitle="Help us match you with the right opportunities"
        footer={<>Already have an account?{" "}<Link to="/login" className="text-primary font-medium hover:underline">Log in</Link></>}
      >
        <StepIndicator />
        {error && <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="location">Your Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="location" placeholder="City or region" value={location} onChange={(e) => setLocation(e.target.value)} className="pl-10 h-12" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number <span className="text-xs text-muted-foreground">(required, for WhatsApp groups)</span></Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="phone" type="tel" placeholder="+972-50-123-4567" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10 h-12" required />
            </div>
          </div>

          <div className="space-y-3">
            <Label>What causes do you care about?</Label>
            <div className="grid grid-cols-2 gap-2">
              {CAUSES.map((cause) => {
                const active = selectedCauses.includes(cause);
                return (
                  <button
                    key={cause}
                    type="button"
                    onClick={() => setSelectedCauses((prev) => prev.includes(cause) ? prev.filter((c) => c !== cause) : [...prev, cause])}
                    className={`flex items-center gap-2 text-sm px-3 py-2.5 rounded-xl border transition-all text-left ${
                      active ? "bg-primary/10 text-primary border-primary font-medium" : "bg-card text-muted-foreground border-border hover:border-primary/40"
                    }`}
                  >
                    <span>{CAUSE_EMOJI[cause]}</span>
                    <span>{cause}</span>
                    {active && <Check className="w-3.5 h-3.5 ml-auto" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="h-12" onClick={() => { setError(""); setStep(1); }}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <Button className="flex-1 h-12 font-medium" onClick={() => { if (!phone.trim()) { setError("Phone number is required"); return; } setError(""); setStep(3); }}>
              Continue <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <button
            type="button"
            onClick={() => { if (!phone.trim()) { setError("Phone number is required"); return; } setError(""); setStep(3); }}
            className="w-full text-center text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            Skip for now
          </button>
        </div>
      </AuthLayout>
    );
  }

  // Step 1: Account basics
  return (
    <AuthLayout
      icon={UserPlus}
      title="Join the Circle"
      subtitle="Create your account to start giving & receiving"
      footer={<>Already have an account?{" "}<Link to="/login" className="text-primary font-medium hover:underline">Log in</Link></>}
    >
      <StepIndicator />

      <Button variant="outline" className="w-full h-12 text-sm font-medium mb-5" onClick={handleGoogle}>
        <GoogleIcon className="w-5 h-5 mr-2" />
        Continue with Google
      </Button>

      <div className="relative mb-5">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-3 text-muted-foreground">or</span></div>
      </div>

      {error && <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}

      <form
        onSubmit={(e) => { e.preventDefault(); setError(""); setStep(2); }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="name" autoComplete="name" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} className="pl-10 h-12" required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="email" type="email" autoComplete="email" autoFocus placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-12" required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="password" type="password" autoComplete="new-password" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 h-12" required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="confirm" type="password" autoComplete="new-password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10 h-12" required />
          </div>
        </div>

        <Button type="submit" className="w-full h-12 font-medium">
          Continue <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </form>
    </AuthLayout>
  );
}