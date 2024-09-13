import { ReactNode, createContext, useReducer } from 'react'
import { PrefectureResult } from '@/lib/api'

export const SelectPrefecturesContext = createContext<PrefectureResult[]>([])
export const SelectPrefectureDispatchContext = createContext<
  (action: SelectPrefectureAction) => void
>(() => {})

export const SelectPrefectureContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(selectPrefectureReducer, [])

  return (
    <SelectPrefecturesContext.Provider value={state}>
      <SelectPrefectureDispatchContext.Provider value={dispatch}>
        {children}
      </SelectPrefectureDispatchContext.Provider>
    </SelectPrefecturesContext.Provider>
  )
}

interface SelectPrefectureAction {
  type: 'select' | 'unselect'
  payload: PrefectureResult
}

function selectPrefectureReducer(state: PrefectureResult[], action: SelectPrefectureAction) {
  const { type, payload } = action
  switch (type) {
    case 'select':
      if (state.some((p) => p.prefCode === payload.prefCode)) return state
      return [...state, payload].sort((a, b) => a.prefCode - b.prefCode)
    case 'unselect':
      return state.filter((p) => p.prefCode !== payload.prefCode)
    default:
      return state
  }
}
