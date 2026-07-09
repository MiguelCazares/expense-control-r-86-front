export const useBuses = () => {
  const { $api } = useNuxtApp()

  const list = async (params?: { page?: number; limit?: number; search?: string }) => {
    const res = await $api<any>('/buses', { params })
    return res.data
  }

  const getOne = async (id: string) => {
    const res = await $api<any>(`/buses/${id}`)
    return res.data.bus
  }

  const create = async (body: {
    plate: string
    number: string
    model: string
    brand: string
    year: number
    route: string
  }) => {
    const res = await $api<any>('/buses', { method: 'POST', body })
    return res.data.bus
  }

  const update = async (id: string, body: Partial<{
    plate: string
    number: string
    model: string
    brand: string
    year: number
    route: string
  }>) => {
    const res = await $api<any>(`/buses/${id}`, { method: 'PATCH', body })
    return res.data.bus
  }

  const remove = async (id: string) => {
    const res = await $api<any>(`/buses/${id}`, { method: 'DELETE' })
    return res.data
  }

  const getSummary = async (id: string, month: string) => {
    const res = await $api<any>(`/buses/${id}/summary`, { params: { month } })
    return res.data.summary
  }

  return { list, getOne, create, update, remove, getSummary }
}
