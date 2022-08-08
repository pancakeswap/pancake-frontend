import BigNumber from 'bignumber.js'
import { useTranslation } from '@pancakeswap/localization'
import { getBalanceAmount } from 'utils/formatBalance'

import { useMemo } from 'react'

export const useUserEnoughCakeValidator = (cakeAmount: string, stakingTokenBalance: BigNumber) => {
  const { t } = useTranslation()
  const errorMessage = t('Insufficient CAKE balance')

  const userNotEnoughCake = useMemo(() => {
    if (new BigNumber(cakeAmount).gt(getBalanceAmount(stakingTokenBalance, 18))) return true
    return false
  }, [cakeAmount, stakingTokenBalance])
  return { userNotEnoughCake, notEnoughErrorMessage: errorMessage }
}
