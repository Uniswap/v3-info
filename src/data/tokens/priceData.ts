import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import gql from 'graphql-tag'
import { client } from 'apollo/client'
import { getBlocksFromTimestamps } from 'hooks/useBlocksFromTimestamps'
import { splitQuery } from 'utils/queries'

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

export async function fetchTokenPriceData(address: string, interval: number) {
  // start and end bounds
  const startTimestamp = 1619170975
  const endTimestamp = dayjs.utc().unix()

  // create an array of hour start times until we reach current hour
  const timestamps = []
  let time = startTimestamp
  while (time < endTimestamp) {
    timestamps.push(time)
    time += interval
  }

  // backout if invalid timestamp format
  if (timestamps.length === 0) {
    return []
  }

  try {
    // fetch blocks based on timestamp
    const blocks = await getBlocksFromTimestamps(timestamps, 100)
    if (!blocks || blocks.length === 0) {
      return []
    }

    const blocksNew = [
      {
        timestamp: '1619669248',
        number: '8495649',
      },
      {
        timestamp: '1619665648',
        number: '8495452',
      },
      {
        timestamp: '1619662573',
        number: '8495204',
      },
      {
        timestamp: '1619658853',
        number: '8494956',
      },
      {
        timestamp: '1619632641',
        number: '8493209',
      },
    ]

    const prices: any | undefined = await splitQuery(PRICES_BY_BLOCK, client, [address], blocksNew, 50)

    // format token ETH price results
    const values: {
      timestamp: string
      derivedETH: number
      priceUSD: number
    }[] = []
    for (const row in prices) {
      const timestamp = row.split('t')[1]
      const derivedETH = parseFloat(prices[row]?.derivedETH)
      if (timestamp) {
        values.push({
          timestamp,
          derivedETH,
          priceUSD: 0,
        })
      }
    }

    // go through eth usd prices and assign to original values array
    let index = 0
    for (const brow in prices) {
      const timestamp = brow.split('b')[1]
      if (timestamp) {
        values[index].priceUSD = parseFloat(prices[brow].ethPriceUSD) * values[index].derivedETH
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

    return formattedHistory
  } catch {
    return undefined
  }
}
