export const useShifts = () => {
  const { $api } = useNuxtApp()

  const list = async (params?: {
    page?: number
    limit?: number
    search?: string
    driverId?: string
    busId?: string
    dateFrom?: string
    dateTo?: string
  }) => {
    const res = await $api<any>('/shifts', { params })
    return res.data
  }

  const getOne = async (id: string) => {
    const res = await $api<any>(`/shifts/${id}`)
    return res.data.shift
  }

  const getSummary = async (id: string) => {
    const res = await $api<any>(`/shifts/${id}/summary`)
    return res.data
  }

  const create = async (body: {
    driverId: string
    busId: string
    date: string
    startTime: string
    notes?: string
  }) => {
    const res = await $api<any>('/shifts', { method: 'POST', body })
    return res.data.shift
  }

  const update = async (id: string, body: Partial<{
    endTime: string
    notes: string
    laps: number
  }>) => {
    const res = await $api<any>(`/shifts/${id}`, { method: 'PATCH', body })
    return res.data.shift
  }

  const remove = async (id: string) => {
    const res = await $api<any>(`/shifts/${id}`, { method: 'DELETE' })
    return res.data
  }

  return { list, getOne, getSummary, create, update, remove }
}
