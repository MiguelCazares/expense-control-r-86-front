export const useExpenses = () => {
  const { $api } = useNuxtApp()

  const list = async (params?: {
    page?: number
    limit?: number
    busId?: string
    categoryId?: string
    dateFrom?: string
    dateTo?: string
  }) => {
    const res = await $api<any>('/expenses', { params })
    return res.data
  }

  const getOne = async (id: string) => {
    const res = await $api<any>(`/expenses/${id}`)
    return res.data.expense
  }

  const create = async (body: {
    busId: string
    shiftId?: string
    date: string
    amount: number
    categoryId: string
    description?: string
  }) => {
    const res = await $api<any>('/expenses', { method: 'POST', body })
    return res.data.expense
  }

  const update = async (id: string, body: Partial<{
    busId: string
    shiftId: string
    date: string
    amount: number
    categoryId: string
    description: string
  }>) => {
    const res = await $api<any>(`/expenses/${id}`, { method: 'PATCH', body })
    return res.data.expense
  }

  const remove = async (id: string) => {
    const res = await $api<any>(`/expenses/${id}`, { method: 'DELETE' })
    return res.data
  }

  return { list, getOne, create, update, remove }
}
