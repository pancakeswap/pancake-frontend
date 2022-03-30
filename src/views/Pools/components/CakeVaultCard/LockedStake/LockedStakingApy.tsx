import { useMemo, memo } from 'react'
import { getVaultPosition, VaultPosition } from 'utils/cakePool'

import { Flex, Text, Skeleton, Box } from '@pancakeswap/uikit'
import { LightGreyCard } from 'components/Card'
import { useTranslation } from 'contexts/Localization'
import { useVaultApy } from 'hooks/useVaultApy'
import Balance, { BalanceWithLoading } from 'components/Balance'
import Divider from 'components/Divider'
import getTimePeriods from 'utils/getTimePeriods'

import format from 'date-fns/format'
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

  return {
    weekDuration: formatSecondsToWeeks(secondDuration),
    lockEndDate: format(parseInt(userData?.lockEndTime) * 1000, 'MMM do, yyyy HH:mm'),
    lockedAmount: cakeBalance,
    usdValueStaked,
    secondDuration,
  }
}

const LockedStakingApy = memo(({ action, userData }) => {
  const { t } = useTranslation()
  const position = useMemo(() => getVaultPosition(userData), [userData])

  const { weekDuration, lockEndDate, lockedAmount, usdValueStaked, secondDuration } =
    useUserDataInVaultPrensenter(userData)

  const { lockedApy } = useVaultApy({ duration: Number(secondDuration) })

  const { days, hours, minutes } = getTimePeriods(100000)

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
        <DetailSection title="LOCKED DURATION" value={weekDuration} detail={`Until ${lockEndDate}`} />
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
          {t('Recent CAKE profit')}
        </Text>
        <BalanceWithLoading color="text" bold fontSize="16px" value={1200} decimals={2} unit="$" />
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
