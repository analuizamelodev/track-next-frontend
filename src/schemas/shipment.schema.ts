import { z } from "zod";

export const addressSchema = z.object({
  street: z.string().min(1, "Rua obrigatória"),
  number: z.string().min(1, "Número obrigatório"),
  neighborhood: z.string().min(1, "Bairro obrigatório"),
  city: z.string().min(1, "Cidade obrigatória"),
  state: z.string().min(2, "UF obrigatória").max(2, "UF inválida"),
  cep: z.string().min(8, "CEP inválido"),
});

const positiveNumber = z.preprocess(
  (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
  z.number({ error: "Número inválido" }).positive("Valor deve ser maior que zero"),
);

const minOneNumber = z.preprocess(
  (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
  z.number({ error: "Número inválido" }).min(1, "Quantidade mínima: 1"),
);

export const shipmentItemSchema = z.object({
  name: z.string().min(1, "Nome do item obrigatório"),
  quantity: minOneNumber,
  description: z.string().optional(),
});

export const createShipmentSchema = z.object({
  customerId: z.string().min(1, "Selecione o cliente"),
  senderName: z.string().min(1, "Remetente obrigatório"),
  origin: addressSchema,
  recipientName: z.string().min(1, "Destinatário obrigatório"),
  destination: addressSchema,
  weight: positiveNumber,
  serviceType: z.string().min(1, "Tipo de serviço obrigatório"),
  notes: z.string().optional(),
  items: z.array(shipmentItemSchema).min(1, "Adicione ao menos um item"),
});
export type CreateShipmentFormValues = z.infer<typeof createShipmentSchema>;

export const updateStatusSchema = z.object({
  status: z.preprocess((val) => Number(val), z.number()),
  location: z.string().optional(),
  description: z.string().optional(),
});
export type UpdateStatusFormValues = z.infer<typeof updateStatusSchema>;

export const cancelShipmentSchema = z.object({
  description: z.string().optional(),
  location: z.string().optional(),
});
export type CancelShipmentFormValues = z.infer<typeof cancelShipmentSchema>;

export const finishShipmentSchema = z.object({
  signedName: z.string().min(1, "Nome do recebedor obrigatório"),
  deliveryCep: z.string().min(8, "CEP de entrega inválido"),
  phone: z.string().optional(),
  location: z.string().optional(),
});
export type FinishShipmentFormValues = z.infer<typeof finishShipmentSchema>;
