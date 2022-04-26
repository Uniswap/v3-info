import React, { useMemo } from 'react'

import { formatDollarAmount } from '../../../utils/numbers'

import { HideMedium, HideSmall, StyledInternalLink, TYPE } from '../../../theme'

import { useProtocolData } from '../../../state/protocol/hooks'

import { DarkGreyCard } from '../../../components/Card'
import { RowBetween, RowFixed } from '../../../components/Row'
import Percent from '../../../components/Percent'
import TokenTable from '../../../components/tokens/TokenTable'
import PoolTable from '../../../components/pools/PoolTable'
import { useAllPoolData } from '../../../state/pools/hooks'
import { notEmpty } from '../../../utils'
import { useAllTokenData } from '../../../state/tokens/hooks'

function HideSmallWrapper() {
  const [protocolData] = useProtocolData()

  // get all the pool datas that exist
  const allPoolData = useAllPoolData()
  const poolDatas = useMemo(() => {
    return Object.values(allPoolData)
      .map((p) => p.data)
      .filter(notEmpty)
  }, [allPoolData])

  const allTokens = useAllTokenData()

  const formattedTokens = useMemo(() => {
    return Object.values(allTokens)
      .map((t) => t.data)
      .filter(notEmpty)
  }, [allTokens])

  return (
    <>
      <HideSmall>
        <DarkGreyCard>
          <RowBetween>
            <RowFixed>
              <RowFixed mr="20px">
                <TYPE.main mr="4px">Volume 24H: </TYPE.main>
                <TYPE.label mr="4px">{formatDollarAmount(protocolData?.volumeUSD)}</TYPE.label>
                <Percent value={protocolData?.volumeUSDChange} wrap={true} />
              </RowFixed>
              <RowFixed mr="20px">
                <TYPE.main mr="4px">Fees 24H: </TYPE.main>
                <TYPE.label mr="4px">{formatDollarAmount(protocolData?.feesUSD)}</TYPE.label>
                <Percent value={protocolData?.feeChange} wrap={true} />
              </RowFixed>
              <HideMedium>
                <RowFixed mr="20px">
                  <TYPE.main mr="4px">TVL: </TYPE.main>
                  <TYPE.label mr="4px">{formatDollarAmount(protocolData?.tvlUSD)}</TYPE.label>
                  <TYPE.main></TYPE.main>
                  <Percent value={protocolData?.tvlUSDChange} wrap={true} />
                </RowFixed>
              </HideMedium>
            </RowFixed>
          </RowBetween>
        </DarkGreyCard>
      </HideSmall>
      <RowBetween>
        <TYPE.main>Top Tokens</TYPE.main>
        <StyledInternalLink to="tokens">Explore</StyledInternalLink>
      </RowBetween>
      <TokenTable tokenDatas={formattedTokens} />
      <RowBetween>
        <TYPE.main>Top Pools</TYPE.main>
        <StyledInternalLink to="pools">Explore</StyledInternalLink>
      </RowBetween>
      <PoolTable poolDatas={poolDatas} />
      <RowBetween>
        <TYPE.main>Transactions</TYPE.main>
      </RowBetween>
    </>
  )
}

export default HideSmallWrapper
