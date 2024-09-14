import { ReactNode, createContext, useCallback, useState } from 'react'
import client, { PrefectureResult } from '@/lib/api'

type PrefectureContextValue = {
  prefectures: PrefectureResult[]
  getPrefecture: (prefectureCode: number) => PrefectureResult | undefined
}

let prefectureResult: PrefectureResult[] | Error
export const PrefectureContext = createContext<PrefectureContextValue>({} as PrefectureContextValue)

export const PrefectureContextProvider = ({ children }: { children: ReactNode }) => {
  const [prefectures] = useState(fetchPrefectures)
  const getPrefecture = useCallback(
    (prefectureCode: number) => prefectures.find((p) => p.prefCode === prefectureCode),
    [prefectures],
  )

  return (
    <PrefectureContext.Provider value={{ prefectures, getPrefecture }}>
      {children}
    </PrefectureContext.Provider>
  )
}

function fetchPrefectures() {
  if (!prefectureResult) {
    throw client
      .GET('/api/v1/prefectures')
      .then((res) => {
        if (typeof res.data === 'object' && 'result' in res.data) {
          prefectureResult = res.data.result
          return
        }
        throw new Error('unexpected error')
      })
      .catch((e) => {
        prefectureResult = e
      })
  } else if (prefectureResult instanceof Error) {
    throw prefectureResult
  } else {
    return prefectureResult
  }
}
