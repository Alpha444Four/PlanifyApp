import { config } from "../config.js";

/**
 * Email delivery — logs in dev; plug in Resend/SendGrid/Nodemailer in production.
 */
export async function sendVerificationEmail(
  email: string,
  token: string,
): Promise<void> {
  const url = `${config.appPublicUrl}/verify-email?token=${encodeURIComponent(token)}`;
  if (config.devLogEmails) {
    console.log("\n[Planify] Verification email (dev)\n  To:", email, "\n  Link:", url, "\n");
  }
  // TODO: production SMTP / transactional provider
}

export async function sendPasswordResetEmail(
  email: string,
  token: string,
): Promise<void> {
  const url = `${config.appPublicUrl}/forgot-password?token=${encodeURIComponent(token)}`;
  if (config.devLogEmails) {
    console.log("\n[Planify] Password reset email (dev)\n  To:", email, "\n  Link:", url, "\n");
  }
}
