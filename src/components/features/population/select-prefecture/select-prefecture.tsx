import { PrefectureResult } from '@/lib/api'
import { Checkbox } from '@/components/ui/form/checkbox'
import { usePrefectureContext } from '@/context/prefecture'
import styles from './select-prefecture.module.css'

type SelectPrefecturesProps = {
  selectPrefectures: PrefectureResult[]
  handleSelectPrefecture: (prefecture: PrefectureResult) => void
}

export const SelectPrefecture = (props: SelectPrefecturesProps) => {
  const prefectures = usePrefectureContext()

  return (
    <>
      <p className={styles.title}>都道府県</p>
      <div className={styles.prefectures}>
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
