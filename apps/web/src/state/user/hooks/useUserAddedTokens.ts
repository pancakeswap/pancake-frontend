import { useMemo } from 'react'
import { Token } from '@pancakeswap/sdk'
import { deserializeToken } from '@pancakeswap/token-lists'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useUserState } from 'state/user/reducer'

export default function useUserAddedTokens(): Token[] {
  const { chainId } = useActiveChainId()
  const [state] = useUserState()
  return useMemo(() => {
    return Object.values(state?.tokens?.[chainId] ?? {}).map(deserializeToken)
  }, [state, chainId])
}
