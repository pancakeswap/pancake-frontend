import replaceBrowserHistory from '@pancakeswap/utils/replaceBrowserHistory'
import { CHAIN_QUERY_NAME } from 'config/chains'
import { useEffect } from 'react'
import { isChainSupported } from 'utils/wagmi'
import { useAccount, useAccountEffect } from 'wagmi'
import { useAppDispatch } from '../state'
import { clearUserStates } from '../utils/clearUserStates'
import { useSessionChainId } from './useSessionChainId'

export const useAccountEventListener = () => {
  const [, setSessionChainId] = useSessionChainId()
  const dispatch = useAppDispatch()
  const { chainId } = useAccount()

  useAccountEffect({
    onDisconnect() {
      clearUserStates(dispatch, { chainId })
    },
  })

  useEffect(() => {
    if (chainId && isChainSupported(chainId)) {
      replaceBrowserHistory('chain', CHAIN_QUERY_NAME[chainId])
      setSessionChainId(chainId)
    }
  }, [chainId, setSessionChainId])
}
