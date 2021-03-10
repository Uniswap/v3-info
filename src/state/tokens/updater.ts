import { useAllTokenData, useUpdateTokenData } from './hooks'
import { useEffect } from 'react'
import { fetchTopTokens } from 'data/tokens'
import { TokenData } from './reducer'

export default function Updater(): null {
  const allTokenData = useAllTokenData()
  const updateTokenDatas = useUpdateTokenData()

  // if not top tokens know, fetch top token datas from subgraph
  useEffect(() => {
    async function fetchTokens() {
      const tokenDatas: TokenData[] = fetchTopTokens()
      if (tokenDatas) {
        updateTokenDatas(tokenDatas)
      }
    }

    if (Object.keys(allTokenData).length === 0) {
      fetchTokens()
    }
  }, [allTokenData, updateTokenDatas])

  return null
}
