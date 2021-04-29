import React, { useMemo } from 'react'
import { PageWrapper } from 'pages/styled'
import { AutoColumn } from 'components/Column'
import { OutlineCard } from 'components/Card'
import { TYPE } from 'theme'
import TopPoolMovers from 'components/pools/TopPoolMovers'
import PoolTable from 'components/pools/PoolTable'
import { useAllPoolData } from 'state/pools/hooks'
import { notEmpty } from 'utils'

export default function PoolPage() {
  // get all the pool datas that exist
  const allPoolData = useAllPoolData()
  const poolDatas = useMemo(() => {
    return Object.values(allPoolData)
      .map((p) => p.data)
      .filter(notEmpty)
  }, [allPoolData])

  return (
    <PageWrapper>
      <AutoColumn gap="lg">
        {/* <OutlineCard>
          <AutoColumn gap="lg">
            <TYPE.mediumHeader>Top Movers</TYPE.mediumHeader>
            <TopPoolMovers />
          </AutoColumn>
        </OutlineCard> */}
        <PoolTable poolDatas={poolDatas} />
      </AutoColumn>
    </PageWrapper>
  )
}
