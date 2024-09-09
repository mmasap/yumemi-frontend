import client, { PopulationResult, PrefectureResult } from '@/lib/api'
import { formatNumber } from '@/util/formatter'
import { useEffect, useId, useRef, useState } from 'react'
import styles from './chart.module.css'

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
import { Card } from '@/components/ui/card/card'
import { Select } from '@/components/ui/form/select'
import { Spinner } from '@/components/ui/spinner'

type ChartProps = {
  prefectures: PrefectureResult[]
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
  const [displayChart, setDisplayChart] = useState<DisplayChart>(selectableCharts[0])
  const { populationData, isFetching } = usePopulationData(props.prefectures)
  const chartData = createChartData(props, displayChart, populationData)
  const selectId = useId()
  const { chartContainerRef, chartContainerWidth } = useChartContainerWidth()

  return (
    <Card className={styles['chart-card']}>
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
            {props.prefectures.map((prefecture, i) => (
              <Line
                key={prefecture.prefCode}
                isAnimationActive={false}
                type="monotone"
                stroke={colorPallette[i % colorPallette.length]}
                dataKey={prefecture.prefCode}
                name={prefecture.prefName}
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
  )
}

const usePopulationData = (prefectures: PrefectureResult[]) => {
  const [isFetching, setIsFetching] = useState(false)
  const [populationData, setPopulationData] = useState<PopulationData>({})
  useEffect(() => {
    const fetchTargets = prefectures.filter((p) => !populationData[p.prefCode])
    if (fetchTargets.length <= 0) return

    setIsFetching(true)
    Promise.all(
      fetchTargets.map((p) =>
        client
          .GET('/api/v1/population/composition/perYear', {
            params: { query: { prefCode: p.prefCode } },
          })
          .then((res) => res.data?.result),
      ),
    )
      .then((res) => {
        setPopulationData((prev) => {
          const next = { ...prev }
          res.forEach((data, index) => {
            next[fetchTargets[index].prefCode] = data
          })
          return next
        })
      })
      .finally(() => {
        setIsFetching(false)
      })
  }, [populationData, prefectures])

  return { populationData, isFetching }
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
  props: ChartProps,
  displayChart: DisplayChart,
  populationData: PopulationData,
): ChartData {
  if (props.prefectures.length <= 0) return []

  return props.prefectures
    .map((prefecture) => {
      const boundaryYear = populationData[prefecture.prefCode]?.boundaryYear ?? 2020
      const targetData = populationData[prefecture.prefCode]?.data.find(
        (data) => data.label === displayChart,
      )
      return targetData?.data
        .filter((data) => data.year <= boundaryYear)
        .map((data) => ({
          prefCode: prefecture.prefCode,
          year: data.year,
          [prefecture.prefCode]: data.value,
        }))
    })
    .flat()
    .reduce<ChartData>((acc, cur) => {
      if (!cur) return acc
      const index = acc.findIndex((data) => data.year === cur?.year)
      const prefCode = cur.prefCode
      if (index >= 0) {
        acc[index] = { ...acc[index], [prefCode]: cur[prefCode] }
      } else {
        acc.push({ year: cur.year, [prefCode]: cur[prefCode] })
      }
      return acc
    }, [])
}
