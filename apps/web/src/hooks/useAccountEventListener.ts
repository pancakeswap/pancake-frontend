import replaceBrowserHistory from '@pancakeswap/utils/replaceBrowserHistory'
import { CHAIN_QUERY_NAME } from 'config/chains'
import { ExtendEthereum } from 'global'
import { useEffect, useMemo, useRef } from 'react'
import { isChainSupported } from 'utils/wagmi'
import { useAccount, useAccountEffect, useSwitchChain } from 'wagmi'
import { useAppDispatch } from '../state'
import { clearUserStates } from '../utils/clearUserStates'
import { useSessionChainId } from './useSessionChainId'

export const useAccountEventListener = () => {
  const [, setSessionChainId] = useSessionChainId()
  const dispatch = useAppDispatch()
  const { chainId } = useAccount()
  const { status } = useSwitchChain()
  const chainSwitchStatus = useRef<'idle' | 'pending' | 'error' | 'success'>(status)

  const isBloctoMobileApp = useMemo(() => {
    return typeof window !== 'undefined' && Boolean((window.ethereum as ExtendEthereum)?.isBlocto)
  }, [])

  useAccountEffect({
    onDisconnect() {
      clearUserStates(dispatch, { chainId })
    },
  })

  useEffect(() => {
    const handleUpdate = () => {
      if (chainId && isChainSupported(chainId)) {
        replaceBrowserHistory('chain', CHAIN_QUERY_NAME[chainId])
        setSessionChainId(chainId)
      }
      // Blocto in-app browser throws change event when no account change which causes user state reset therefore
      // this event should not be handled to avoid unexpected behaviour.
      if (!isBloctoMobileApp) {
        clearUserStates(dispatch, { chainId, newChainId: chainId })
      }
    }

    if (chainSwitchStatus.current !== 'success' && status === 'success') {
      handleUpdate()
    }
    chainSwitchStatus.current = 'success'
  }, [chainId, dispatch, isBloctoMobileApp, setSessionChainId, status])
}
