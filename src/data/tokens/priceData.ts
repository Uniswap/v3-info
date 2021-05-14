import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import gql from 'graphql-tag'
import { client } from 'apollo/client'
import { getBlocksFromTimestamps } from 'hooks/useBlocksFromTimestamps'
import { splitQuery } from 'utils/queries'

export const OLDEST_DAY_QUERY = gql`
  query oldestDayDatas($tokenAddress: Bytes!) {
    tokenDayDatas(first: 1, where: { token: $tokenAddress }, orderBy: date, orderDirection: asc) {
      date
    }
  }
`

interface OldestDayResponse {
  tokenDayDatas: {
    date: string
  }[]
}

// format dayjs with the libraries that we need
dayjs.extend(utc)
dayjs.extend(weekOfYear)

export const PRICES_BY_BLOCK = (tokenAddress: string, blocks: any) => {
  let queryString = 'query blocks {'
  queryString += blocks.map(
    (block: any) => `
      t${block.timestamp}:token(id:"${tokenAddress}", block: { number: ${block.number} }) { 
        derivedETH
      }
    `
  )
  queryString += ','
  queryString += blocks.map(
    (block: any) => `
      b${block.timestamp}: bundle(id:"1", block: { number: ${block.number} }) { 
        ethPriceUSD
      }
    `
  )

  queryString += '}'
  return gql(queryString)
}

export async function fetchTokenPriceData(
  address: string,
  interval: number
): Promise<
  | {
      timestamp: string
      open: number
      close: number
    }[]
  | undefined
> {
  // start and end bounds

  try {
    const { data, loading, error } = await client.query<OldestDayResponse>({
      query: OLDEST_DAY_QUERY,
      variables: {
        tokenAddress: address,
      },
    })

    if (!data || loading || error) {
      console.log('bad oldest day query ')
      return undefined
    }

    const endTimestamp = dayjs.utc().unix()
    const startTimestamp = parseFloat(data.tokenDayDatas[0]?.date ?? 0)

    if (!startTimestamp) {
      return []
    }

    // create an array of hour start times until we reach current hour
    const timestamps = []
    let time = startTimestamp
    while (time <= endTimestamp) {
      timestamps.push(time)
      time += interval
    }

    // backout if invalid timestamp format
    if (timestamps.length === 0) {
      console.log('no timestamps')
      return []
    }

    // fetch blocks based on timestamp
    const blocks = await getBlocksFromTimestamps(timestamps, 1000)
    if (!blocks || blocks.length === 0) {
      console.log('no blocks')
      return []
    }

    const prices: any | undefined = await splitQuery(PRICES_BY_BLOCK, client, [address], blocks, 1000)
    const pricesCopy = Object.assign([], prices)

    if (prices && pricesCopy) {
      // format token ETH price results
      const values: {
        timestamp: string
        derivedETH: number | undefined
        priceUSD: number
      }[] = []

      for (const row in prices) {
        const timestamp = row.split('t')[1]
        const derivedETH = prices[row]?.derivedETH ? parseFloat(prices[row]?.derivedETH) : undefined
        if (timestamp && derivedETH) {
          values.push({
            timestamp,
            derivedETH,
            priceUSD: 0,
          })
        }
      }

      // go through eth usd prices and assign to original values array
      let index = 0
      for (const brow in pricesCopy) {
        const timestamp = brow.split('b')[1]
        const derivedETH = values[index]?.derivedETH
        if (timestamp && derivedETH) {
          values[index].priceUSD = parseFloat(pricesCopy[brow]?.ethPriceUSD ?? 0) * derivedETH
          index += 1
        }
      }

      const formattedHistory = []

      // for each hour, construct the open and close price
      for (let i = 0; i < values.length - 1; i++) {
        formattedHistory.push({
          timestamp: values[i].timestamp,
          open: values[i].priceUSD,
          close: values[i + 1].priceUSD,
        })
      }

      console.log(formattedHistory)

      return formattedHistory
    } else {
      console.log('no price data loaded')
      return undefined
    }
  } catch (e) {
    console.log(e)
    return undefined
  }
}
