import React, { useEffect } from 'react'
import styled from 'styled-components'

import { AutoColumn } from 'components/Column'
import { ResponsiveRow } from 'components/Row'

import { TYPE } from 'theme'

import { useProtocolTransactions } from 'state/protocol/hooks'

import { PageWrapper, ThemedBackgroundGlobal } from 'pages/styled'

import { useActiveNetworkVersion } from 'state/application/hooks'

import TransactionsTable from '../../components/TransactionsTable'
import { LineChart, BarChart, HideSmall } from './components'

const ChartWrapper = styled.div`
  width: 49%;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
  `};
`

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [activeNetwork] = useActiveNetworkVersion()
  const [transactions] = useProtocolTransactions()

  return (
    <PageWrapper>
      <ThemedBackgroundGlobal backgroundColor={activeNetwork.bgColor} />
      <AutoColumn gap="16px">
        <TYPE.main>Uniswap Overview</TYPE.main>
        <ResponsiveRow>
          <ChartWrapper>
            <LineChart />
          </ChartWrapper>
          <ChartWrapper>
            <BarChart />
          </ChartWrapper>
        </ResponsiveRow>
        <HideSmall />
        {transactions ? <TransactionsTable transactions={transactions} color={activeNetwork.primaryColor} /> : null}
      </AutoColumn>
    </PageWrapper>
  )
}
