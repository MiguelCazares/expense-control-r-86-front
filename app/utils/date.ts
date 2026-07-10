export function formatDate(date?: string | null, fallback = '—'): string {
  if (!date) return fallback
  return new Date(`${date}T00:00:00`).toLocaleDateString()
}
