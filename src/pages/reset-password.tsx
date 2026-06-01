import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { AuthLayout } from "@/components/auth/auth-layout";
import { PasswordInput } from "@/components/auth/password-input";
import { PasswordStrength } from "@/components/auth/password-strength";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { updatePassword } from "@/services/auth-service";
import { zodResolver } from "@/lib/zod-resolver";
import { useI18n } from "@/hooks/use-i18n";

const schema = z
  .object({
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Za-z]/, "Include a letter")
      .regex(/[0-9]/, "Include a number"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

type FormValues = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const { toast } = useToast();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirm: "" },
  });

  const password = watch("password");

  const onSubmit = async (values: FormValues) => {
    const result = await updatePassword(values.password);
    if (!result.ok) {
      toast({ title: "Reset failed", description: result.error, variant: "destructive" });
      return;
    }
    setDone(true);
    toast({ title: "Password updated", variant: "success" });
    window.setTimeout(() => navigate("/login", { replace: true }), 2000);
  };

  return (
    <AuthLayout
      title="Set new password"
      subtitle={done ? "You can sign in with your new password." : "Choose a strong password for your account."}
      footer={
        <Link to="/login" className="text-primary hover:underline">
          {t("auth.backToSignIn")}
        </Link>
      }
    >
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        {done ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-success/10 text-success">
              <Lock className="h-7 w-7" />
            </span>
            <Button asChild variant="gradient" className="w-full">
              <Link to="/login">{t("auth.returnToSignIn")}</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
                New password
              </label>
              <PasswordInput
                id="password"
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              <PasswordStrength password={password} />
              {errors.password && (
                <p className="mt-1.5 text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="confirm" className="mb-1.5 block text-sm font-medium">
                Confirm password
              </label>
              <PasswordInput
                id="confirm"
                autoComplete="new-password"
                aria-invalid={!!errors.confirm}
                {...register("confirm")}
              />
              {errors.confirm && (
                <p className="mt-1.5 text-xs text-destructive">{errors.confirm.message}</p>
              )}
            </div>
            <Button type="submit" variant="gradient" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Saving…" : "Update password"}
            </Button>
          </form>
        )}
      </motion.div>
    </AuthLayout>
  );
}
