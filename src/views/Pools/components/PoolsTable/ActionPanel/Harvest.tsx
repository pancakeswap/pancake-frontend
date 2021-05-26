import React from 'react'
import { Button, Text, useModal, Flex, TooltipText, useTooltip, Skeleton } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { getCakeVaultEarnings } from 'views/Pools/helpers'
import { PoolCategory } from 'config/constants/types'
import { formatNumber, getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'
import Balance from 'components/Balance'
import { useCakeVault } from 'state/hooks'
import { BIG_ZERO } from 'utils/bigNumber'
import { Pool } from 'state/types'

import { ActionContainer, ActionTitles, ActionContent } from './styles'
import CollectModal from '../../PoolCard/Modals/CollectModal'
import UnstakingFeeCountdownRow from '../../CakeVaultCard/UnstakingFeeCountdownRow'

interface HarvestActionProps extends Pool {
  userDataLoaded: boolean
}

const HarvestAction: React.FunctionComponent<HarvestActionProps> = ({
  sousId,
  poolCategory,
  earningToken,
  userData,
  userDataLoaded,
  isAutoVault,
  earningTokenPrice,
}) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const earnings = userData?.pendingReward ? new BigNumber(userData.pendingReward) : BIG_ZERO
  // These will be reassigned later if its Auto CAKE vault
  let earningTokenBalance = getBalanceNumber(earnings, earningToken.decimals)
  let earningTokenDollarBalance = getBalanceNumber(earnings.multipliedBy(earningTokenPrice), earningToken.decimals)
  let hasEarnings = earnings.gt(0)
  const fullBalance = getFullDisplayBalance(earnings, earningToken.decimals)
  const formattedBalance = formatNumber(earningTokenBalance, 3, 3)
  const earningsDollarValue = formatNumber(earningTokenDollarBalance)
  const isCompoundPool = sousId === 0
  const isBnbPool = poolCategory === PoolCategory.BINANCE

  // Auto CAKE vault calculations
  const {
    userData: { cakeAtLastUserAction, userShares },
    pricePerFullShare,
    fees: { performanceFee },
  } = useCakeVault()
  const { hasAutoEarnings, autoCakeToDisplay, autoUsdToDisplay } = getCakeVaultEarnings(
    account,
    cakeAtLastUserAction,
    userShares,
    pricePerFullShare,
    earningTokenPrice,
  )

  earningTokenBalance = isAutoVault ? autoCakeToDisplay : earningTokenBalance
  hasEarnings = isAutoVault ? hasAutoEarnings : hasEarnings
  earningTokenDollarBalance = isAutoVault ? autoUsdToDisplay : earningTokenDollarBalance

  const displayBalance = hasEarnings ? earningTokenBalance : 0
  const [onPresentCollect] = useModal(
    <CollectModal
      formattedBalance={formattedBalance}
      fullBalance={fullBalance}
      earningToken={earningToken}
      earningsDollarValue={earningsDollarValue}
      sousId={sousId}
      isBnbPool={isBnbPool}
      isCompoundPool={isCompoundPool}
    />,
  )

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('Subtracted automatically from each yield harvest and burned.'),
    { placement: 'bottom-start' },
  )

  const actionTitle = isAutoVault ? (
    <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
      {t('Recent CAKE profit')}
    </Text>
  ) : (
    <>
      <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
        {earningToken.symbol}{' '}
      </Text>
      <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
        {t('Earned')}
      </Text>
    </>
  )

  if (!account) {
    return (
      <ActionContainer>
        <ActionTitles>{actionTitle}</ActionTitles>
        <ActionContent>
          <Balance pt="8px" lineHeight="1" bold fontSize="20px" decimals={5} value={0} />
          <Button disabled>{isCompoundPool ? t('Collect') : t('Harvest')}</Button>
        </ActionContent>
      </ActionContainer>
    )
  }

  if (!userDataLoaded) {
    return (
      <ActionContainer>
        <ActionTitles>{actionTitle}</ActionTitles>
        <ActionContent>
          <Skeleton width={180} height="32px" marginTop={14} />
        </ActionContent>
      </ActionContainer>
    )
  }

  return (
    <ActionContainer>
      <ActionTitles>{actionTitle}</ActionTitles>
      <ActionContent>
        <Flex flex="1" pt="16px" flexDirection="column" alignSelf="flex-start">
          <Balance lineHeight="1" bold fontSize="20px" decimals={5} value={displayBalance} />
          {hasEarnings ? (
            <Balance
              display="inline"
              fontSize="12px"
              color={hasEarnings ? 'textSubtle' : 'textDisabled'}
              decimals={2}
              value={earningTokenDollarBalance}
              unit=" USD"
              prefix="~"
            />
          ) : (
            <Text fontSize="12px" color={hasEarnings ? 'textSubtle' : 'textDisabled'}>
              0 USD
            </Text>
          )}
        </Flex>
        {isAutoVault ? (
          <Flex flex="1.3" flexDirection="column" alignSelf="flex-start" alignItems="flex-start">
            <UnstakingFeeCountdownRow isTableVariant />
            <Flex mb="2px" justifyContent="space-between" alignItems="center">
              {tooltipVisible && tooltip}
              <TooltipText ref={targetRef} small>
                {t('Performance Fee')}
              </TooltipText>
              <Flex alignItems="center">
                <Text ml="4px" small>
                  {performanceFee / 100}%
                </Text>
              </Flex>
            </Flex>
          </Flex>
        ) : (
          <Button disabled={!hasEarnings} onClick={onPresentCollect}>
            {isCompoundPool ? t('Collect') : t('Harvest')}
          </Button>
        )}
      </ActionContent>
    </ActionContainer>
  )
}

export default HarvestAction
