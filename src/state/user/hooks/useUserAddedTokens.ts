import { useMemo } from 'react'
import { ChainId, Token } from '@pancakeswap/sdk'
import { useSelector } from 'react-redux'
import { useWeb3React } from '@web3-react/core'
import { AppState } from '../../index'
import { deserializeToken } from './helpers'

export default function useUserAddedTokens(): Token[] {
  const { chainId } = useWeb3React()
  const serializedTokensMap = useSelector<AppState, AppState['user']['tokens']>(({ user: { tokens } }) => tokens)

  return useMemo(() => {
    if (!chainId) return []
    return Object.values(serializedTokensMap?.[chainId as ChainId] ?? {}).map(deserializeToken)
  }, [serializedTokensMap, chainId])
}
