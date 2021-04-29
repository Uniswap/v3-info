import React from 'react'
import { PageWrapper } from 'pages/styled'
import { OutlineCard } from 'components/Card'
import { AutoColumn } from 'components/Column'
import { TYPE } from 'theme'
import TopTokenMovers from 'components/tokens/TopTokenMovers'
import TokenTable from 'components/tokens/TokenTable'

export default function TokensOverview() {
  return (
    <PageWrapper>
      <AutoColumn gap="lg">
        {/* <OutlineCard>
          <AutoColumn gap="lg">
            <TYPE.mediumHeader>Top Movers</TYPE.mediumHeader>
            <TopTokenMovers />
          </AutoColumn>
        </OutlineCard> */}
        <TokenTable />
      </AutoColumn>
    </PageWrapper>
  )
}
