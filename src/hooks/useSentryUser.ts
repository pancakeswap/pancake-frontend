import * as Sentry from '@sentry/react'
import { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'

function useSentryUser() {
  const { account } = useWeb3React()
  useEffect(() => {
    if (account) {
      Sentry.setUser({ account })
    }
  }, [account])
}

export default useSentryUser
