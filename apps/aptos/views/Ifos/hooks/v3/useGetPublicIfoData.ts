import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { Ifo, IfoStatus } from 'config/constants/types'
import { useState, useCallback } from 'react'
import { PublicIfoData } from '../../types'

/**
 * Gets all public data of an IFO
 */
const useGetPublicIfoData = (ifo: Ifo): PublicIfoData => {
  // const cakePriceUsd = usePriceCakeBusd()
  // const lpTokenPriceInUsd = useLpTokenPrice(ifo.currency.symbol)
  // const currencyPriceInUSD = ifo.currency === bscTokens.cake ? cakePriceUsd : lpTokenPriceInUsd
  const currencyPriceInUSD = BIG_ZERO

  const [state, setState] = useState({
    isInitialized: false,
    status: 'idle' as IfoStatus,
    blocksRemaining: 0,
    secondsUntilStart: 0,
    progress: 5,
    secondsUntilEnd: 0,
    poolUnlimited: {
      raisingAmountPool: BIG_ZERO,
      offeringAmountPool: BIG_ZERO,
      limitPerUserInLP: BIG_ZERO,
      taxRate: 0,
      totalAmountPool: BIG_ZERO,
      sumTaxesOverflow: BIG_ZERO,
      vestingInformation: {
        percentage: 0,
        cliff: 0,
        duration: 0,
        slicePeriodSeconds: 0,
      },
    },
    startBlockNum: 0,
    endBlockNum: 0,
    vestingStartTime: 0,
  })

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const fetchIfoData = useCallback(async (_currentBlock: number) => {}, [])

  return { ...state, currencyPriceInUSD, fetchIfoData }
}

export default useGetPublicIfoData
