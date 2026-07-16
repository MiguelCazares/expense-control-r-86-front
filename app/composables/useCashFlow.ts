export const useCashFlow = () => {
  const { $api } = useNuxtApp()

  const getSummary = async (params: { dateFrom: string, dateTo: string, busId?: string }) => {
    const res = await $api<any>('/cash-flow', { params })
    return res.data.cashFlow
  }

  return { getSummary }
}
