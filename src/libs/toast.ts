import { toast } from "sonner";
import { getApiErrorMessage } from "@/src/libs/api-error";

/** Handler padrão de erro para mutations — exibe toast e não exige try/catch. */
export function onMutationError(fallback: string) {
  return (err: unknown) => {
    toast.error(getApiErrorMessage(err, fallback));
  };
}

export function toastSuccess(message: string) {
  toast.success(message);
}
