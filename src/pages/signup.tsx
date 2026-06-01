import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { AuthLayout } from "@/components/auth/auth-layout";
import { OAuthButton } from "@/components/auth/oauth-button";
import { PasswordInput } from "@/components/auth/password-input";
import { PasswordStrength } from "@/components/auth/password-strength";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/store/auth-store";
import { useI18n } from "@/hooks/use-i18n";
import { zodResolver } from "@/lib/zod-resolver";
import { isSupabaseConfigured } from "@/lib/env";

const schema = z
  .object({
    name: z.string().min(2, "Please enter your full name"),
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    phone: z.string().optional(),
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Za-z]/, "Include a letter")
      .regex(/[0-9]/, "Include a number"),
    confirmPassword: z.string(),
    terms: z.boolean().refine((v) => v === true, { message: "Accept the terms to continue" }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;
type OAuth = "google" | "apple" | null;

export default function SignupPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useI18n();
  const { signUp, signInWithGoogle, signInWithApple } = useAuth();
  const [oauthLoading, setOauthLoading] = useState<OAuth>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const password = watch("password");

  const onSubmit = async (values: FormValues) => {
    const result = await signUp(
      values.name,
      values.email,
      values.password,
      values.phone?.trim() || undefined,
    );
    if (result.ok) {
      window.dispatchEvent(new Event("planify:beta-signup"));
      toast({
        title: t("auth.accountCreated"),
        description: result.needsVerification
          ? t("auth.confirmEmailUnlock")
          : t("auth.welcomeZero"),
        variant: "success",
      });
      navigate(result.needsVerification ? "/verify-email" : "/app", { replace: true });
    } else {
      toast({
        title: t("auth.signUpFailed"),
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    setOauthLoading(provider);
    const action = provider === "google" ? signInWithGoogle : signInWithApple;
    const result = await action();
    setOauthLoading(null);
    if (!result.ok) {
      toast({
        title: `${provider === "google" ? "Google" : "Apple"} sign in failed`,
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const busy = isSubmitting || oauthLoading !== null;

  return (
    <AuthLayout
      title={t("auth.createAccount")}
      subtitle={t("auth.signUpSubtitle")}
      footer={
        <>
          {t("auth.haveAccount")}{" "}
          <Link to="/login" className="focus-ring rounded font-semibold text-primary hover:underline">
            {t("common.signIn")}
          </Link>
        </>
      }
    >
      {!isSupabaseConfigured() && (
        <p className="mb-4 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
          Add Supabase env vars in Vercel for production auth (see DEPLOY.md).
        </p>
      )}

      <div className="space-y-3">
        <OAuthButton
          provider="google"
          onClick={() => void handleOAuth("google")}
          loading={oauthLoading === "google"}
          disabled={busy}
        />
        <OAuthButton
          provider="apple"
          onClick={() => void handleOAuth("apple")}
          loading={oauthLoading === "apple"}
          disabled={busy}
        />
      </div>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {t("common.or")}
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <motion.form
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
            {t("auth.fullName")}
          </label>
          <Input id="name" autoComplete="name" aria-invalid={!!errors.name} {...register("name")} />
          {errors.name && <p className="mt-1.5 text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            {t("auth.email")}
          </label>
          <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
          {errors.email && <p className="mt-1.5 text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">
            Phone <span className="text-muted-foreground">(optional)</span>
          </label>
          <Input id="phone" type="tel" placeholder="+212600000000" {...register("phone")} />
          <p className="mt-1 text-[11px] text-muted-foreground">
            OTP verification in profile. Requires Twilio/MessageBird in Supabase.
          </p>
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
            {t("auth.password")}
          </label>
          <PasswordInput id="password" autoComplete="new-password" aria-invalid={!!errors.password} {...register("password")} />
          <PasswordStrength password={password} />
          {errors.password && <p className="mt-1.5 text-xs text-destructive">{errors.password.message}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium">
            Confirm password
          </label>
          <PasswordInput id="confirmPassword" autoComplete="new-password" {...register("confirmPassword")} />
          {errors.confirmPassword && (
            <p className="mt-1.5 text-xs text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" className="mt-1 rounded border-border" {...register("terms")} />
          <span className="text-muted-foreground">
            I agree to the Terms of Service and Privacy Policy
          </span>
        </label>
        {errors.terms && <p className="text-xs text-destructive">{errors.terms.message}</p>}

        <Button type="submit" variant="gradient" size="lg" className="w-full" disabled={busy}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSubmitting ? t("auth.signingUp") : t("auth.createAccount")}
        </Button>
      </motion.form>
    </AuthLayout>
  );
}
