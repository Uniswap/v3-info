import React, { Dispatch, SetStateAction, ReactNode } from 'react'
import { BarChart, ResponsiveContainer, XAxis, Tooltip, Bar, Brush } from 'recharts'
import styled from 'styled-components'
import Card from 'components/Card'
import { RowBetween } from 'components/Row'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import useTheme from 'hooks/useTheme'
import { OptimismNetworkInfo } from 'constants/networks'
import { formatDollarAmount } from 'utils/numbers'
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
  bottomMargin,
}: {
  x: number
  y: number
  width: number
  height: number
  fill: string
  bottomMargin?: boolean
}) => {
  return (
    <g>
      <rect
        x={x}
        y={bottomMargin ? y - 4 : y}
        fill={fill}
        width={width}
        height={height === 0 ? 0 : Math.max(height, bottomMargin ? 4 : 0)}
        rx="1"
      />
    </g>
  )
}

const CombinedChart = ({
  data,
  color = '#56B2A4',
  setValue,
  setLabel,
  value,
  label,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  minHeight = DEFAULT_HEIGHT,
  ...rest
}: LineChartProps) => {
  const theme = useTheme()
  const parsedValue = value

  return (
    <Wrapper minHeight={minHeight} {...rest}>
      <RowBetween>
        {topLeft ?? null}
        {topRight ?? null}
      </RowBetween>
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
            tickFormatter={(time) => dayjs(time).format('DD')}
            minTickGap={10}
          />
          <Tooltip
            cursor={{ fill: theme.bg2 }}
            contentStyle={{
              backgroundColor: theme.bg1,
              borderRadius: '8px',
              border: '1px solid ' + theme.bg3,
              padding: '16px',
            }}
            formatter={(value: number, name: string, props: { payload: { time: string; value: number } }) => {
              if (setValue && parsedValue !== props.payload.value) {
                setValue(props.payload.value)
              }
              const formattedTime = dayjs(props.payload.time).format('MMM D, YYYY')
              if (setLabel && label !== formattedTime) setLabel(formattedTime)

              return `${formatDollarAmount(value)}`
            }}
          />
          <Bar
            dataKey="ethereum"
            stackId="a"
            fill={color}
            shape={(props) => {
              return <CustomBar height={props.height} width={props.width} x={props.x} y={props.y} fill={color} />
            }}
          />
          <Bar
            dataKey="v2"
            stackId="a"
            fill={theme.blue2}
            shape={(props) => {
              return <CustomBar height={props.height} width={props.width} x={props.x} y={props.y} fill={theme.blue2} />
            }}
          />
          <Bar
            dataKey="optimism"
            stackId="a"
            fill={'red'}
            shape={(props) => {
              return (
                <CustomBar
                  height={props.height}
                  width={props.width}
                  x={props.x}
                  y={props.y}
                  fill={OptimismNetworkInfo.primaryColor}
                  bottomMargin={true}
                />
              )
            }}
          />
          <Brush dataKey="time" height={20} fill={theme.bg1} tickFormatter={() => ''} />
        </BarChart>
      </ResponsiveContainer>
      <RowBetween>
        {bottomLeft ?? null}
        {bottomRight ?? null}
      </RowBetween>
    </Wrapper>
  )
}

export default CombinedChart
