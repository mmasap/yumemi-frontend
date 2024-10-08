import { useCallback, useEffect, useId, useRef, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Label,
  ResponsiveContainer,
} from 'recharts'
import styles from './chart.module.css'
import { SelectPrefectureAction } from '@/app'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card/card'
import { Dialog } from '@/components/ui/dialog'
import { Select } from '@/components/ui/form/select'
import { Spinner } from '@/components/ui/spinner'
import { usePrefectureContext } from '@/context/prefecture'
import client, { PopulationResult } from '@/lib/api'
import { formatNumber } from '@/util/formatter'

type ChartProps = {
  selectPrefCodes: number[]
  dispatchSelectPrefCode: (action: SelectPrefectureAction) => void
}

type PopulationData = {
  [prefCode: number]: PopulationResult | undefined
}

type ChartData = Array<{ year: number; [prefCode: number]: number }>

type DisplayChart = PopulationResult['data'][number]['label']
const selectableCharts: Array<DisplayChart> = ['総人口', '年少人口', '生産年齢人口', '老年人口']

const colorPallette = [
  '#f94144',
  '#f3722c',
  '#f8961e',
  '#f9844a',
  '#f9c74f',
  '#90be6d',
  '#43aa8b',
  '#4d908e',
  '#577590',
  '#277da1',
] as const

export const Chart = (props: ChartProps) => {
  const { selectPrefCodes } = props
  const { getPrefecture } = usePrefectureContext()
  const [displayChart, setDisplayChart] = useState<DisplayChart>(selectableCharts[0])
  const { populationData, isFetching, error, clearError } = usePopulationData(props)
  const chartData = createChartData(selectPrefCodes, displayChart, populationData)
  const selectId = useId()
  const { chartContainerRef, chartContainerWidth } = useChartContainerWidth()

  return (
    <>
      <Card className={styles['chart-card']} data-testid="chart-card">
        <div className={styles['chart-header']}>
          <label htmlFor={selectId}>表示データ</label>
          <Select
            id={selectId}
            value={displayChart}
            options={selectableCharts.map((charts) => ({ label: charts, value: charts }))}
            onChange={(e) => setDisplayChart(e.target.value as DisplayChart)}
          />
        </div>
        <ResponsiveContainer
          className={styles['chart-container']}
          key={chartContainerWidth}
          ref={chartContainerRef}
        >
          {chartData.length === 0 ? (
            <p style={{ visibility: isFetching ? 'hidden' : 'visible' }}>データなし</p>
          ) : (
            <LineChart data={chartData} margin={{ top: 32, left: 8, right: 16 }}>
              <XAxis dataKey="year">
                <Label value="年度" position="insideBottomRight" offset={-10} />
              </XAxis>
              <YAxis tickFormatter={(value: number) => `${formatNumber(value / 10000)}万`}>
                <Label value="人口数" position="top" offset={16} />
              </YAxis>
              <Tooltip
                labelFormatter={(year) => `${year}年`}
                formatter={(value: number) => formatNumber(value)}
                itemSorter={(item) => {
                  delete item.payload.year
                  return Object.values(item.payload)
                    .sort((a, b) => Number(b) - Number(a))
                    .indexOf(item.value)
                }}
                itemStyle={{ padding: 0 }}
              />
              <Legend />
              {props.selectPrefCodes.map((prefCode, i) => (
                <Line
                  key={prefCode}
                  isAnimationActive={false}
                  type="monotone"
                  stroke={colorPallette[i % colorPallette.length]}
                  dataKey={prefCode}
                  name={getPrefecture(prefCode)?.prefName}
                  activeDot={{ r: 8 }}
                />
              ))}
            </LineChart>
          )}
        </ResponsiveContainer>
        {isFetching && (
          <div className={styles['chart-loading']}>
            <Card>
              <Spinner size="2rem" />
            </Card>
          </div>
        )}
      </Card>
      {error && (
        <Dialog title="エラー" action={<Button onClick={clearError}>閉じる</Button>}>
          データが取得できませんでした。
        </Dialog>
      )}
    </>
  )
}

const usePopulationData = ({ selectPrefCodes, dispatchSelectPrefCode }: ChartProps) => {
  const [populationData, setPopulationData] = useState<PopulationData>({})
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState<Error>()

  useEffect(() => {
    const fetchPrefectures = selectPrefCodes.filter((p) => !populationData[p])
    if (fetchPrefectures.length === 0) return
    if (fetchPrefectures.length > 1) throw new Error('unexpected error')
    const fetchPrefecture = fetchPrefectures[0]

    setIsFetching(true)

    client
      .GET('/api/v1/population/composition/perYear', {
        params: { query: { prefCode: fetchPrefecture } },
      })
      .then((res) => {
        if (typeof res.data === 'object' && 'result' in res.data) {
          const { result } = res.data
          setPopulationData((prev) => ({ ...prev, [fetchPrefecture]: result }))
          return
        }
        throw new Error('unexpected error')
      })
      .catch((e) => {
        dispatchSelectPrefCode({ type: 'unselect', payload: fetchPrefecture })
        setError(e)
      })
      .finally(() => {
        setIsFetching(false)
      })
  }, [dispatchSelectPrefCode, populationData, selectPrefCodes])

  const clearError = useCallback(() => {
    setError(undefined)
  }, [])

  return { populationData, isFetching, error, clearError }
}

const useChartContainerWidth = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const [chartContainerWidth, setChartContainerWidth] = useState<number>()

  useEffect(() => {
    let inProgress = false
    function handleThrottleResize() {
      if (inProgress) return
      inProgress = true
      setTimeout(() => {
        if (chartContainerRef.current) {
          setChartContainerWidth(chartContainerRef.current.clientWidth)
        }
        inProgress = false
      }, 500)
    }

    window.addEventListener('resize', handleThrottleResize)
    return () => {
      window.removeEventListener('resize', handleThrottleResize)
    }
  }, [])

  return {
    chartContainerRef,
    chartContainerWidth,
  }
}

function createChartData(
  selectPrefCodes: number[],
  displayChart: DisplayChart,
  populationData: PopulationData,
): ChartData {
  if (selectPrefCodes.length <= 0) return []

  return selectPrefCodes
    .map((prefCode) => {
      const boundaryYear = populationData[prefCode]?.boundaryYear ?? 2020
      const targetData = populationData[prefCode]?.data.find((data) => data.label === displayChart)
      return targetData?.data
        .filter((data) => data.year <= boundaryYear)
        .map((data) => ({
          year: data.year,
          [prefCode]: data.value,
        }))
    })
    .flat()
    .reduce<ChartData>((acc, cur) => {
      if (!cur) return acc
      const index = acc.findIndex((data) => data.year === cur?.year)
      const prefCode = Number(Object.keys(cur).find((key) => key !== 'year'))
      if (index >= 0) {
        acc[index] = { ...acc[index], [prefCode]: cur[prefCode] }
      } else {
        acc.push({ year: cur.year, [prefCode]: cur[prefCode] })
      }
      return acc
    }, [])
}
