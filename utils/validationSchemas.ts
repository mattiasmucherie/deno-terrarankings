import { z } from "z";

export const newNameSchema = z.string();
export const emailSchema = z.string().email();
export const passwordSchema = z.string()
  .min(8, { message: "Password must be at least 8 characters long" }) // Minimum length
  .max(100, { message: "Password must be no longer than 100 characters" }); // Maximum length
