import { useEffect, useState } from "react";

import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { isSupabaseConfigured } from "@/lib/env";
import { refreshSessionFromUrl } from "@/services/auth-service";

import { Loader2, Mail, Sparkles } from "lucide-react";

import { AuthLayout } from "@/components/auth/auth-layout";

import { Button } from "@/components/ui/button";

import { useToast } from "@/components/ui/toast";

import { useAuth, useAuthStore } from "@/store/auth-store";

import { useI18n } from "@/hooks/use-i18n";



export default function VerifyEmailPage() {

  const { user, verifyEmail, resendConfirmation } = useAuth();

  const { toast } = useToast();

  const { t } = useI18n();

  const navigate = useNavigate();

  const [params] = useSearchParams();

  const codeFromUrl = params.get("code") ?? params.get("token");

  const [loading, setLoading] = useState(false);

  const [resending, setResending] = useState(false);

  const supabaseMode = isSupabaseConfigured();



  useEffect(() => {

    if (!codeFromUrl || !supabaseMode) return;

    void (async () => {

      setLoading(true);

      const refreshed = await refreshSessionFromUrl();

      if (refreshed?.emailVerified) {

        useAuthStore.getState().setUser(refreshed);

        toast({ title: t("auth.emailConfirmed"), variant: "success" });

        navigate("/app", { replace: true });

        setLoading(false);

        return;

      }

      const result = await verifyEmail(codeFromUrl);

      setLoading(false);

      if (result.ok) {

        toast({ title: t("auth.emailConfirmed"), variant: "success" });

        navigate("/app", { replace: true });

      } else {

        toast({ title: t("auth.invalidLink"), description: result.error, variant: "destructive" });

      }

    })();

  }, [codeFromUrl, supabaseMode, verifyEmail, navigate, toast, t]);



  const confirm = async () => {

    setLoading(true);

    const result = await verifyEmail(codeFromUrl ?? undefined);

    setLoading(false);

    if (!result.ok) {

      toast({ title: t("auth.verificationFailed"), description: result.error, variant: "warning" });

      return;

    }

    toast({

      title: t("auth.emailConfirmed"),

      description: t("auth.welcomeZero"),

      variant: "success",

    });

    navigate("/app", { replace: true });

  };



  const resend = async () => {

    setResending(true);

    const result = await resendConfirmation();

    setResending(false);

    toast({

      title: result.ok ? t("auth.confirmationSent") : t("auth.resendFailed"),

      description: result.ok

        ? t("auth.resendMockDesc", { email: user?.email ?? "" })

        : result.error,

      variant: result.ok ? "success" : "warning",

    });

  };



  return (

    <AuthLayout

      title={t("auth.confirmEmail")}

      subtitle={t("auth.confirmEmailSubtitle")}

      footer={

        <Link to="/login" className="text-primary hover:underline">

          {t("auth.backToSignIn")}

        </Link>

      }

    >

      <div className="space-y-5 text-center">

        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">

          <Mail className="h-7 w-7" />

        </span>

        <p className="text-sm text-muted-foreground">

          {user?.email ? (

            <>

              {t("auth.verifyEmailCheck", { email: user.email })}

            </>

          ) : (

            t("auth.signUpFirst")

          )}

        </p>

        <p className="rounded-xl border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">

          {supabaseMode ? "Check your inbox for the Supabase confirmation link." : t("auth.confirmEmailDemo")}

        </p>

        <Button

          variant="gradient"

          className="w-full"

          disabled={loading || !user}

          onClick={() => void confirm()}

        >

          {loading ? (

            <Loader2 className="h-4 w-4 animate-spin" />

          ) : (

            <>

              <Sparkles className="h-4 w-4" />

              {supabaseMode ? t("auth.confirmBtn") : t("auth.confirmBtnDemo")}

            </>

          )}

        </Button>

        <Button

          variant="outline"

          className="w-full"

          disabled={resending || !user}

          onClick={() => void resend()}

        >

          {resending ? <Loader2 className="h-4 w-4 animate-spin" /> : t("common.resend")}

        </Button>

      </div>

    </AuthLayout>

  );

}

