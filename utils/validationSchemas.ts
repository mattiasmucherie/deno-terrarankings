import { z } from "https://deno.land/x/zod@v3.22.4/index.ts";

export const newNameSchema = z.string()
  .min(4, {
    message: "Username is too short. It must be at least 4 characters.",
  })
  .max(20, {
    message: "Username is too long. It must be no more than 20 characters.",
  });

export const emailSchema = z.string().email(
  "Please enter a valid email address",
);
export const passwordSchema = z.string()
  .min(6, { message: "Password must be at least 6 characters long" })
  .max(50, { message: "Password must not be more than 50 characters long" })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter",
  })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  .regex(/[0-9]/, { message: "Password must contain at least one number" });
