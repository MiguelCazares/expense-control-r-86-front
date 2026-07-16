export const useApi = () => {
  const { $api } = useNuxtApp()

  const request = async <T = any>(
    url: string,
    options?: Parameters<typeof $api>[1],
  ): Promise<T> => {
    const response = await $api<{ status: string, data: T, code: number }>(url, options)
    return response.data
  }

  return { request }
}
