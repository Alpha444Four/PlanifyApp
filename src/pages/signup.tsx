import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

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

import { useRealApi } from "@/lib/env";



const mockSchema = z.object({

  name: z.string().min(2, "Please enter your name"),

  email: z.string().min(1, "Email is required").email("Enter a valid email address"),

  password: z.string().min(6, "Password must be at least 6 characters"),

});



const apiSchema = z.object({

  name: z.string().min(2, "Please enter your name"),

  email: z.string().min(1, "Email is required").email("Enter a valid email address"),

  password: z

    .string()

    .min(8, "Password must be at least 8 characters")

    .regex(/[A-Za-z]/, "Include at least one letter")

    .regex(/[0-9]/, "Include at least one number"),

});



type FormValues = z.infer<typeof mockSchema>;



type OAuth = "google" | "apple" | null;



export default function SignupPage() {

  const navigate = useNavigate();

  const { toast } = useToast();

  const { t } = useI18n();

  const { signUp, signInWithGoogle, signInWithApple } = useAuth();

  const [oauthLoading, setOauthLoading] = useState<OAuth>(null);

  const schema = useRealApi() ? apiSchema : mockSchema;



  const {

    register,

    handleSubmit,

    formState: { errors, isSubmitting },

  } = useForm<FormValues>({

    resolver: zodResolver(schema),

    defaultValues: { name: "", email: "", password: "" },

  });



  const onSubmit = async (values: FormValues) => {

    const result = await signUp(values.name, values.email, values.password);

    if (result.ok) {

      window.dispatchEvent(new Event("planify:beta-signup"));

      toast({

        title: t("auth.accountCreated"),

        description: t("auth.confirmEmailUnlock"),

        variant: "success",

      });

      navigate("/verify-email", { replace: true });

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

    if (result.ok) {

      toast({ title: t("auth.signedIn"), variant: "success" });

      navigate("/app", { replace: true });

    } else {

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

          <Link

            to="/login"

            className="focus-ring rounded font-semibold text-primary hover:underline"

          >

            {t("common.signIn")}

          </Link>

        </>

      }

    >

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

          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">

            {t("auth.fullName")}

          </label>

          <Input

            id="name"

            type="text"

            autoComplete="name"

            placeholder="Alex Rivera"

            aria-invalid={!!errors.name}

            {...register("name")}

          />

          {errors.name && (

            <p className="mt-1.5 text-xs font-medium text-destructive">

              {errors.name.message}

            </p>

          )}

        </div>



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

          <label htmlFor="password" className="mb-1.5 block text-sm font-medium">

            {t("auth.password")}

          </label>

          <PasswordInput

            id="password"

            autoComplete="new-password"

            placeholder="At least 6 characters"

            aria-invalid={!!errors.password}

            {...register("password")}

          />

          {errors.password && (

            <p className="mt-1.5 text-xs font-medium text-destructive">

              {errors.password.message}

            </p>

          )}

        </div>



        <Button

          type="submit"

          variant="gradient"

          size="lg"

          className="w-full"

          disabled={busy}

        >

          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}

          {isSubmitting ? t("auth.signingUp") : t("auth.createAccount")}

        </Button>

      </form>

    </AuthLayout>

  );

}

