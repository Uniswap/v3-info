import React, { Dispatch, SetStateAction, ReactNode } from 'react'
import { BarChart, ResponsiveContainer, XAxis, Tooltip, Bar } from 'recharts'
import styled from 'styled-components'
import Card from 'components/Card'
import { RowBetween } from 'components/Row'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import useTheme from 'hooks/useTheme'
import { VolumeWindow } from 'types'
import { LoadingRows } from 'components/Loader'
dayjs.extend(utc)

const DEFAULT_HEIGHT = 300

const Wrapper = styled(Card)`
  width: 100%;
  height: ${DEFAULT_HEIGHT}px;
  padding: 1rem;
  padding-right: 2rem;
  display: flex;
  background-color: ${({ theme }) => theme.bg0};
  flex-direction: column;
  > * {
    font-size: 1rem;
  }
`

export type LineChartProps = {
  data: any[]
  color?: string | undefined
  height?: number | undefined
  minHeight?: number
  setValue?: Dispatch<SetStateAction<number | undefined>> // used for value on hover
  setLabel?: Dispatch<SetStateAction<string | undefined>> // used for label of valye
  value?: number
  label?: string
  activeWindow?: VolumeWindow
  topLeft?: ReactNode | undefined
  topRight?: ReactNode | undefined
  bottomLeft?: ReactNode | undefined
  bottomRight?: ReactNode | undefined
} & React.HTMLAttributes<HTMLDivElement>

const CustomBar = ({
  x,
  y,
  width,
  height,
  fill,
}: {
  x: number
  y: number
  width: number
  height: number
  fill: string
}) => {
  if (isNaN(x) || isNaN(y) || isNaN(width) || isNaN(height)) {
    return null
  }
  return (
    <g>
      <rect x={x} y={y} fill={fill} width={width} height={height} rx="2" />
    </g>
  )
}

const Chart = ({
  data,
  color = '#56B2A4',
  setValue,
  setLabel,
  value,
  label,
  activeWindow,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  minHeight = DEFAULT_HEIGHT,
  ...rest
}: LineChartProps) => {
  const theme = useTheme()
  const parsedValue = value

  const now = dayjs()

  return (
    <Wrapper $minHeight={minHeight} {...rest}>
      <RowBetween style={{ alignItems: 'flex-start' }}>
        {topLeft ?? null}
        {topRight ?? null}
      </RowBetween>
      {data?.length === 0 ? (
        <LoadingRows>
          <div />
          <div />
          <div />
        </LoadingRows>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            onMouseLeave={() => {
              setLabel && setLabel(undefined)
              setValue && setValue(undefined)
            }}
          >
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tickFormatter={(time) => dayjs(time).format(activeWindow === VolumeWindow.monthly ? 'MMM' : 'DD')}
              minTickGap={10}
            />
            <Tooltip
              cursor={{ fill: theme?.bg2 }}
              contentStyle={{ display: 'none' }}
              formatter={(value: number, name: string, config: { payload: { time: string; value: number } }) => {
                if (setValue && parsedValue !== config.payload.value) {
                  setValue(config.payload.value)
                }
                const formattedTime = dayjs(config.payload.time).format('MMM D')
                const formattedTimeDaily = dayjs(config.payload.time).format('MMM D YYYY')
                const formattedTimePlusWeek = dayjs(config.payload.time).add(1, 'week')
                const formattedTimePlusMonth = dayjs(config.payload.time).add(1, 'month')

                if (setLabel && label !== formattedTime) {
                  if (activeWindow === VolumeWindow.weekly) {
                    const isCurrent = formattedTimePlusWeek.isAfter(now)
                    setLabel(
                      formattedTime + '-' + (isCurrent ? 'current' : formattedTimePlusWeek.format('MMM D, YYYY')),
                    )
                  } else if (activeWindow === VolumeWindow.monthly) {
                    const isCurrent = formattedTimePlusMonth.isAfter(now)
                    setLabel(
                      formattedTime + '-' + (isCurrent ? 'current' : formattedTimePlusMonth.format('MMM D, YYYY')),
                    )
                  } else {
                    setLabel(formattedTimeDaily)
                  }
                }
              }}
            />
            <Bar
              dataKey="value"
              fill={color}
              shape={(props: { height: number; width: number; x: number; y: number }) => {
                return <CustomBar height={props.height} width={props.width} x={props.x} y={props.y} fill={color} />
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
      <RowBetween>
        {bottomLeft ?? null}
        {bottomRight ?? null}
      </RowBetween>
    </Wrapper>
  )
}

export default Chart
