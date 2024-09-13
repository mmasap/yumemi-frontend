import { useContext } from 'react'
import {
  SelectPrefectureDispatchContext,
  SelectPrefecturesContext,
} from './SelectPrefectureContext'

export const useSelectPrefectures = () => useContext(SelectPrefecturesContext)
export const useSelectPrefectureDispatch = () => useContext(SelectPrefectureDispatchContext)
