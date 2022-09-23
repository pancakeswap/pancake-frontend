import { useCallback, useEffect, useMemo, useState } from 'react'
import { Token } from '@pancakeswap/sdk'
import { useModal } from '@pancakeswap/uikit'

import { useRouter } from 'next/router'

import shouldShowSwapWarning from 'utils/shouldShowSwapWarning'

import { useCurrency, useAllTokens } from 'hooks/Tokens'
import { useDefaultsFromURLSearch } from 'state/swap/hooks'
import ImportTokenWarningModal from 'components/ImportTokenWarningModal'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

import SwapWarningModal from '../components/SwapWarningModal'

export default function useWarningImport() {
  const router = useRouter()
  const loadedUrlParams = useDefaultsFromURLSearch()
  const { chainId } = useActiveWeb3React()

  // swap warning state
  const [swapWarningCurrency, setSwapWarningCurrency] = useState(null)

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ]

  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c?.isToken) ?? [],
    [loadedInputCurrency, loadedOutputCurrency],
  )

  const defaultTokens = useAllTokens()

  const importTokensNotInDefault =
    urlLoadedTokens &&
    urlLoadedTokens.filter((token: Token) => {
      return !(token.address in defaultTokens) && token.chainId === chainId
    })

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

  const swapWarningHandler = useCallback((currencyInput) => {
    const showSwapWarning = shouldShowSwapWarning(currencyInput)
    if (showSwapWarning) {
      setSwapWarningCurrency(currencyInput)
    } else {
      setSwapWarningCurrency(null)
    }
  }, [])

  useEffect(() => {
    if (importTokensNotInDefault.length > 0) {
      onPresentImportTokenWarningModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importTokensNotInDefault.length])

  return swapWarningHandler
}
