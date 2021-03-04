import React from 'react'
import styled from 'styled-components'
import { AutoColumn } from 'components/Column'
import { TYPE } from 'theme'
import { RowBetween, RowFixed } from 'components/Row'
import LineChart from 'components/LineChart'
import { dummyData } from '../../components/LineChart/data'
import useTheme from 'hooks/useTheme'
import { useProtocolData } from 'state/protocol/hooks'
import { DarkGreyCard } from 'components/Card'
import { formatDollarAmount } from 'utils/numbers'
import { ButtonPrimary } from 'components/Button'

const Wrapper = styled.div`
  width: 90%;
`

const ChartWrapper = styled.div`
  width: 49%;
`

export default function Home() {
  const theme = useTheme()

  const [protocolData] = useProtocolData()

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
        <DarkGreyCard>
          <RowBetween>
            <RowFixed>
              <RowFixed mr="16px">
                <TYPE.main mr="4px">24HR USD: </TYPE.main>
                <TYPE.label>{formatDollarAmount(protocolData?.usdVolume)}</TYPE.label>
              </RowFixed>
              <RowFixed mr="16px">
                <TYPE.main mr="4px">24HR Transcations: </TYPE.main>
                <TYPE.label>{protocolData?.txnCount}</TYPE.label>
              </RowFixed>
              <RowFixed mr="16px">
                <TYPE.main mr="4px">Liquidity USD: </TYPE.main>
                <TYPE.label>{formatDollarAmount(protocolData?.liquidityUsd)}</TYPE.label>
              </RowFixed>
            </RowFixed>
            <ButtonPrimary width="260px">More Protocol Analytics</ButtonPrimary>
          </RowBetween>
        </DarkGreyCard>
      </AutoColumn>
    </Wrapper>
  )
}
