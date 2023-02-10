import { Currency } from '@pancakeswap/sdk'
import { PANCAKE_ETH_DEFAULT } from 'config/constants/lists'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { selectorByUrlsAtom } from 'state/lists/hooks'
import { NATIVE_CURRENCY_ADDRESS } from '../constants'
import { useIsMMSupportChain } from './useIsMMSupportChain'

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

  return useMemo(() => {
    if (!isMMSupportChain || !chainId || !list || !inputCurrency || !outputCurrency) return false
    if (
      list[(inputCurrency.isToken ? inputCurrency.address : NATIVE_CURRENCY_ADDRESS).toLowerCase()] &&
      list[(outputCurrency.isToken ? outputCurrency.address : NATIVE_CURRENCY_ADDRESS).toLowerCase()]
    )
      return true
    return false
  }, [chainId, list, inputCurrency, outputCurrency, isMMSupportChain])
}
