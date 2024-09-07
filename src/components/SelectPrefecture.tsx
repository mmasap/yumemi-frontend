import { useFetch } from '@/hooks/useFetch'
import client, { PrefectureResult } from '@/lib/api'
import { Checkbox } from '@/components/ui/form/checkbox'

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
      <p style={{ fontWeight: 'bold' }}>都道府県</p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          marginBottom: '0.5rem',
        }}
      >
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
