import styles from './select-prefecture.module.css'
import { SelectPrefectureAction } from '@/app'
import { Checkbox } from '@/components/ui/form/checkbox'
import { usePrefectureContext } from '@/context/prefecture'

type SelectPrefectureProps = {
  selectPrefCodes: number[]
  dispatchSelectPrefCode: (action: SelectPrefectureAction) => void
}

export const SelectPrefecture = ({
  selectPrefCodes,
  dispatchSelectPrefCode,
}: SelectPrefectureProps) => {
  const { prefectures } = usePrefectureContext()

  return (
    <>
      <h2 className={styles.title}>都道府県</h2>
      <div className={styles.prefectures} data-testid="select-prefecture">
        {prefectures?.map((prefecture) => {
          return (
            <Checkbox
              key={prefecture.prefCode}
              checked={selectPrefCodes.includes(prefecture.prefCode)}
              onChange={(e) =>
                dispatchSelectPrefCode({
                  type: e.target.checked ? 'select' : 'unselect',
                  payload: prefecture.prefCode,
                })
              }
            >
              {prefecture.prefName}
            </Checkbox>
          )
        })}
      </div>
    </>
  )
}
