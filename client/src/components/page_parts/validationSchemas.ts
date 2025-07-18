// validationSchemas.ts
import { z } from "zod";

export const Step1Schema = z.object({
  name: z.string().min(2),
  username: z.string().min(2),
  email: z.string().email(),
  birthdate: z.string(),
});

export const Step2Schema = z
  .object({
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
    terms: z.boolean().refine((v) => v, {
      message: "Vous devez accepter les conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Les mots de passe ne correspondent pas",
  });

export const Step3Schema = z.object({
  themes: z.array(z.string()).min(5),
});

export const Step4Schema = z.object({
  profilePicture: z
    .instanceof(File)
    .refine((file) => file.size <= 2 * 1024 * 1024, {
      message: "Max 2 Mo",
    }),
  bio: z.string().max(500),
});

export const FinalSchema = Step1Schema.merge(Step2Schema)
  .merge(Step3Schema)
  .merge(Step4Schema);
