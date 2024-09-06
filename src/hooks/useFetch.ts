import { useCallback, useEffect, useState } from 'react'

export function useFetch<T>(fetchFn: () => Promise<T>, cb?: (data: T) => void) {
  const [isFetching, setIsFetching] = useState(false)
  // const [error, setError] = useState()
  const [data, setData] = useState<T>()
  const fetchData = useCallback(async () => {
    setIsFetching(true)
    try {
      const data = await fetchFn()
      setData(data)
      if (cb) cb(data)
    } catch (error) {
      console.log(error)
      // setError({ message: error.message || 'Failed to fetch data.' });
    } finally {
      setIsFetching(false)
    }
  }, [cb, fetchFn])

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    isFetching,
    refetch: fetchData,
    data,
  }
}
