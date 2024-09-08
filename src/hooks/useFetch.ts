import { useCallback, useEffect, useState } from 'react'

export function useFetch<T>(fetchFn: () => Promise<T>, initialState: T) {
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState<T>(initialState)
  const fetchData = useCallback(async () => {
    setIsFetching(true)
    try {
      const data = await fetchFn()
      setData(data)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Failed to fetch data.')
      }
    }
    setIsFetching(false)
  }, [fetchFn])

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    isFetching,
    refetch: fetchData,
    data,
    error,
  }
}
