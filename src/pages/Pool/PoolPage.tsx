import React, { useMemo, useState, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components'
import { useColor } from 'hooks/useColor'
import { ThemedBackground, PageWrapper } from 'pages/styled'
import { feeTierPercent, getEtherscanLink } from 'utils'
import { AutoColumn } from 'components/Column'
import { RowBetween, RowFixed, AutoRow } from 'components/Row'
import { TYPE, StyledInternalLink } from 'theme'
import Loader, { LocalLoader } from 'components/Loader'
import { ExternalLink, Download } from 'react-feather'
import { ExternalLink as StyledExternalLink } from '../../theme/components'
import useTheme from 'hooks/useTheme'
import CurrencyLogo from 'components/CurrencyLogo'
import { formatDollarAmount, formatAmount } from 'utils/numbers'
import Percent from 'components/Percent'
import { ButtonPrimary, ButtonGray, SavedIcon } from 'components/Button'
import { DarkGreyCard, GreyCard, GreyBadge } from 'components/Card'
import { usePoolDatas, usePoolChartData, usePoolTransactions } from 'state/pools/hooks'
import LineChart from 'components/LineChart'
import { unixToDate } from 'utils/date'
import { ToggleWrapper, ToggleElementFree } from 'components/Toggle/index'
import BarChart from 'components/BarChart'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import TransactionTable from 'components/TransactionsTable'
import { useSavedPools } from 'state/user/hooks'
import { fetchTicksSurroundingPrice } from 'data/pools/tickData'
import DensityChart from 'components/DensityChart'

const ContentLayout = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-gap: 1em;

  @media screen and (max-width: 800px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
`

const TokenButton = styled(GreyCard)`
  padding: 8px 12px;
  border-radius: 10px;
  :hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const ResponsiveRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    align-items: flex-start;
    row-gap: 24px;
    width: 100%:
  `};
`

enum ChartView {
  TVL,
  VOL,
  PRICE,
  DENSITY,
}

export default function PoolPage({
  match: {
    params: { address },
  },
}: RouteComponentProps<{ address: string }>) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // theming
  const backgroundColor = useColor(address)
  const theme = useTheme()

  // token data
  const poolData = usePoolDatas([address])[0]
  const chartData = usePoolChartData(address)
  const transactions = usePoolTransactions(address)

  const [view, setView] = useState(ChartView.DENSITY)
  const [latestValue, setLatestValue] = useState<number | undefined>()

  const formattedTvlData = useMemo(() => {
    if (chartData) {
      return chartData.map((day) => {
        return {
          time: unixToDate(day.date),
          value: day.totalValueLockedUSD,
        }
      })
    } else {
      return []
    }
  }, [chartData])

  const formattedVolumeData = useMemo(() => {
    if (chartData) {
      return chartData.map((day) => {
        return {
          time: unixToDate(day.date),
          value: day.volumeUSD,
        }
      })
    } else {
      return []
    }
  }, [chartData])

  //watchlist
  const [savedPools, addSavedPool] = useSavedPools()

  return (
    <PageWrapper>
      <ThemedBackground backgroundColor={backgroundColor} />
      {poolData ? (
        <AutoColumn gap="32px">
          <RowBetween>
            <AutoRow gap="4px">
              <StyledInternalLink to="/">
                <TYPE.main>{`Home > `}</TYPE.main>
              </StyledInternalLink>
              <StyledInternalLink to="/pools">
                <TYPE.label>{` Pools `}</TYPE.label>
              </StyledInternalLink>
              <TYPE.main>{` > `}</TYPE.main>
              <TYPE.label>{` ${poolData.token0.symbol} / ${poolData.token1.symbol} ${feeTierPercent(
                poolData.feeTier
              )} `}</TYPE.label>
            </AutoRow>
            <AutoRow gap="10px" justify="flex-end">
              <SavedIcon fill={savedPools.includes(address)} onClick={() => addSavedPool(address)} />
              <StyledExternalLink href={getEtherscanLink(1, address, 'address')}>
                <ExternalLink stroke={theme.text2} />
              </StyledExternalLink>
            </AutoRow>
          </RowBetween>
          <ResponsiveRow align="flex-end">
            <AutoColumn gap="lg">
              <RowFixed gap="4px">
                <DoubleCurrencyLogo address0={poolData.token0.address} address1={poolData.token1.address} size={24} />
                <TYPE.label
                  ml="8px"
                  mr="8px"
                  fontSize="24px"
                >{` ${poolData.token0.symbol} / ${poolData.token1.symbol} `}</TYPE.label>
                <GreyBadge>{feeTierPercent(poolData.feeTier)}</GreyBadge>
              </RowFixed>
              <ResponsiveRow>
                <StyledInternalLink to={'/tokens/' + poolData.token0.address}>
                  <TokenButton>
                    <RowFixed>
                      <CurrencyLogo address={poolData.token0.address} size={'20px'} />
                      <TYPE.label fontSize="16px" ml="4px" style={{ whiteSpace: 'nowrap' }} width={'fit-content'}>
                        {`1 ${poolData.token0.symbol} =  ${formatAmount(poolData.token1Price)} ${
                          poolData.token1.symbol
                        }`}
                      </TYPE.label>
                    </RowFixed>
                  </TokenButton>
                </StyledInternalLink>
                <StyledInternalLink to={'/tokens/' + poolData.token1.address}>
                  <TokenButton>
                    <RowFixed>
                      <CurrencyLogo address={poolData.token1.address} size={'20px'} />
                      <TYPE.label fontSize="16px" ml="4px" style={{ whiteSpace: 'nowrap' }} width={'fit-content'}>
                        {`1 ${poolData.token1.symbol} =  ${formatAmount(poolData.token0Price)} ${
                          poolData.token0.symbol
                        }`}
                      </TYPE.label>
                    </RowFixed>
                  </TokenButton>
                </StyledInternalLink>
              </ResponsiveRow>
            </AutoColumn>
            <AutoColumn gap="lg">
              <RowFixed>
                <ButtonGray width="170px" mr="12px">
                  <RowBetween>
                    <Download size={24} />
                    <div style={{ display: 'flex', alignItems: 'center' }}>Add Liquidity</div>
                  </RowBetween>
                </ButtonGray>
                <ButtonPrimary width="100px">Trade</ButtonPrimary>
              </RowFixed>
            </AutoColumn>
          </ResponsiveRow>
          <ContentLayout>
            <DarkGreyCard>
              <AutoColumn gap="lg">
                <GreyCard padding="16px">
                  <AutoColumn gap="md">
                    <TYPE.main>Total Tokens Locked</TYPE.main>
                    <RowBetween>
                      <RowFixed>
                        <CurrencyLogo address={poolData.token0.address} size={'20px'} />
                        <TYPE.label fontSize="14px" ml="8px">
                          {poolData.token0.symbol}
                        </TYPE.label>
                      </RowFixed>
                      <TYPE.label fontSize="14px">{formatAmount(poolData.tvlToken0)}</TYPE.label>
                    </RowBetween>
                    <RowBetween>
                      <RowFixed>
                        <CurrencyLogo address={poolData.token1.address} size={'20px'} />
                        <TYPE.label fontSize="14px" ml="8px">
                          {poolData.token1.symbol}
                        </TYPE.label>
                      </RowFixed>
                      <TYPE.label fontSize="14px">{formatAmount(poolData.tvlToken1)}</TYPE.label>
                    </RowBetween>
                  </AutoColumn>
                </GreyCard>
                <AutoColumn gap="4px">
                  <TYPE.main fontWeight={400}>TVL</TYPE.main>
                  <TYPE.label fontSize="24px">{formatDollarAmount(poolData.tvlUSD)}</TYPE.label>
                  <Percent value={poolData.tvlUSDChange} />
                </AutoColumn>
                <AutoColumn gap="4px">
                  <TYPE.main fontWeight={400}>Volume 24h</TYPE.main>
                  <TYPE.label fontSize="24px">{formatDollarAmount(poolData.volumeUSD)}</TYPE.label>
                  <Percent value={poolData.volumeUSDChange} />
                </AutoColumn>
                <AutoColumn gap="4px">
                  <TYPE.main fontWeight={400}>7d Trading Vol</TYPE.main>
                  <TYPE.label fontSize="24px">{formatDollarAmount(poolData.volumeUSDWeek)}</TYPE.label>
                </AutoColumn>
              </AutoColumn>
            </DarkGreyCard>
            <DarkGreyCard>
              <RowBetween align="flex-start">
                <AutoColumn>
                  <TYPE.main>
                    {view === ChartView.VOL ? '24H Volume' : view === ChartView.TVL ? 'TVL' : 'Liquidity Distribution'}
                  </TYPE.main>
                  <TYPE.label fontSize="24px" height="30px">
                    {latestValue
                      ? formatDollarAmount(latestValue)
                      : view === ChartView.VOL
                      ? formatDollarAmount(formattedVolumeData[formattedVolumeData.length - 1]?.value)
                      : view === ChartView.DENSITY
                      ? ''
                      : formatDollarAmount(formattedTvlData[formattedTvlData.length - 1]?.value)}
                  </TYPE.label>
                </AutoColumn>
                <ToggleWrapper width="160px">
                  <ToggleElementFree
                    isActive={view === ChartView.VOL}
                    fontSize="12px"
                    onClick={() => (view === ChartView.VOL ? setView(ChartView.TVL) : setView(ChartView.VOL))}
                  >
                    Volume
                  </ToggleElementFree>
                  <ToggleElementFree
                    isActive={view === ChartView.TVL}
                    fontSize="12px"
                    onClick={() => (view === ChartView.TVL ? setView(ChartView.DENSITY) : setView(ChartView.TVL))}
                  >
                    TVL
                  </ToggleElementFree>
                  <ToggleElementFree
                    isActive={view === ChartView.DENSITY}
                    fontSize="12px"
                    onClick={() => (view === ChartView.DENSITY ? setView(ChartView.VOL) : setView(ChartView.DENSITY))}
                  >
                    Liq
                  </ToggleElementFree>
                </ToggleWrapper>
              </RowBetween>
              {view === ChartView.TVL ? (
                <LineChart data={formattedTvlData} color={backgroundColor} minHeight={340} setValue={setLatestValue} />
              ) : view === ChartView.VOL ? (
                <BarChart
                  data={formattedVolumeData}
                  color={backgroundColor}
                  minHeight={340}
                  setValue={setLatestValue}
                />
              ) : (
                <DensityChart address={address} />
              )}
            </DarkGreyCard>
          </ContentLayout>
          <TYPE.main fontSize="24px">Transactions</TYPE.main>
          <DarkGreyCard>
            {transactions ? <TransactionTable transactions={transactions} /> : <LocalLoader fill={false} />}
          </DarkGreyCard>
        </AutoColumn>
      ) : (
        <Loader />
      )}
    </PageWrapper>
  )
}
