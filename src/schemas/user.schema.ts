import { z } from "zod";
import { UserRole } from "@/src/libs/auth";

export const createUserSchema = z.object({
  name: z.string().min(1, "Informe o nome"),
  email: z.string().email("Email inválido"),
  role: z.preprocess(
    (val) => Number(val),
    z.nativeEnum(UserRole),
  ),
});
export type CreateUserFormValues = z.infer<typeof createUserSchema>;

export const editUserSchema = z.object({
  name: z.string().min(1, "Informe o nome"),
  email: z.string().email("Email inválido"),
});
export type EditUserFormValues = z.infer<typeof editUserSchema>;
