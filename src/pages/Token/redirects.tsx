import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import TokenPage from './TokenPage'
import { isAddress } from 'ethers/lib/utils'

export function RedirectInvalidToken(props: RouteComponentProps<{ address: string }>) {
  const {
    match: {
      params: { address },
    },
  } = props

  if (!isAddress(address)) {
    return <Redirect to={`/`} />
  }
  return <TokenPage {...props} />
}
