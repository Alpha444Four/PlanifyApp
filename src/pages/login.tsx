import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { OAuthButton } from "@/components/auth/oauth-button";
import { PasswordInput } from "@/components/auth/password-input";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/store/auth-store";
import { useI18n } from "@/hooks/use-i18n";
import { zodResolver } from "@/lib/zod-resolver";
import { isSupabaseConfigured } from "@/lib/env";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

type OAuth = "google" | "apple" | null;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { t } = useI18n();
  const { signIn, signInWithGoogle, signInWithApple } = useAuth();
  const [oauthLoading, setOauthLoading] = useState<OAuth>(null);
  const [remember, setRemember] = useState(
    () => localStorage.getItem("planify:remember") === "1",
  );

  const from = (location.state as { from?: { pathname: string } } | null)?.from
    ?.pathname;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: FormValues) => {
    const result = await signIn(values.email, values.password);
    if (result.ok) {
      localStorage.setItem("planify:remember", remember ? "1" : "0");
      toast({ title: t("dashboard.welcomeBack"), variant: "success" });
      navigate(from ?? "/app", { replace: true });
    } else {
      const err = result.error ?? "Invalid email or password";
      toast({ title: t("auth.signInFailed"), description: err, variant: "destructive" });
      if (err.toLowerCase().includes("confirm your email")) {
        navigate("/verify-email", { replace: true });
      }
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
      title={t("auth.welcomeBack")}
      subtitle={t("auth.signInSubtitle")}
      footer={
        <>
          {t("auth.noAccount")}{" "}
          <Link
            to="/signup"
            className="focus-ring rounded font-semibold text-primary hover:underline"
          >
            {t("auth.createOne")}
          </Link>
        </>
      }
    >
      {!isSupabaseConfigured() && (
        <p className="mb-4 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
          Configure Supabase in Vercel for production login.
        </p>
      )}

      <div className="space-y-3">
        <OAuthButton
          provider="google"
          onClick={() => handleOAuth("google")}
          loading={oauthLoading === "google"}
          disabled={busy}
        />
        <OAuthButton
          provider="apple"
          onClick={() => handleOAuth("apple")}
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            {t("auth.email")}
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1.5 text-xs font-medium text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium">
              {t("auth.password")}
            </label>
            <Link
              to="/forgot-password"
              className="focus-ring rounded text-xs font-medium text-primary hover:underline"
            >
              {t("auth.forgotPassword")}
            </Link>
          </div>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="••••••••"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          {errors.password && (
            <p className="mt-1.5 text-xs font-medium text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="rounded border-border"
          />
          Remember me on this device
        </label>

        <Button
          type="submit"
          variant="gradient"
          size="lg"
          className="w-full"
          disabled={busy}
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSubmitting ? t("auth.signingIn") : t("common.signIn")}
        </Button>
      </form>
    </AuthLayout>
  );
}
