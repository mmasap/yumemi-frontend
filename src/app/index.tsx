import { useState } from 'react'
import { AppProvider } from './provider'
import { SelectPrefecture, Chart } from '@/features/population/components'
import { PrefectureResult } from '@/lib/api'

export const App = () => {
  const { selectPrefectures, handleSelectPrefecture, clearSelectPrefecture } = useSelectPrefecture()
  return (
    <AppProvider>
      <SelectPrefecture
        selectPrefectures={selectPrefectures}
        handleSelectPrefecture={handleSelectPrefecture}
      />
      <Chart prefectures={selectPrefectures} clearSelectPrefecture={clearSelectPrefecture} />
    </AppProvider>
  )
}

const useSelectPrefecture = () => {
  const [selectPrefectures, setSelectPrefectures] = useState<PrefectureResult[]>([])

  function handleSelectPrefecture(prefecture: PrefectureResult) {
    setSelectPrefectures((prev) => {
      if (prev.some((p) => p.prefCode === prefecture.prefCode)) {
        return prev.filter((p) => p.prefCode !== prefecture.prefCode)
      } else {
        return [...prev, prefecture].sort((a, b) => a.prefCode - b.prefCode)
      }
    })
  }

  function clearSelectPrefecture(prefecture: PrefectureResult) {
    setSelectPrefectures((prev) => prev.filter((p) => p.prefCode !== prefecture.prefCode))
  }

  return { selectPrefectures, handleSelectPrefecture, clearSelectPrefecture }
}
