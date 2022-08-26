import { Currency, NATIVE } from '@pancakeswap/sdk'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import currencyId from 'utils/currencyId'

export const useCurrencySelectRoute = () => {
  const { chainId } = useActiveWeb3React()
  const router = useRouter()
  const [currencyIdA, currencyIdB] = router.query.currency || []

  const handleCurrencyASelect = useCallback(
    (currencyA_: Currency) => {
      const newCurrencyIdA = currencyId(currencyA_)
      if (newCurrencyIdA === currencyIdB) {
        router.replace(`/add/${currencyIdB}/${currencyIdA}`, undefined, { shallow: true })
      } else if (currencyIdB) {
        router.replace(`/add/${newCurrencyIdA}/${currencyIdB}`, undefined, { shallow: true })
      } else {
        router.replace(`/add/${newCurrencyIdA}`, undefined, { shallow: true })
      }
    },
    [currencyIdB, router, currencyIdA],
  )
  const handleCurrencyBSelect = useCallback(
    (currencyB_: Currency) => {
      const newCurrencyIdB = currencyId(currencyB_)
      if (currencyIdA === newCurrencyIdB) {
        if (currencyIdB) {
          router.replace(`/add/${currencyIdB}/${newCurrencyIdB}`, undefined, { shallow: true })
        } else {
          router.replace(`/add/${newCurrencyIdB}`, undefined, { shallow: true })
        }
      } else {
        router.replace(`/add/${currencyIdA || NATIVE[chainId]?.symbol}/${newCurrencyIdB}`, undefined, { shallow: true })
      }
    },
    [currencyIdA, router, currencyIdB, chainId],
  )

  return {
    handleCurrencyASelect,
    handleCurrencyBSelect,
  }
}
