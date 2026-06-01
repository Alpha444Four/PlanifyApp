import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Invalid email address");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128)
  .regex(/[A-Za-z]/, "Password must include a letter")
  .regex(/[0-9]/, "Password must include a number");

export const signUpSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: emailSchema,
  password: passwordSchema,
});

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const verifyTokenSchema = z.object({
  token: z.string().min(16),
});

export const reminderSettingsSchema = z.object({
  water: z.boolean(),
  meal: z.boolean(),
  workout: z.boolean(),
  sleep: z.boolean(),
  mood: z.boolean(),
  breathing: z.boolean(),
  browserPush: z.boolean(),
});

export const evaluateRemindersSchema = z.object({
  waterMl: z.number().min(0),
  meals: z.number().min(0),
  moodSet: z.boolean(),
  trainingMin: z.number().min(0),
  language: z.enum(["darija", "fr", "en", "ar"]).optional(),
  userName: z.string().optional(),
});
