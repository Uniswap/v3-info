import { fetchTicksSurroundingPrice } from 'data/pools/tickData'
import React, { useEffect, useMemo } from 'react'
import { BarChart, Bar, Cell, Brush, ReferenceLine, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
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

  const formattedData = useMemo(() => {
    if (poolTickData) {
      return poolTickData.ticksProcessed.map((t) => {
        return {
          index: t.tickIdx,
          activeLiquidity: parseFloat(t.liquidityActive.toString()),
          price0: parseFloat(t.price0),
          price1: parseFloat(t.price1),
        }
      })
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
              {price0 ?? ''} {poolData?.token1?.symbol}
            </TYPE.label>
          </RowBetween>
          <RowBetween>
            <TYPE.label>{poolData?.token1?.symbol} Price: </TYPE.label>
            <TYPE.label>
              {price1 ?? ''} {poolData?.token0?.symbol}
            </TYPE.label>
          </RowBetween>
          <RowBetween>
            <TYPE.label>Liquidity: </TYPE.label>
            <TYPE.label>{liquidity ? Number(liquidity).toExponential() : '-'}</TYPE.label>
          </RowBetween>
        </AutoColumn>
      </TooltipWrapper>
    )
  }

  if (!poolTickData) {
    return <Loader />
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
          <ReferenceLine y={0} stroke="#000" />
          <Brush dataKey="index" height={30} stroke={theme.bg3} fill={theme.bg1} />
          <Bar dataKey="activeLiquidity" fill="#2172E5">
            {poolTickData.ticksProcessed.map((entry, index) => {
              const active = entry.tickIdx === poolTickData.activeTickIdx
              return <Cell key={`cell-${index}`} fill={active ? theme.pink1 : theme.blue1} />
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Wrapper>
  )
}
