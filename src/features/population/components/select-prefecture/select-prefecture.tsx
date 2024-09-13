import styles from './select-prefecture.module.css'
import { Checkbox } from '@/components/ui/form/checkbox'
import { usePrefectureContext } from '@/context/prefecture'
import { useSelectPrefectureDispatch, useSelectPrefectures } from '@/features/population/context'
import { PrefectureResult } from '@/lib/api'

export const SelectPrefecture = () => {
  const prefectures = usePrefectureContext()

  return (
    <>
      <h2 className={styles.title}>都道府県</h2>
      <div className={styles.prefectures} data-testid="select-prefecture">
        {prefectures?.map((prefecture) => {
          return <PrefectureCheckbox key={prefecture.prefCode} prefecture={prefecture} />
        })}
      </div>
    </>
  )
}

type PrefectureCheckboxProps = {
  prefecture: PrefectureResult
}

const PrefectureCheckbox = ({ prefecture }: PrefectureCheckboxProps) => {
  const selectPrefectures = useSelectPrefectures()
  const selectPrefectureDispatch = useSelectPrefectureDispatch()
  const isChecked = selectPrefectures.some((p) => p.prefCode === prefecture.prefCode)

  function handleSelectPrefecture() {
    selectPrefectureDispatch({ type: !isChecked ? 'select' : 'unselect', payload: prefecture })
  }

  return (
    <Checkbox checked={isChecked} onChange={handleSelectPrefecture}>
      {prefecture.prefName}
    </Checkbox>
  )
}
