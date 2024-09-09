import { useState } from 'react'
import { AppProvider } from './provider'
import { SelectPrefecture, Chart } from '@/features/population/components'
import { PrefectureResult } from '@/lib/api'

export const App = () => {
  const { selectPrefectures, handleSelectPrefecture } = useSelectPrefecture()
  return (
    <AppProvider>
      <SelectPrefecture
        selectPrefectures={selectPrefectures}
        handleSelectPrefecture={handleSelectPrefecture}
      />
      <Chart prefectures={selectPrefectures} />
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

  return { selectPrefectures, handleSelectPrefecture }
}
