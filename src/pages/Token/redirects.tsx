import React from 'react'
import TokenPage from './TokenPage'
import { isAddress } from 'ethers'
import { Navigate, useParams } from 'react-router-dom'

export function RedirectInvalidToken() {
  const { address } = useParams<{ address?: string }>()

  if (!address || !isAddress(address)) {
    return <Navigate to={`/`} replace />
  }
  return <TokenPage />
}
