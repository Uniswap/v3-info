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

const Wrapper = styled(GreyCard)`
  min-width: 220px;
  margin-right: 16px;
`

const DataCard = ({ tokenData }: { tokenData: TokenData }) => {
  return (
    <Wrapper>
      {/* <AutoColumn gap="md">
        <RowFixed>
          <CurrencyLogo currency={tokenData.token} />
          <TYPE.label ml="8px">{tokenData.token.symbol}</TYPE.label>
        </RowFixed>
        <TYPE.main>{tokenData.token.name}</TYPE.main>
        <RowFlat>
          <TYPE.label fontSize="24px" mr="6px" lineHeight="20px">
            {formatDollarAmount(tokenData.priceUSD)}
          </TYPE.label>
          <Percent value={tokenData.priceUSDChange} />
        </RowFlat>
      </AutoColumn> */}
    </Wrapper>
  )
}

export default function TopTokenMovers() {
  const allTokens = useAllTokenData()

  if (Object.keys(allTokens).length === 0) {
    return <Loader />
  }

  return (
    <ScrollableX>
      {/* {Object.keys(allTokens).map((address: string) => (
        <DataCard key={'top-card-token-' + address} tokenData={allTokens[address].data} />
      ))}
      {Object.keys(allTokens).map((address: string) => (
        <DataCard key={'top-card-token-' + address} tokenData={allTokens[address].data} />
      ))}
      {Object.keys(allTokens).map((address: string) => (
        <DataCard key={'top-card-token-' + address} tokenData={allTokens[address].data} />
      ))} */}
    </ScrollableX>
  )
}
