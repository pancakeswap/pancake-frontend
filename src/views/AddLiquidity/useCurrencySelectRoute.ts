import { Currency } from '@pancakeswap/sdk'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import currencyId from 'utils/currencyId'

const PATH = 'add'

export const useCurrencySelectRoute = () => {
  const router = useRouter()
  const [currencyIdA, currencyIdB] = router.query.currency || []

  const handleCurrencyASelect = useCallback(
    (currencyA_: Currency) => {
      const newCurrencyIdA = currencyId(currencyA_)
      if (newCurrencyIdA === currencyIdB) {
        router.replace(`/${PATH}/${currencyIdB}/${currencyIdA}`, undefined, { shallow: true })
      } else if (currencyIdB) {
        router.replace(`/${PATH}/${newCurrencyIdA}/${currencyIdB}`, undefined, { shallow: true })
      } else {
        router.replace(`/${PATH}/${newCurrencyIdA}`, undefined, { shallow: true })
      }
    },
    [currencyIdB, router, currencyIdA],
  )
  const handleCurrencyBSelect = useCallback(
    (currencyB_: Currency) => {
      const newCurrencyIdB = currencyId(currencyB_)
      if (currencyIdA === newCurrencyIdB) {
        if (currencyIdB) {
          router.replace(`/${PATH}/${currencyIdB}/${newCurrencyIdB}`, undefined, { shallow: true })
        } else {
          router.replace(`/${PATH}/${newCurrencyIdB}`, undefined, { shallow: true })
        }
      } else {
        router.replace(`/${PATH}/${currencyIdA || 'BNB'}/${newCurrencyIdB}`, undefined, { shallow: true })
      }
    },
    [currencyIdA, router, currencyIdB],
  )

  return {
    handleCurrencyASelect,
    handleCurrencyBSelect,
  }
}
