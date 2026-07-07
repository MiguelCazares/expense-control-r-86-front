export const useIncome = () => {
  const { $api } = useNuxtApp()

  const list = async (params?: {
    page?: number
    limit?: number
    busId?: string
    dateFrom?: string
    dateTo?: string
  }) => {
    const res = await $api<any>('/income', { params })
    return res.data
  }

  const getOne = async (id: string) => {
    const res = await $api<any>(`/income/${id}`)
    return res.data
  }

  const create = async (body: {
    busId: string
    shiftId?: string
    date: string
    amount: number
    notes?: string
  }) => {
    const res = await $api<any>('/income', { method: 'POST', body })
    return res.data
  }

  const update = async (id: string, body: Partial<{
    busId: string
    shiftId: string
    date: string
    amount: number
    notes: string
  }>) => {
    const res = await $api<any>(`/income/${id}`, { method: 'PATCH', body })
    return res.data
  }

  const remove = async (id: string) => {
    const res = await $api<any>(`/income/${id}`, { method: 'DELETE' })
    return res.data
  }

  return { list, getOne, create, update, remove }
}
