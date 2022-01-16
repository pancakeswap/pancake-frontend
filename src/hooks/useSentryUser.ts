import * as Sentry from '@sentry/react'
import { useEffect } from 'react'
import useActiveWeb3React from './useActiveWeb3React'

function useSentryUser() {
  const { account } = useActiveWeb3React()
  useEffect(() => {
    if (account) {
      Sentry.setUser({ account })
    }
  }, [account])
}

export default useSentryUser
