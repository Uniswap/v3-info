import React from 'react'
import styled from 'styled-components'
import { AutoColumn } from 'components/Column'
import { TYPE } from 'theme'
import { RowBetween } from 'components/Row'
import LineChart from 'components/LineChart'
import { dummyData } from '../../components/LineChart/data'
import useTheme from 'hooks/useTheme'
import BarChart from 'components/BarChart'

const Wrapper = styled.div`
  width: 90%;
`

const ChartWrapper = styled.div`
  width: 49%;
`

export default function Home() {
  const theme = useTheme()

  return (
    <Wrapper>
      <AutoColumn gap="30px">
        <TYPE.mediumHeader>Uniswap Overview</TYPE.mediumHeader>
        <RowBetween>
          <ChartWrapper>
            <LineChart data={dummyData} color={theme.pink1} />
          </ChartWrapper>
          <ChartWrapper>
            <LineChart data={dummyData} color={theme.blue1} />
          </ChartWrapper>
        </RowBetween>
      </AutoColumn>
    </Wrapper>
  )
}
