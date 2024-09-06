import { PrefectureResult } from '@/lib/api'
import { useState } from 'react'

export const useSelectPrefecture = () => {
  const [selectPrefectures, setSelectPrefectures] = useState<
    PrefectureResult[]
  >([])

  function handleSelectPrefecture(prefecture: PrefectureResult) {
    setSelectPrefectures((prev) => {
      if (prev.some((p) => p.prefCode === prefecture.prefCode)) {
        return prev.filter((p) => p.prefCode !== prefecture.prefCode)
      } else {
        return [...prev, prefecture]
      }
    })
  }

  return { selectPrefectures, handleSelectPrefecture }
}
