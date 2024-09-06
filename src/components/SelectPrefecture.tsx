import { useFetch } from '@/hooks/useFetch'
import client, { PrefectureResult } from '@/lib/api'

type SelectPrefecturesProps = {
  selectPrefectures: PrefectureResult[]
  handleSelectPrefecture: (prefecture: PrefectureResult) => void
}

export const SelectPrefecture = (props: SelectPrefecturesProps) => {
  const { data: prefectures } = useFetch(async () => {
    const response = await client.GET('/api/v1/prefectures')
    return response.data?.result ?? []
  })

  return (
    <>
      <p>都道府県</p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
        }}
      >
        {prefectures?.map((prefecture) => {
          const id = prefecture.prefCode.toString()
          const checked = props.selectPrefectures.some((p) => p.prefCode === prefecture.prefCode)
          return (
            <label key={id} htmlFor={id}>
              <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={() => props.handleSelectPrefecture(prefecture)}
              />
              {prefecture.prefName}
            </label>
          )
        })}
      </div>
    </>
  )
}
