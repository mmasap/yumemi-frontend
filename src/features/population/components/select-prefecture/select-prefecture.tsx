import styles from './select-prefecture.module.css'
import { Checkbox } from '@/components/ui/form/checkbox'
import { usePrefectureContext } from '@/context/prefecture'
import { PrefectureResult } from '@/lib/api'

type SelectPrefecturesProps = {
  selectPrefectures: PrefectureResult[]
  handleSelectPrefecture: (prefecture: PrefectureResult) => void
}

export const SelectPrefecture = (props: SelectPrefecturesProps) => {
  const prefectures = usePrefectureContext()

  return (
    <>
      <h2 className={styles.title}>都道府県</h2>
      <div className={styles.prefectures} data-testid="select-prefecture">
        {prefectures?.map((prefecture) => {
          const checked = props.selectPrefectures.some((p) => p.prefCode === prefecture.prefCode)
          return (
            <Checkbox
              key={prefecture.prefCode}
              checked={checked}
              onChange={() => props.handleSelectPrefecture(prefecture)}
            >
              {prefecture.prefName}
            </Checkbox>
          )
        })}
      </div>
    </>
  )
}
