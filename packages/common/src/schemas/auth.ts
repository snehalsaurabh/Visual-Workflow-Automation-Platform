import { z } from "zod";

export const SignupInputSchema = z.object({
  email: z.string().email().min(3),
  password: z.string().min(8).max(200),
});

export const SigninInputSchema = z.object({
  email: z.string().email().min(3),
  password: z.string().min(1).max(200),
});

export type SignupInput = z.infer<typeof SignupInputSchema>;
export type SigninInput = z.infer<typeof SigninInputSchema>;

export const AuthResponseSchema = z.object({
  token: z.string().min(1),
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;

