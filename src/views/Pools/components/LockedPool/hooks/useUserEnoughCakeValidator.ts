import tokens from 'config/constants/tokens'
import { FetchStatus } from 'config/constants/types'
import useTokenBalance from 'hooks/useTokenBalance'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { getBalanceAmount } from 'utils/formatBalance'

import { useEffect, useState } from 'react'

export const useUserEnoughCakeValidator = (cakeAmount: string) => {
  const { t } = useTranslation()
  const { balance: userCake, fetchStatus } = useTokenBalance(tokens.cake.address)
  const [userNotEnoughCake, setUserNotEnoughCake] = useState(false)
  const errorMessage = t('Insufficient CAKE balance')

  useEffect(() => {
    if (fetchStatus === FetchStatus.Fetched) {
      if (new BigNumber(cakeAmount).gt(getBalanceAmount(userCake, 18))) setUserNotEnoughCake(true)
      else setUserNotEnoughCake(false)
    }
  }, [cakeAmount, userCake, setUserNotEnoughCake, fetchStatus])
  return { userNotEnoughCake, notEnoughErrorMessage: errorMessage }
}
