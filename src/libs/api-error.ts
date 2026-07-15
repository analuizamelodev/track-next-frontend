export function getApiErrorMessage(
  err: unknown,
  fallback = "Ocorreu um erro.",
): string {
  const message = (err as { response?: { data?: { message?: string | string[] } } })
    ?.response?.data?.message;
  if (Array.isArray(message)) return message.join(", ");
  if (typeof message === "string" && message.trim()) return message;
  return fallback;
}
