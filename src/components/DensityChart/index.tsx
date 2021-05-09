import { fetchTicksSurroundingPrice, TickProcessed } from 'data/pools/tickData'
import React, { useEffect, useMemo } from 'react'
import {
  BarChart,
  Bar,
  Cell,
  CartesianGrid,
  Brush,
  LabelList,
  Label,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import Loader from 'components/Loader'
import styled from 'styled-components'
import { LightCard } from 'components/Card'
import { AutoColumn } from 'components/Column'
import { RowBetween } from 'components/Row'
import { TYPE } from 'theme'
import useTheme from 'hooks/useTheme'
import { usePoolDatas, usePoolTickData } from 'state/pools/hooks'
// import { Token, TokenAmount } from '@uniswap/sdk'
// import { isAddress } from 'utils'
// import { Pool, Position, Tick, TICK_SPACINGS } from '@uniswap/v3-sdk'
import { PoolData } from 'state/pools/reducer'

const Wrapper = styled.div`
  width: 100%;
  height: 400px;
`

const TooltipWrapper = styled(LightCard)`
  width: 360px;
`

interface DensityChartProps {
  address: string
}

interface ChartEntry {
  index: number
  isCurrent: number
  activeLiquidity: number
  price0: number
  price1: number
}

export default function DensityChart({ address }: DensityChartProps) {
  // theming
  const theme = useTheme()

  const poolData: PoolData = usePoolDatas([address])[0]
  // const formattedAddress0 = isAddress(poolData.token0.address)
  // const formattedAddress1 = isAddress(poolData.token1.address)

  // tokens
  // const token0 = useMemo(() => {
  //   return poolData && formattedAddress0 && formattedAddress1
  //     ? new Token(1, formattedAddress0, poolData.token0.decimals)
  //     : undefined
  // }, [formattedAddress0, formattedAddress1, poolData])

  // const token1 = useMemo(() => {
  //   return poolData && formattedAddress1 && formattedAddress1
  //     ? new Token(1, formattedAddress1, poolData.token1.decimals)
  //     : undefined
  // }, [formattedAddress1, poolData])

  // const poolLiquidity = poolData?.liquidity
  // const poolSqrtPrice = poolData?.sqrtPrice
  // const tick = poolData?.tick
  // const feeTier = poolData?.feeTier

  // const pool = useMemo(() => {
  //   if (poolLiquidity && tick && poolSqrtPrice && token0 && token1 && feeTier) {
  //     const pool = new Pool(token0, token1, feeTier, poolSqrtPrice, poolLiquidity, tick)
  //     return pool
  //   }
  //   return undefined
  // }, [feeTier, poolLiquidity, poolSqrtPrice, tick, token0, token1])

  const [poolTickData, updatePoolTickData] = usePoolTickData(address)

  useEffect(() => {
    async function fetch() {
      const { data } = await fetchTicksSurroundingPrice(address)
      if (data) {
        updatePoolTickData(address, data)
      }
    }
    if (!poolTickData) {
      fetch()
    }
  }, [address, poolTickData, updatePoolTickData])

  const TICKS_PER_GROUP = 1

  const formattedData = useMemo(() => {
    if (poolTickData) {
      let currentGroup = 1
      let currentEntry: ChartEntry = {
        index: 0,
        isCurrent: 0,
        activeLiquidity: 0,
        price0: 0,
        price1: 0,
      }
      return poolTickData.ticksProcessed.reduce((grouped: ChartEntry[], t: TickProcessed, i) => {
        const active = t.tickIdx === poolTickData.activeTickIdx

        // check if need to update current entry
        if (i % TICKS_PER_GROUP === 0 && i !== 0) {
          currentGroup = currentGroup + 1
          grouped.push(currentEntry)
          currentEntry = {
            index: currentEntry.index + 1,
            activeLiquidity: 0,
            isCurrent: 0,
            price0: 0,
            price1: 0,
          }
        }
        currentEntry.isCurrent = active ? parseFloat(t.liquidityActive.toString()) : 0
        currentEntry.activeLiquidity = active
          ? 0
          : currentEntry.activeLiquidity + parseFloat(t.liquidityActive.toString())
        currentEntry.price0 = currentEntry.price0 + parseFloat(t.price0)
        currentEntry.price1 = currentEntry.price1 + parseFloat(t.price1)
        return grouped
      }, [])
    }
    return undefined
  }, [poolTickData])

  const CustomToolTip = (props: any) => {
    const index = props.label as number
    const price0 = poolTickData?.ticksProcessed[index]?.price0
    const price1 = poolTickData?.ticksProcessed[index]?.price1
    const liquidity = poolTickData?.ticksProcessed[index]?.liquidityActive ?? undefined

    return (
      <TooltipWrapper>
        <AutoColumn gap="md">
          <TYPE.main color={theme.text3}>Tick stats</TYPE.main>
          <RowBetween>
            <TYPE.label>{poolData?.token0?.symbol} Price: </TYPE.label>
            <TYPE.label>
              {price0
                ? Number(price0).toLocaleString(undefined, {
                    minimumSignificantDigits: 1,
                  })
                : ''}{' '}
              {poolData?.token1?.symbol}
            </TYPE.label>
          </RowBetween>
          <RowBetween>
            <TYPE.label>{poolData?.token1?.symbol} Price: </TYPE.label>
            <TYPE.label>
              {price1
                ? Number(price1).toLocaleString(undefined, {
                    minimumSignificantDigits: 1,
                  })
                : ''}{' '}
              {poolData?.token0?.symbol}
            </TYPE.label>
          </RowBetween>
          {/* <RowBetween>
            <TYPE.label>Liquidity : </TYPE.label>
            <TYPE.label>{liquidity}</TYPE.label>
          </RowBetween> */}
        </AutoColumn>
      </TooltipWrapper>
    )
  }

  if (!poolTickData) {
    return <Loader />
  }

  const CurrentLabel = () => {
    return <TYPE.main>hey</TYPE.main>
  }

  return (
    <Wrapper>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={formattedData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="4 4 4" stroke="#2C2F36" />
          <Tooltip content={CustomToolTip} />
          <XAxis reversed={true} tick={false}>
            <Label value="Liquidity Range" offset={0} position="insideBottom" fill={theme.text3} />
          </XAxis>
          {/* <Brush dataKey="index" height={30} stroke={theme.bg3} fill={theme.bg1} /> */}
          <Bar dataKey="activeLiquidity" fill="#2172E5">
            {poolTickData.ticksProcessed.map((entry, index) => {
              const active = entry.tickIdx === poolTickData.activeTickIdx
              return <Cell key={`cell-${index}`} fill={active ? theme.blue2 : theme.blue1} />
            })}
          </Bar>
          <Bar dataKey="isCurrent" fill={theme.pink1} isAnimationActive={false}>
            <LabelList dataKey="isCurrent" position="top" content={() => <CurrentLabel />} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Wrapper>
  )
}
