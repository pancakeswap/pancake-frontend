import { Currency } from '@pancakeswap/sdk'
import { PANCAKE_ETH_DEFAULT } from 'config/constants/lists'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useAccount } from 'wagmi'
import { ConnectorNames } from 'config/wallet'
import { ExtendEthereum } from 'global'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { selectorByUrlsAtom } from 'state/lists/hooks'
import { useIsMMSupportChain } from './useIsMMSupportChain'
import { IS_SUPPORT_NATIVE_TOKEN, NATIVE_CURRENCY_ADDRESS } from '../constants'

const QUOTING_WHITE_LIST = {
  1: PANCAKE_ETH_DEFAULT,
}

export const useTokenList = (url?: string): Record<string, string> => {
  const listsByUrl = useAtomValue(selectorByUrlsAtom)
  const data = listsByUrl[url ?? '']
  const whiteList = useMemo(() => {
    const list = {}
    if (data?.current) {
      data?.current.tokens.forEach((d) => {
        list[d.address.toLowerCase()] = d.address.toLowerCase()
      })
    }
    return list
  }, [data])
  return whiteList
}

export const useIsMMQuotingPair = (
  inputCurrency: Currency | undefined,
  outputCurrency: Currency | undefined,
): boolean => {
  const { chainId } = useActiveWeb3React()
  const list = useTokenList(QUOTING_WHITE_LIST[chainId])
  const isMMSupportChain = useIsMMSupportChain()
  const { connector, isConnected } = useAccount()

  return useMemo(() => {
    if (!isMMSupportChain || !chainId || !list || !inputCurrency || !outputCurrency) return false
    if (
      isConnected &&
      (connector?.id === ConnectorNames.Blocto ||
        connector?.id === 'safe' ||
        Boolean((window.ethereum as ExtendEthereum)?.isBlocto))
    )
      return false
    if (
      list[
        (inputCurrency.isToken
          ? inputCurrency.address
          : IS_SUPPORT_NATIVE_TOKEN
          ? inputCurrency.wrapped.address
          : NATIVE_CURRENCY_ADDRESS
        ).toLowerCase()
      ] &&
      list[
        (outputCurrency.isToken
          ? outputCurrency.address
          : IS_SUPPORT_NATIVE_TOKEN
          ? inputCurrency.wrapped.address
          : NATIVE_CURRENCY_ADDRESS
        ).toLowerCase()
      ]
    )
      return true
    return false
  }, [isMMSupportChain, chainId, list, inputCurrency, outputCurrency, isConnected, connector?.id])
}
