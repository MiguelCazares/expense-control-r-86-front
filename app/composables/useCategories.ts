export type CategoryColor = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple'

export interface Category {
  id: number
  name: string
  slug: string
  color: CategoryColor
  active: boolean
}

export const CATEGORY_COLORS: { label: string; value: CategoryColor }[] = [
  { label: 'Gris', value: 'default' },
  { label: 'Verde', value: 'success' },
  { label: 'Ámbar', value: 'warning' },
  { label: 'Rojo', value: 'danger' },
  { label: 'Azul', value: 'info' },
  { label: 'Morado', value: 'purple' },
]

export const useCategories = () => {
  const { $api } = useNuxtApp()

  const list = async (params?: {
    page?: number
    limit?: number
    search?: string
    active?: boolean
  }) => {
    const res = await $api<any>('/categories', { params })
    return res.data
  }

  const getOne = async (id: string) => {
    const res = await $api<any>(`/categories/${id}`)
    return res.data.category
  }

  const create = async (body: { name: string; color?: CategoryColor }) => {
    const res = await $api<any>('/categories', { method: 'POST', body })
    return res.data.category
  }

  const update = async (
    id: string,
    body: Partial<{ name: string; color: CategoryColor; active: boolean }>
  ) => {
    const res = await $api<any>(`/categories/${id}`, { method: 'PATCH', body })
    return res.data.category
  }

  const remove = async (id: string) => {
    const res = await $api<any>(`/categories/${id}`, { method: 'DELETE' })
    return res.data
  }

  /** Options for the category selects on the expense forms and filters. */
  const listActiveOptions = async () => {
    const data = await list({ limit: 100, active: true })
    const categories: Category[] = data?.data ?? data ?? []
    return categories.map(c => ({ label: c.name, value: String(c.id) }))
  }

  return { list, getOne, create, update, remove, listActiveOptions }
}
