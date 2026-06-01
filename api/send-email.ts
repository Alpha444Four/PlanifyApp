import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

/**
 * Optional transactional emails via Resend.
 * Supabase still sends confirm + reset emails from Auth templates.
 *
 * Vercel env:
 *   RESEND_API_KEY
 *   FROM_EMAIL (e.g. noreply@yourdomain.com)
 */
type EmailType = "welcome" | "security" | "confirm";

const templates: Record<
  EmailType,
  (name: string) => { subject: string; html: string }
> = {
  welcome: (name) => ({
    subject: "Welcome to Planify",
    html: `<div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto">
      <h1 style="color:#1E3A8A">Welcome, ${name}!</h1>
      <p>Your email is confirmed. Your dashboard starts at zero — build your best habits from day one.</p>
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL ?? process.env.VITE_SITE_URL ?? ""}/app">Open Planify</a></p>
    </div>`,
  }),
  confirm: (name) => ({
    subject: "Confirm your Planify email",
    html: `<p>Hi ${name}, please confirm your email using the link Supabase sent you.</p>`,
  }),
  security: (name) => ({
    subject: "New sign-in to Planify",
    html: `<p>Hi ${name}, you just signed in to Planify. If this wasn't you, reset your password immediately.</p>`,
  }),
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.FROM_EMAIL;
  if (!apiKey || !from) {
    return res.status(200).json({ ok: true, skipped: true });
  }

  const { type, email, name } = req.body as {
    type?: EmailType;
    email?: string;
    name?: string;
  };

  if (!type || !email) {
    return res.status(400).json({ error: "type and email required" });
  }

  const tpl = templates[type]?.(name ?? "there") ?? templates.welcome(name ?? "there");
  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({
      from,
      to: email,
      subject: tpl.subject,
      html: tpl.html,
    });
    return res.status(200).json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Send failed";
    return res.status(500).json({ error: message });
  }
}
