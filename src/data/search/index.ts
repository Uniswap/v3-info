import { useAllTokenData } from 'state/tokens/hooks'
import { TokenData } from 'state/tokens/reducer'
import { useFetchedTokenDatas } from 'data/tokens/tokenData'
import gql from 'graphql-tag'
import { useState, useEffect, useMemo } from 'react'
import { client } from 'apollo/client'
import { usePoolDatas, useAllPoolData } from 'state/pools/hooks'
import { PoolData } from 'state/pools/reducer'
import { notEmpty, escapeRegExp } from 'utils'
import useDebounce from 'hooks/useDebounce'

export const TOKEN_SEARCH = gql`
  query tokens($value: String, $id: String) {
    asSymbol: tokens(
      where: { symbol_contains: $value }
      orderBy: totalValueLockedUSD
      orderDirection: desc
      subgraphError: allow
    ) {
      id
      symbol
      name
      totalValueLockedUSD
    }
    asName: tokens(
      where: { name_contains: $value }
      orderBy: totalValueLockedUSD
      orderDirection: desc
      subgraphError: allow
    ) {
      id
      symbol
      name
      totalValueLockedUSD
    }
    asAddress: tokens(where: { id: $id }, orderBy: totalValueLockedUSD, orderDirection: desc, subgraphError: allow) {
      id
      symbol
      name
      totalValueLockedUSD
    }
  }
`

export const POOL_SEARCH = gql`
  query pools($tokens: [Bytes]!, $id: String) {
    as0: pools(where: { token0_in: $tokens }, subgraphError: allow) {
      id
      feeTier
      token0 {
        id
        symbol
        name
      }
      token1 {
        id
        symbol
        name
      }
    }
    as1: pools(where: { token1_in: $tokens }, subgraphError: allow) {
      id
      feeTier
      token0 {
        id
        symbol
        name
      }
      token1 {
        id
        symbol
        name
      }
    }
    asAddress: pools(where: { id: $id }, subgraphError: allow) {
      id
      feeTier
      token0 {
        id
        symbol
        name
      }
      token1 {
        id
        symbol
        name
      }
    }
  }
`

interface TokenRes {
  asSymbol: {
    id: string
    symbol: string
    name: string
    totalValueLockedUSD: string
  }[]
  asName: {
    id: string
    symbol: string
    name: string
    totalValueLockedUSD: string
  }[]
  asAddress: {
    id: string
    symbol: string
    name: string
    totalValueLockedUSD: string
  }[]
}

interface PoolResFields {
  id: string
  feeTier: string
  token0: {
    id: string
    symbol: string
    name: string
  }
  token1: {
    id: string
    symbol: string
    name: string
  }
}

interface PoolRes {
  as0: PoolResFields[]
  as1: PoolResFields[]
  asAddress: PoolResFields[]
}

export function useFetchSearchResults(
  value: string
): {
  tokens: TokenData[]
  pools: PoolData[]
  loading: boolean
} {
  const debouncedValue = useDebounce(value, 300)

  const allTokens = useAllTokenData()
  const allPools = useAllPoolData()

  const [tokenData, setTokenData] = useState<TokenRes | undefined>()
  const [poolData, setPoolData] = useState<PoolRes | undefined>()

  // fetch data based on search input
  useEffect(() => {
    async function fetch() {
      try {
        const tokens = await client.query<TokenRes>({
          query: TOKEN_SEARCH,
          variables: {
            value: debouncedValue ? debouncedValue.toUpperCase() : '',
            id: debouncedValue,
          },
        })
        const pools = await client.query<PoolRes>({
          query: POOL_SEARCH,
          variables: {
            tokens: tokens.data.asSymbol?.map((t) => t.id),
            id: debouncedValue,
          },
        })

        if (tokens.data) {
          setTokenData(tokens.data)
        }
        if (pools.data) {
          setPoolData(pools.data)
        }
      } catch (e) {
        console.log(e)
      }
    }
    if (debouncedValue && debouncedValue.length > 0) {
      fetch()
    }
  }, [debouncedValue])

  const allFetchedTokens = useMemo(() => {
    if (tokenData) {
      return [...tokenData.asAddress, ...tokenData.asName, ...tokenData.asSymbol]
    }
    return []
  }, [tokenData])

  const allFetchedPools = useMemo(() => {
    if (poolData) {
      return [...poolData.asAddress, ...poolData.as0, ...poolData.as1]
    }
    return []
  }, [poolData])

  // format as token and pool datas
  const { data: tokenFullDatas, loading: tokenFullLoading } = useFetchedTokenDatas(allFetchedTokens.map((t) => t.id))

  const poolDatasFull = usePoolDatas(allFetchedPools.map((p) => p.id))
  const formattedTokens = useMemo(() => (tokenFullDatas ? Object.values(tokenFullDatas) : []), [tokenFullDatas])

  const newTokens = useMemo(() => {
    return formattedTokens.filter((t) => !Object.keys(allTokens).includes(t.address))
  }, [allTokens, formattedTokens])

  const combinedTokens = useMemo(() => {
    return [
      ...newTokens,
      ...Object.values(allTokens)
        .map((t) => t.data)
        .filter(notEmpty),
    ]
  }, [allTokens, newTokens])

  const filteredSortedTokens = useMemo(() => {
    return combinedTokens.filter((t) => {
      const regexMatches = Object.keys(t).map((tokenEntryKey) => {
        const isAddress = debouncedValue.slice(0, 2) === '0x'
        if (tokenEntryKey === 'address' && isAddress) {
          return t[tokenEntryKey].match(new RegExp(escapeRegExp(debouncedValue), 'i'))
        }
        if (tokenEntryKey === 'symbol' && !isAddress) {
          return t[tokenEntryKey].match(new RegExp(escapeRegExp(debouncedValue), 'i'))
        }
        if (tokenEntryKey === 'name' && !isAddress) {
          return t[tokenEntryKey].match(new RegExp(escapeRegExp(debouncedValue), 'i'))
        }
        return false
      })
      return regexMatches.some((m) => m)
    })
  }, [combinedTokens, debouncedValue])

  const newPools = useMemo(() => {
    return poolDatasFull.filter((p) => !Object.keys(allPools).includes(p.address))
  }, [allPools, poolDatasFull])

  const combinedPools = useMemo(() => {
    return [
      ...newPools,
      ...Object.values(allPools)
        .map((p) => p.data)
        .filter(notEmpty),
    ]
  }, [allPools, newPools])

  const symbols = debouncedValue
    ? debouncedValue
        .split(/[\/|\s]/) //split using forward slash and space
        .map((val) => val.toUpperCase())
        .filter((val) => !!val)
    : []

  const filteredSortedPools = useMemo(() => {
    return combinedPools.filter((t) => {
      const regexMatches = Object.keys(t).map((key) => {
        const isAddress = debouncedValue.slice(0, 2) === '0x'
        if (key === 'address' && isAddress) {
          return t[key].match(new RegExp(escapeRegExp(debouncedValue), 'i'))
        }
        if ((key === 'token0' || key === 'token1') && !isAddress) {
          return (
            t[key].name.match(new RegExp(escapeRegExp(debouncedValue), 'i')) ||
            t[key].symbol.toLocaleLowerCase().match(new RegExp(escapeRegExp(debouncedValue.toLocaleLowerCase()), 'i'))
          )
        }
        return false
      })
      const fuzzyString = `${t.token0.symbol} ${t.token1.symbol} ${t.feeTier / 10000}%`
      const fuzzyRegex = new RegExp(`(${symbols.join('|')})`, 'g')
      const fuzzyMatch = fuzzyString.match(fuzzyRegex)?.length === symbols.length
      return regexMatches.some((m) => m) || fuzzyMatch
    })
  }, [combinedPools, debouncedValue])

  return {
    tokens: filteredSortedTokens,
    pools: filteredSortedPools,
    loading: tokenFullLoading,
  }
}
