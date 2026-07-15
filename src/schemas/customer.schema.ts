import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z.string().min(1, "Informe o nome do cliente"),
  email: z
    .string()
    .email("Email inválido")
    .optional()
    .or(z.literal("")),
  document: z.string().optional(),
  phone: z.string().optional(),
});
export type CreateCustomerFormValues = z.infer<typeof createCustomerSchema>;

export const updateCustomerSchema = createCustomerSchema;
export type UpdateCustomerFormValues = z.infer<typeof updateCustomerSchema>;
