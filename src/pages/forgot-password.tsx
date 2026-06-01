import { useState } from "react";

import { Link } from "react-router-dom";

import { useForm } from "react-hook-form";

import { z } from "zod";

import { ArrowLeft, Loader2, MailCheck } from "lucide-react";

import { AuthLayout } from "@/components/auth/auth-layout";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { useToast } from "@/components/ui/toast";

import { sendPasswordReset } from "@/services/auth-service";

import { useI18n } from "@/hooks/use-i18n";

import { zodResolver } from "@/lib/zod-resolver";



const schema = z.object({

  email: z.string().min(1, "Email is required").email("Enter a valid email address"),

});



type FormValues = z.infer<typeof schema>;



export default function ForgotPasswordPage() {

  const { toast } = useToast();

  const { t } = useI18n();

  const [sent, setSent] = useState(false);

  const [sentEmail, setSentEmail] = useState("");



  const {

    register,

    handleSubmit,

    formState: { errors, isSubmitting },

  } = useForm<FormValues>({

    resolver: zodResolver(schema),

    defaultValues: { email: "" },

  });



  const onSubmit = async (values: FormValues) => {

    const result = await sendPasswordReset(values.email);

    if (result.ok) {

      setSentEmail(values.email);

      setSent(true);

      toast({

        title: t("auth.resetLinkSent"),

        description: t("auth.resetCheckInbox"),

        variant: "success",

      });

    } else {

      toast({

        title: t("auth.couldntSendReset"),

        description: result.error,

        variant: "destructive",

      });

    }

  };



  return (

    <AuthLayout

      title={t("auth.forgotTitle")}

      subtitle={sent ? undefined : t("auth.forgotSubtitle")}

      footer={

        <Link

          to="/login"

          className="focus-ring inline-flex items-center gap-1.5 rounded font-semibold text-primary hover:underline"

        >

          <ArrowLeft className="h-4 w-4" />

          {t("auth.backToSignIn")}

        </Link>

      }

    >

      {sent ? (

        <div className="flex flex-col items-center text-center">

          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-success/10 text-success">

            <MailCheck className="h-7 w-7" />

          </span>

          <p className="mt-4 text-sm text-muted-foreground">

            {t("auth.resetSentDesc", { email: sentEmail })}

          </p>

          <Button asChild variant="outline" className="mt-6 w-full">

            <Link to="/login">{t("auth.returnToSignIn")}</Link>

          </Button>

        </div>

      ) : (

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



          <Button

            type="submit"

            variant="gradient"

            size="lg"

            className="w-full"

            disabled={isSubmitting}

          >

            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}

            {isSubmitting ? t("auth.sending") : t("auth.sendReset")}

          </Button>

        </form>

      )}

    </AuthLayout>

  );

}

