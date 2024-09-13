import { AppProvider } from './provider'
import { SelectPrefecture, Chart } from '@/features/population/components'
import { SelectPrefectureContextProvider } from '@/features/population/context'

export const App = () => {
  return (
    <AppProvider>
      <Home />
    </AppProvider>
  )
}

const Home = () => {
  return (
    <SelectPrefectureContextProvider>
      <SelectPrefecture />
      <Chart />
    </SelectPrefectureContextProvider>
  )
}
