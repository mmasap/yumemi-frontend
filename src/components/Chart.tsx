import client, { PopulationResult, PrefectureResult } from '@/lib/api'
import { formatNumber } from '@/util/formatter'
import { useEffect, useState } from 'react'

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
  const [populationData, setPopulationData] = useState<PopulationData>({})
  const chartData = createChartData(props, displayChart, populationData)

  useEffect(() => {
    const fetchTargets = props.prefectures.filter((p) => !populationData[p.prefCode])
    if (fetchTargets.length <= 0) return

    Promise.all(
      fetchTargets.map((p) =>
        client
          .GET('/api/v1/population/composition/perYear', {
            params: { query: { prefCode: p.prefCode } },
          })
          .then((res) => res.data?.result),
      ),
    ).then((res) => {
      setPopulationData((prev) => {
        const next = { ...prev }
        res.forEach((data, index) => {
          next[fetchTargets[index].prefCode] = data
        })
        return next
      })
    })
  }, [populationData, props.prefectures])

  return (
    <Card>
      <Select
        value={displayChart}
        options={selectableCharts.map((charts) => ({ label: charts, value: charts }))}
        onChange={(e) => setDisplayChart(e.target.value as DisplayChart)}
      />
      <ResponsiveContainer width="100%" height={300} style={{ margin: '0 auto' }}>
        <LineChart
          data={chartData}
          margin={{
            top: 32,
            left: 32,
            right: 16,
          }}
        >
          <XAxis dataKey="year">
            <Label value="年度" position="insideBottomRight" offset={-10} />
          </XAxis>
          <YAxis tickFormatter={(value: number) => formatNumber(value)}>
            <Label value="人口数" position="top" offset={16} />
          </YAxis>
          <Tooltip
            formatter={(value: number) => formatNumber(value)}
            itemSorter={(item) => {
              delete item.payload.year
              return Object.values(item.payload)
                .sort((a, b) => Number(b) - Number(a))
                .indexOf(item.value)
            }}
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
      </ResponsiveContainer>
    </Card>
  )
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
