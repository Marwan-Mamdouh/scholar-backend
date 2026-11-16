import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name is too long"),

  email: z.string().email("Please enter a valid email address"),

  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message is too long"),
});

export type ContactData = z.infer<typeof contactSchema>;
