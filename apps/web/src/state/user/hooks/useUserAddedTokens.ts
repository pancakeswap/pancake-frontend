import { useMemo } from 'react'
import { Token } from '@pancakeswap/sdk'
import { deserializeToken } from '@pancakeswap/token-lists'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useUserState } from 'state/user/reducer'

export default function useUserAddedTokens(): Token[] {
  const { chainId } = useActiveChainId()
  const [{ tokens }] = useUserState()
  return useMemo(() => Object.values(tokens?.[chainId] ?? {}).map(deserializeToken), [tokens, chainId])
}
