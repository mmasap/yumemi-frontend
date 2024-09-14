import { useReducer } from 'react'
import { AppProvider } from './provider'
import { SelectPrefecture, Chart } from '@/features/population/components'

export const App = () => {
  return (
    <AppProvider>
      <Home />
    </AppProvider>
  )
}

const Home = () => {
  const [selectPrefCodes, dispatchSelectPrefCode] = useReducer(selectPrefCodeReducer, [])

  return (
    <>
      <SelectPrefecture
        selectPrefCodes={selectPrefCodes}
        dispatchSelectPrefCode={dispatchSelectPrefCode}
      />
      <Chart selectPrefCodes={selectPrefCodes} dispatchSelectPrefCode={dispatchSelectPrefCode} />
    </>
  )
}

export interface SelectPrefectureAction {
  type: 'select' | 'unselect'
  payload: number
}

function selectPrefCodeReducer(selectPrefCodes: number[], action: SelectPrefectureAction) {
  const { type, payload } = action
  switch (type) {
    case 'select':
      return [...new Set([...selectPrefCodes, payload])].sort((a, b) => a - b)
    case 'unselect':
      return selectPrefCodes.filter((prefCode) => prefCode !== payload)
    default:
      return selectPrefCodes
  }
}
