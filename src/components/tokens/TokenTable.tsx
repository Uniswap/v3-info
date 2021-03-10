import React from 'react'
import styled from 'styled-components'
import { TYPE } from 'theme'
import { DarkGreyCard } from 'components/Card'
import { TokenData } from '../../state/tokens/reducer'
import { useAllTokenData } from 'state/tokens/hooks'
import Loader from 'components/Loader'
import { AutoColumn } from 'components/Column'
import CurrencyLogo from 'components/CurrencyLogo'
import { RowFixed } from 'components/Row'
import { formatDollarAmount } from 'utils/numbers'
import Percent from 'components/Percent'

const Wrapper = styled(DarkGreyCard)`
  width: 100%;
`

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;

  grid-template-columns: 20px 1.5fr repeat(5, 1fr);

  @media screen and (max-width: 900px) {
    grid-template-columns: 20px 1.5fr repeat(4, 1fr);
    & :nth-child(4) {
      display: none;
    }
  }

  @media screen and (max-width: 700px) {
    grid-template-columns: 20px 1.5fr repeat(3, 1fr);
    & :nth-child(4) {
      display: none;
    }
    & :nth-child(5) {
      display: none;
    }
  }
`

// responsive text
const Label = styled(TYPE.label)<{ end?: boolean }>`
  display: flex;
  font-size: 16px;
  justify-content: ${({ end }) => (end ? 'flex-end' : 'flex-start')};
  align-items: center;
`

const DataRow = ({ tokenData, index }: { tokenData: TokenData; index: number }) => {
  return (
    <ResponsiveGrid>
      <Label>{index + 1}</Label>
      <Label>
        <RowFixed>
          <CurrencyLogo currency={tokenData.token} />
        </RowFixed>
        <TYPE.label ml="8px">
          {tokenData.token.symbol} ({tokenData.token.name})
        </TYPE.label>
      </Label>
      <Label end={true}>{formatDollarAmount(tokenData.priceUSD)}</Label>
      <Label end={true}>
        <Percent value={tokenData.priceUSDChange} />
      </Label>
      <Label end={true}>
        <Percent value={tokenData.priceUSDChangeWeek} />
      </Label>
      <Label end={true}>{formatDollarAmount(tokenData.volumeUSD)}</Label>
      <Label end={true}>{formatDollarAmount(tokenData.liquidityUSD)}</Label>
    </ResponsiveGrid>
  )
}

export default function TokenTable() {
  const allTokenData = useAllTokenData()

  if (!allTokenData) {
    return <Loader />
  }

  return (
    <Wrapper>
      <AutoColumn gap="lg">
        <ResponsiveGrid>
          <Label>#</Label>
          <Label>Name</Label>
          <Label end={true}>Price</Label>
          <Label end={true}>24Hr</Label>
          <Label end={true}>7d</Label>
          <Label end={true}>Volume</Label>
          <Label end={true}>Liq</Label>
        </ResponsiveGrid>
        {Object.keys(allTokenData).map((address, i) => (
          <DataRow index={i} key={i} tokenData={allTokenData[address].data} />
        ))}
      </AutoColumn>
    </Wrapper>
  )
}
