import { UAuthConnector } from '@uauth/web3-react'
import { useWeb3React } from '@web3-react/core'
import { useCallback } from 'react'

export function useAccount() {
  const { account, connector } = useWeb3React()

  const callAccount = useCallback(async (): Promise<{ account: string }> => {
    if (connector instanceof UAuthConnector) {
      const user = await connector.uauth.user()
      return { account: user.sub }
    }

    return { account }
  }, [account, connector])

  return { callAccount }
}

export default useAccount
