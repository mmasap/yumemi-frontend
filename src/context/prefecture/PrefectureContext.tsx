import { ReactNode, createContext } from 'react'
import client, { PrefectureResult } from '@/lib/api'

let prefectureResult: PrefectureResult[] | Error
export const PrefectureContext = createContext<PrefectureResult[]>([])

export const PrefectureContextProvider = ({ children }: { children: ReactNode }) => {
  const prefectures = fetchPrefectures()
  return <PrefectureContext.Provider value={prefectures}>{children}</PrefectureContext.Provider>
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
