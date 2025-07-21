import { z } from "zod";

export const SignupRequestDto = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

export const SigninRequestDto = z.object({
  username: z.string().min(3),
  password: z.string().min(1),
});

export type SignupRequest = z.infer<typeof SignupRequestDto>;
export type SigninRequest = z.infer<typeof SigninRequestDto>;

export const SignupResponseDto = z.object({
  id: z.string(),
  username: z.string(),
  isAdmin: z.boolean(),
  createdAt: z.date(),
});

export const SigninResponseDto = z.object({
  username: z.string(),
  token: z.string(),
});

export type SignupResponse = z.infer<typeof SignupResponseDto>;
export type SigninResponse = z.infer<typeof SigninResponseDto>;
