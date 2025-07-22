// validationSchemas.ts
import { z } from "zod";

export const Step1Schema = z.object({
  name: z.string().min(2),
  username: z.string().min(2),
  email: z.string().email(),
  birthDate: z
    .string()
    .min(1, { message: "Veuillez entrer votre date de naissance" })
    .refine(
      (dateStr) => {
        const birthDate = new Date(dateStr);
        if (isNaN(birthDate.getTime())) return false;

        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age >= 15;
      },
      {
        message: "Vous devez avoir au moins 13 ans",
      }
    ),
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
  avatar: z.instanceof(File).refine((file) => file.size <= 2 * 1024 * 1024, {
    message: "Max 2 Mo",
  }),
  bio: z.string().max(500),
});

// To merge, extract the base object from Step2Schema (before .refine)
const Step2BaseSchema = z.object({
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
  terms: z.boolean().refine((v) => v, {
    message: "Vous devez accepter les conditions",
  }),
});

export const FinalSchema = z.object({
  ...Step1Schema.shape,
  ...Step2BaseSchema.shape,
  ...Step3Schema.shape,
  ...Step4Schema.shape,
});
