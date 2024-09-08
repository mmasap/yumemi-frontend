import { useSelectPrefecture } from '@/hooks/useSelectPrefecture'
import { AppProvider } from './provider'
import { SelectPrefecture, Chart } from '@/components/features/population'

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
