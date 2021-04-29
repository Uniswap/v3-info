import React from 'react'
import styled from 'styled-components'
import { useAllTokenData } from 'state/tokens/hooks'
import { ScrollableX, GreyCard } from 'components/Card'
import { TokenData } from 'state/tokens/reducer'
import Loader from 'components/Loader'
import { AutoColumn } from 'components/Column'
import { RowFixed, RowFlat } from 'components/Row'
import CurrencyLogo from 'components/CurrencyLogo'
import { TYPE } from 'theme'
import { formatDollarAmount } from 'utils/numbers'
import Percent from 'components/Percent'
import { useAllPoolData } from 'state/pools/hooks'
import { PoolData } from 'state/pools/reducer'
import DoubleCurrencyLogo from 'components/DoubleLogo'

const Wrapper = styled(GreyCard)`
  min-width: 220px;
  margin-right: 16px;
`

const Badge = styled.div`
  background-color: ${({ theme }) => theme.blue1};
  padding: 8px;
  border-radius: 12px;
  width: fit-content;
`

const DataCard = ({ poolData }: { poolData: PoolData }) => {
  return (
    <Wrapper>
      <AutoColumn gap="md">
        {/* <RowFixed>
          <DoubleCurrencyLogo currency0={poolData.pool.token0} currency1={poolData.pool.token1} size={32} />
          <TYPE.label ml="8px">
            {poolData.pool.token0.symbol}/{poolData.pool.token1.symbol}
          </TYPE.label>
        </RowFixed> */}
        <TYPE.main>30d APY</TYPE.main>
        <Badge>
          <TYPE.label>{/* <Percent value={poolData.apyMonth} simple={true} /> */}</TYPE.label>
        </Badge>
      </AutoColumn>
    </Wrapper>
  )
}

export default function TopPoolMovers() {
  const allPools = useAllPoolData()

  if (Object.keys(allPools).length === 0) {
    return <Loader />
  }

  return (
    <ScrollableX>
      {/* {Object.keys(allPools).map((address: string) => (
        <DataCard key={'top-card-pool-' + address} poolData={allPools[address].data} />
      ))}
      {Object.keys(allPools).map((address: string) => (
        <DataCard key={'top-card-pool-' + address} poolData={allPools[address].data} />
      ))}
      {Object.keys(allPools).map((address: string) => (
        <DataCard key={'top-card-pool-' + address} poolData={allPools[address].data} />
      ))}
      {Object.keys(allPools).map((address: string) => (
        <DataCard key={'top-card-pool-' + address} poolData={allPools[address].data} />
      ))}
      {Object.keys(allPools).map((address: string) => (
        <DataCard key={'top-card-pool-' + address} poolData={allPools[address].data} />
      ))}
      {Object.keys(allPools).map((address: string) => (
        <DataCard key={'top-card-pool-' + address} poolData={allPools[address].data} />
      ))} */}
    </ScrollableX>
  )
}
