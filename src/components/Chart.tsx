import client, { PopulationResult, PrefectureResult } from '@/lib/api'
import { useEffect, useState } from 'react'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
  // ResponsiveContainer,
} from 'recharts'

type ChartProps = {
  prefectures: PrefectureResult[]
}

type PopulationData = {
  [prefCode: number]: PopulationResult | undefined
}

type ChartData = Array<{ year: number; [prefCode: number]: number }>

type DisplayChart = PopulationResult['data'][number]['label']
const selectableCharts: Array<DisplayChart> = ['総人口', '年少人口', '生産年齢人口', '老年人口']

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
    <>
      <select
        value={displayChart}
        onChange={(e) => setDisplayChart(e.target.value as DisplayChart)}
      >
        {selectableCharts.map((chart) => (
          <option key={chart} value={chart}>
            {chart}
          </option>
        ))}
      </select>
      <LineChart
        width={500}
        height={300}
        data={chartData}
        margin={{
          top: 30,
          right: 60,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year">
          <Label value="年度" position="right" offset={25} />
        </XAxis>
        <YAxis>
          <Label value="人口数" position="top" offset={10} />
        </YAxis>
        <Tooltip />
        <Legend />
        {props.prefectures.map((prefecture) => (
          <Line
            key={prefecture.prefCode}
            type="monotone"
            dataKey={prefecture.prefCode}
            name={prefecture.prefName}
            activeDot={{ r: 8 }}
          />
        ))}
      </LineChart>
    </>
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
