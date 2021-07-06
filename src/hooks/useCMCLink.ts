import { useState, useEffect } from 'react'

// endpoint to check asset exists
const cmcEndpoint = 'https://3rdparty-apis.coinmarketcap.com/v1/cryptocurrency/contract?address='

// page to view assets
const cmcAssetUrl = 'https://coinmarketcap.com/currencies/'

/**
 * Check if asset exists on CMC, if exists
 * return  url, if not return undefined
 * @param address token address
 */
export function useCMCLink(address: string, symbol: string | undefined): string | undefined {
  const [link, setLink] = useState<string | undefined>(undefined)

  console.log(symbol)

  useEffect(() => {
    async function fetchLink() {
      const result = await fetch(cmcEndpoint + address)
      // if link exists, format the url
      if (result.status === 200 && symbol) {
        console.log(result)
        const formatted = cmcAssetUrl + symbol.replace(/\s/g, '-')
        console.log(formatted)
        setLink(formatted)
      }
    }
    if (address && symbol) {
      fetchLink()
    }
  }, [address, symbol])

  return link
}
