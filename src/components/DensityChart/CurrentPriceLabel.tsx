import React from 'react'
import { ChartEntry } from './index'
import { PoolData } from 'state/pools/reducer'
import useTheme from 'hooks/useTheme'
import styled from 'styled-components'
import { AutoColumn } from 'components/Column'
import { RowFixed } from 'components/Row'
import { TYPE } from 'theme'

const Wrapper = styled.div`
  border-radius: 8px;
  padding: 6px 12px;
  color: white;
  width: fit-content;
  font-size: 14px;
  background-color: ${({ theme }) => theme.bg2};
`

interface LabelProps {
  x: number
  y: number
  index: number
}

interface CurrentPriceLabelProps {
  data: ChartEntry[] | undefined
  chartProps: any
  poolData: PoolData
}

export function CurrentPriceLabel({ data, chartProps, poolData }: CurrentPriceLabelProps) {
  const theme = useTheme()
  const labelData = chartProps as LabelProps
  const entryData = data?.[labelData.index]
  if (entryData?.isCurrent) {
    const price0 = entryData.price0
    const price1 = entryData.price1
    return (
      <g>
        <foreignObject x={labelData.x - 80} y={318} width={'100%'} height={100}>
          <Wrapper>
            <AutoColumn gap="6px">
              <RowFixed align="center">
                <TYPE.main mr="6px">Current Price</TYPE.main>
                <div
                  style={{
                    marginTop: '2px',
                    height: '6px',
                    width: '6px',
                    borderRadius: '50%',
                    backgroundColor: theme.pink1,
                  }}
                ></div>
              </RowFixed>
              <TYPE.label>{`1 ${poolData.token0.symbol} = ${Number(price0).toLocaleString(undefined, {
                minimumSignificantDigits: 1,
              })} ${poolData.token1.symbol}`}</TYPE.label>
              <TYPE.label>{`1 ${poolData.token1.symbol} = ${Number(price1).toLocaleString(undefined, {
                minimumSignificantDigits: 1,
              })} ${poolData.token0.symbol}`}</TYPE.label>
            </AutoColumn>
          </Wrapper>
        </foreignObject>
      </g>
    )
  }
  return null
}
