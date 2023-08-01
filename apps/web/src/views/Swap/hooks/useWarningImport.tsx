import { Token } from '@pancakeswap/sdk'
import { useModal } from '@pancakeswap/uikit'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useRouter } from 'next/router'
import useSWRImmutable from 'swr/immutable'
import shouldShowSwapWarning from 'utils/shouldShowSwapWarning'

import ImportTokenWarningModal from 'components/ImportTokenWarningModal'
import { useAllTokens, useCurrency } from 'hooks/Tokens'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Field } from 'state/swap/actions'
import { useSwapState } from 'state/swap/hooks'
import { isAddress } from 'utils'

import SwapWarningModal from '../components/SwapWarningModal'

export default function useWarningImport() {
  const router = useRouter()
  const { chainId, isWrongNetwork } = useActiveWeb3React()
  const {
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()

  // swap warning state
  const [swapWarningCurrency, setSwapWarningCurrency] = useState(null)

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [useCurrency(inputCurrencyId), useCurrency(outputCurrencyId)]

  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c?.isToken) ?? [],
    [loadedInputCurrency, loadedOutputCurrency],
  )

  const defaultTokens = useAllTokens()

  const { data: loadedTokenList } = useSWRImmutable(['token-list'])

  const importTokensNotInDefault = useMemo(() => {
    return !isWrongNetwork && urlLoadedTokens && !!loadedTokenList
      ? urlLoadedTokens.filter((token: Token) => {
          const checksummedAddress = isAddress(token.address) || ''

          return !(checksummedAddress in defaultTokens) && token.chainId === chainId
        })
      : []
  }, [chainId, defaultTokens, isWrongNetwork, loadedTokenList, urlLoadedTokens])

  const [onPresentSwapWarningModal] = useModal(<SwapWarningModal swapCurrency={swapWarningCurrency} />, false)
  const [onPresentImportTokenWarningModal] = useModal(
    <ImportTokenWarningModal tokens={importTokensNotInDefault} onCancel={() => router.push('/swap')} />,
  )

  useEffect(() => {
    if (swapWarningCurrency) {
      onPresentSwapWarningModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swapWarningCurrency])

  const swapWarningHandler = useCallback(
    (currencyInput) => {
      const showSwapWarning = shouldShowSwapWarning(chainId, currencyInput)
      if (showSwapWarning) {
        setSwapWarningCurrency(currencyInput)
      } else {
        setSwapWarningCurrency(null)
      }
    },
    [chainId],
  )

  useEffect(() => {
    if (importTokensNotInDefault.length > 0) {
      onPresentImportTokenWarningModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importTokensNotInDefault.length])

  return swapWarningHandler
}
