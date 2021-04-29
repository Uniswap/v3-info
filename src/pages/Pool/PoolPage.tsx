import React from 'react'
import { PageWrapper } from 'pages/styled'
import { AutoColumn } from 'components/Column'
import { OutlineCard } from 'components/Card'
import { TYPE } from 'theme'
import TopPoolMovers from 'components/pools/TopPoolMovers'
import PoolTable from 'components/pools/PoolTable'

export default function PoolPage() {
  return (
    <PageWrapper>
      <AutoColumn gap="lg">
        <OutlineCard>
          <AutoColumn gap="lg">
            <TYPE.mediumHeader>Top Movers</TYPE.mediumHeader>
            <TopPoolMovers />
          </AutoColumn>
        </OutlineCard>
        {/* <PoolTable /> */}
      </AutoColumn>
    </PageWrapper>
  )
}
