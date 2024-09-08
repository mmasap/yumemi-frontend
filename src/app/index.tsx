import { AppProvider } from './provider'
import { SelectPrefecture, Chart } from '@/features/population/components'
import { useSelectPrefecture } from '@/features/population/hooks'

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
