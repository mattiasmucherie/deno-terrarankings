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

export const matchSchema = z.object({
  users: z.array(
    z.object({
      userId: z.string(),
      userName: z.string(),
      points: z.number(),
      corporation: z.object({ name: z.string(), id: z.string() }),
      money: z.number(),
    }),
  ).superRefine((users, ctx) => {
    const corporationIds = users.map((user) => user.corporation.id);
    const uniqueCorporationIds = new Set(corporationIds);

    if (corporationIds.length !== uniqueCorporationIds.size) {
      // There are duplicates
      ctx.addIssue({
        code: "custom",
        message: "Corporation IDs must be unique",
        path: [ctx.path[0]], // Adjust the path according to your needs
      });
    }
  }),
  matchMap: z.object({ name: z.string(), id: z.string() }),
  matchDate: z.string(),
});
