import React, { useEffect, useMemo } from 'react'
import { PageWrapper } from 'pages/styled'
import { AutoColumn } from 'components/Column'
import { TYPE } from 'theme'
import PoolTable from 'components/pools/PoolTable'
import { useAllPoolData, usePoolDatas } from 'state/pools/hooks'
import { notEmpty } from 'utils'
import { useSavedPools } from 'state/user/hooks'
import { DarkGreyCard } from 'components/Card'
import { Trace } from '@uniswap/analytics'
// import TopPoolMovers from 'components/pools/TopPoolMovers'

export default function PoolPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // get all the pool datas that exist
  const allPoolData = useAllPoolData()
  const poolDatas = useMemo(() => {
    return Object.values(allPoolData)
      .map((p) => p.data)
      .filter(notEmpty)
  }, [allPoolData])

  const [savedPools] = useSavedPools()
  const watchlistPools = usePoolDatas(savedPools)

  return (
    <Trace page="pools-overview-page" shouldLogImpression>
      <PageWrapper>
        <AutoColumn $gap="lg">
          <TYPE.main>Your Watchlist</TYPE.main>
          {watchlistPools.length > 0 ? (
            <PoolTable poolDatas={watchlistPools} />
          ) : (
            <DarkGreyCard>
              <TYPE.main>Saved pools will appear here</TYPE.main>
            </DarkGreyCard>
          )}
          <TYPE.main>All Pools</TYPE.main>
          <PoolTable poolDatas={poolDatas} />
        </AutoColumn>
      </PageWrapper>
    </Trace>
  )
}
