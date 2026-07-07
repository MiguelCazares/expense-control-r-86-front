export const useExpenses = () => {
  const { $api } = useNuxtApp()

  const list = async (params?: {
    page?: number
    limit?: number
    busId?: string
    category?: string
    dateFrom?: string
    dateTo?: string
  }) => {
    const res = await $api<any>('/expenses', { params })
    return res.data
  }

  const getOne = async (id: string) => {
    const res = await $api<any>(`/expenses/${id}`)
    return res.data
  }

  const create = async (body: {
    busId: string
    shiftId?: string
    date: string
    amount: number
    category: 'fuel' | 'maintenance' | 'repair' | 'other'
    description?: string
  }) => {
    const res = await $api<any>('/expenses', { method: 'POST', body })
    return res.data
  }

  const update = async (id: string, body: Partial<{
    busId: string
    shiftId: string
    date: string
    amount: number
    category: string
    description: string
  }>) => {
    const res = await $api<any>(`/expenses/${id}`, { method: 'PATCH', body })
    return res.data
  }

  const remove = async (id: string) => {
    const res = await $api<any>(`/expenses/${id}`, { method: 'DELETE' })
    return res.data
  }

  return { list, getOne, create, update, remove }
}
