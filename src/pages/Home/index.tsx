import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { AutoColumn } from 'components/Column'
import { TYPE } from 'theme'
import { RowBetween, RowFixed } from 'components/Row'
import LineChart from 'components/LineChart'
import { dummyData } from '../../components/LineChart/data'
import useTheme from 'hooks/useTheme'
import { useProtocolData } from 'state/protocol/hooks'
import { DarkGreyCard, OutlineCard } from 'components/Card'
import { formatDollarAmount } from 'utils/numbers'
import { ButtonPrimary } from 'components/Button'
import Percent from 'components/Percent'
import { StyledInternalLink } from '../../theme/components'
import TopTokenMovers from 'components/tokens/TopTokenMovers'
import TokenTable from 'components/tokens/TokenTable'

const Wrapper = styled.div`
  width: 90%;
`

const ChartWrapper = styled.div`
  width: 49%;
`

export default function Home() {
  const theme = useTheme()

  const [protocolData] = useProtocolData()

  const [volumeHover, setVolumeHover] = useState<number | undefined>()
  const [liquidityHover, setLiquidityHover] = useState<number | undefined>()
  // if hover value undefined, reset to current day value
  useEffect(() => {
    if (!volumeHover && protocolData) {
      setVolumeHover(protocolData.volumeUSD)
    }
  }, [protocolData, volumeHover])
  // if hover value undefined, reset to current day value
  useEffect(() => {
    if (!liquidityHover && protocolData) {
      setLiquidityHover(protocolData.liquidityUSD)
    }
  }, [liquidityHover, protocolData])

  return (
    <Wrapper>
      <AutoColumn gap="30px">
        <TYPE.mediumHeader>Uniswap Overview</TYPE.mediumHeader>
        <RowBetween>
          <ChartWrapper>
            <LineChart
              data={dummyData}
              height={220}
              color={theme.pink1}
              setValue={setLiquidityHover}
              topLeft={
                <AutoColumn gap="md">
                  <TYPE.mediumHeader fontSize="16px">Virtual Liquidity</TYPE.mediumHeader>
                  <TYPE.largeHeader fontSize="32px">{formatDollarAmount(liquidityHover, 2, true)}</TYPE.largeHeader>
                </AutoColumn>
              }
            />
          </ChartWrapper>
          <ChartWrapper>
            <LineChart
              height={220}
              data={dummyData}
              color={theme.blue1}
              setValue={setVolumeHover}
              topLeft={
                <AutoColumn gap="md">
                  <TYPE.mediumHeader fontSize="16px">24HR Volume</TYPE.mediumHeader>
                  <TYPE.largeHeader fontSize="32px">{formatDollarAmount(volumeHover, 2, true)}</TYPE.largeHeader>
                </AutoColumn>
              }
            />
          </ChartWrapper>
        </RowBetween>
        <DarkGreyCard>
          <RowBetween>
            <RowFixed>
              <RowFixed mr="16px">
                <TYPE.main mr="4px">24HR USD: </TYPE.main>
                <TYPE.label mr="4px">{formatDollarAmount(protocolData?.volumeUSD)}</TYPE.label>
                <Percent value={protocolData?.volumeUSDChange} wrap={true} />
              </RowFixed>
              <RowFixed mr="16px">
                <TYPE.main mr="4px">24HR Transcations: </TYPE.main>
                <TYPE.label mr="4px">{protocolData?.txnCount}</TYPE.label>
                <Percent value={protocolData?.txnCountChange} wrap={true} />
              </RowFixed>
              <RowFixed mr="16px">
                <TYPE.main mr="4px">Liquidity USD: </TYPE.main>
                <TYPE.label mr="4px">{formatDollarAmount(protocolData?.liquidityUSD)}</TYPE.label>
                <Percent value={protocolData?.liquidityUSDChange} wrap={true} />
              </RowFixed>
            </RowFixed>
            <ButtonPrimary width="260px">More Protocol Analytics</ButtonPrimary>
          </RowBetween>
        </DarkGreyCard>
        <RowBetween>
          <TYPE.mediumHeader>Top Tokens</TYPE.mediumHeader>
          <StyledInternalLink to="/tokens" fontSize="20px">
            Explore
          </StyledInternalLink>
        </RowBetween>
        <OutlineCard>
          <AutoColumn gap="lg">
            <TYPE.mediumHeader>Top Movers</TYPE.mediumHeader>
            <TopTokenMovers />
          </AutoColumn>
        </OutlineCard>
        <TokenTable />
      </AutoColumn>
    </Wrapper>
  )
}
