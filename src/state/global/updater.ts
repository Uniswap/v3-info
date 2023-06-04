import { useEffect } from 'react'
import { useAlternateL1DataSource } from 'state/application/hooks'
import { useDispatch } from 'react-redux'
import { AppDispatch, DESTROY_SESSION } from 'state'

/**
 * Resets Uniswap related state on data source change
 */
export default function ResetUpdater(): null {
  // client for data fetching
  const [isAlternate] = useAlternateL1DataSource()
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch({ type: DESTROY_SESSION })
  }, [dispatch, isAlternate])

  return null
}
