import { useMemo, memo } from 'react'
import { getVaultPosition, VaultPosition } from 'utils/cakePool'

import { Flex, Text, Box } from '@pancakeswap/uikit'
import { LightGreyCard } from 'components/Card'
import { useTranslation } from 'contexts/Localization'
import { useVaultApy } from 'hooks/useVaultApy'
import { BalanceWithLoading } from 'components/Balance'
import Divider from 'components/Divider'
import getTimePeriods from 'utils/getTimePeriods'
import { getCakeVaultEarnings } from 'views/Pools/helpers'

import format from 'date-fns/format'
import differenceInWeeks from 'date-fns/differenceInWeeks'
import formatDuration from 'date-fns/formatDuration'
import { useCakeBusdPrice } from 'hooks/useBUSDPrice'
import { getBalanceNumber } from 'utils/formatBalance'
import { multiplyPriceByAmount } from 'utils/prices'
import formatSecondsToWeeks from '../utils/formatSecondsToWeeks'

const DetailSection = ({ title, value, detail }) => (
  <Box>
    <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
      {title}
    </Text>
    <Text color="text" textTransform="uppercase" bold fontSize="16px">
      {value}
    </Text>
    <Text color="text" fontSize="12px">
      {detail}
    </Text>
  </Box>
)

const useUserDataInVaultPrensenter = (userData) => {
  const cakePriceBusd = useCakeBusdPrice()

  const secondDuration = userData?.lockEndTime - userData?.lockStartTime

  const cakeBalance = getBalanceNumber(userData?.lockedAmount)
  const usdValueStaked = multiplyPriceByAmount(cakePriceBusd, cakeBalance)

  const lockEndTimeSeconds = parseInt(userData?.lockEndTime) * 1000

  const diffWeeks = differenceInWeeks(new Date(lockEndTimeSeconds).getTime(), new Date().getTime())

  return {
    weekDuration: formatSecondsToWeeks(secondDuration),
    remainingWeeks: formatDuration({ weeks: diffWeeks }),
    lockEndDate: format(lockEndTimeSeconds, 'MMM do, yyyy HH:mm'),
    lockedAmount: cakeBalance,
    usdValueStaked,
    secondDuration,
  }
}

const LockedStakingApy = memo(({ action, userData, account, earningTokenPrice, pricePerFullShare }) => {
  const { t } = useTranslation()
  const position = useMemo(() => getVaultPosition(userData), [userData])

  const { weekDuration, lockEndDate, lockedAmount, usdValueStaked, secondDuration, remainingWeeks } =
    useUserDataInVaultPrensenter(userData)

  const { lockedApy } = useVaultApy({ duration: Number(secondDuration) })

  const { days, hours, minutes } = getTimePeriods(100000)

  // TODO: Check if we need to minus fee
  let earningTokenBalance = 0
  if (pricePerFullShare) {
    const { autoCakeToDisplay } = getCakeVaultEarnings(
      account,
      userData?.cakeAtLastUserAction,
      userData?.userShares,
      pricePerFullShare,
      earningTokenPrice,
    )
    earningTokenBalance = autoCakeToDisplay
  }

  return (
    <LightGreyCard>
      <Flex justifyContent="space-between" mb="16px">
        <DetailSection
          title="CAKE LOCKED"
          value={<BalanceWithLoading color="text" bold fontSize="16px" value={lockedAmount} decimals={2} />}
          detail={
            <BalanceWithLoading
              value={usdValueStaked}
              fontSize="12px"
              color="textSubtle"
              decimals={2}
              prefix="~"
              unit=" USD"
            />
          }
        />
        <DetailSection title="Unlock In" value={remainingWeeks} detail={`Until ${lockEndDate}`} />
      </Flex>
      <Box mb="16px">{action}</Box>
      <Divider />
      <Flex alignItems="center" justifyContent="space-between">
        <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
          {t('APY')}
        </Text>
        <BalanceWithLoading color="text" bold fontSize="16px" value={parseFloat(lockedApy)} decimals={2} unit="%" />
      </Flex>
      <Flex alignItems="center" justifyContent="space-between">
        <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
          {t('Initial Lock Duration')}
        </Text>
        <Text color="text" bold fontSize="16px">
          {weekDuration}
        </Text>
      </Flex>
      <Flex alignItems="center" justifyContent="space-between">
        <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
          {t('Recent CAKE profit')}
        </Text>
        <BalanceWithLoading color="text" bold fontSize="16px" value={earningTokenBalance} decimals={2} unit="$" />
      </Flex>
      {position === VaultPosition.LockedEnd && (
        <Flex alignItems="center" justifyContent="space-between">
          <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
            {t('After Burning In')}
          </Text>
          <Text color="textSubtle" bold>
            {`${days}d: ${hours}h: ${minutes}m`}
          </Text>
        </Flex>
      )}
      {position === VaultPosition.AfterBurning && (
        <Flex alignItems="center" justifyContent="space-between">
          <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
            {t('After burning')}
          </Text>
          <Text color="textSubtle" bold>
            1.2 BURNED
          </Text>
        </Flex>
      )}
    </LightGreyCard>
  )
})

export default LockedStakingApy
