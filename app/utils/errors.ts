export function getApiErrorMessage(err: any, fallback: string): string {
  const message = err?.data?.data?.message
  if (Array.isArray(message)) return message.join(', ')
  return message ?? fallback
}
