import { useEffect, useRef } from 'react'

export const useTimeout = (callback: () => void, delay: number) => {
  const callbackRef = useRef(callback)

  useEffect(() => {
    const id = setTimeout(() => {
      callbackRef.current()
    }, delay)

    return () => {
      clearTimeout(id)
    }
  }, [delay])
}
