export const useDrivers = () => {
  const { $api } = useNuxtApp()

  const list = async (params?: { page?: number; limit?: number; search?: string }) => {
    const res = await $api<any>('/drivers', { params })
    return res.data
  }

  const getOne = async (id: string) => {
    const res = await $api<any>(`/drivers/${id}`)
    return res.data.driver
  }

  const create = async (body: {
    name: string
    lastName: string
    license: string
    phone?: string
  }) => {
    const res = await $api<any>('/drivers', { method: 'POST', body })
    return res.data.driver
  }

  const update = async (id: string, body: Partial<{
    name: string
    lastName: string
    license: string
    phone: string
  }>) => {
    const res = await $api<any>(`/drivers/${id}`, { method: 'PATCH', body })
    return res.data.driver
  }

  const remove = async (id: string) => {
    const res = await $api<any>(`/drivers/${id}`, { method: 'DELETE' })
    return res.data
  }

  const addAssignment = async (id: string, body: { busId: string; date: string }) => {
    const res = await $api<any>(`/drivers/${id}/assignments`, { method: 'POST', body })
    return res.data
  }

  const getAssignments = async (id: string, params?: { page?: number; limit?: number }) => {
    const res = await $api<any>(`/drivers/${id}/assignments`, { params })
    return res.data
  }

  return { list, getOne, create, update, remove, addAssignment, getAssignments }
}
