import React from 'react'
import { Flex, Text } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import { useCakeVault, usePriceCakeBusd } from 'state/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import { convertSharesToCake } from 'views/Pools/helpers'
import RecentCakeProfitBalance from './RecentCakeProfitBalance'

const RecentCakeProfitCountdownRow = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const {
    pricePerFullShare,
    userData: { cakeAtLastUserAction, userShares, lastUserActionTime },
  } = useCakeVault()
  const shouldDisplayCakeProfit =
    account && cakeAtLastUserAction && cakeAtLastUserAction.gt(0) && userShares && userShares.gt(0)
  const currentSharesAsCake = convertSharesToCake(userShares, pricePerFullShare)
  const cakeProfit = currentSharesAsCake.cakeAsBigNumber.minus(cakeAtLastUserAction)
  const cakeToDisplay = cakeProfit.gte(0) ? getBalanceNumber(cakeProfit, 18) : 0
  const cakePriceBusd = usePriceCakeBusd()
  const dollarValueOfCake = cakeProfit.times(cakePriceBusd)
  const dollarValueToDisplay = dollarValueOfCake.gte(0) ? getBalanceNumber(dollarValueOfCake, 18) : 0

  const lastActionInMs = lastUserActionTime && parseInt(lastUserActionTime) * 1000
  const dateTimeLastAction = new Date(lastActionInMs)
  const dateStringToDisplay = dateTimeLastAction.toLocaleString()

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Text fontSize="14px">{t('Recent CAKE profit:')}</Text>
      {shouldDisplayCakeProfit && (
        <RecentCakeProfitBalance
          cakeToDisplay={cakeToDisplay}
          dollarValueToDisplay={dollarValueToDisplay}
          dateStringToDisplay={dateStringToDisplay}
        />
      )}
    </Flex>
  )
}

export default RecentCakeProfitCountdownRow
