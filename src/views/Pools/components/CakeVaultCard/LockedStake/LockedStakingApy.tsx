import { Flex, Text, Skeleton, Box } from '@pancakeswap/uikit'
import { LightGreyCard } from 'components/Card'
import { useTranslation } from 'contexts/Localization'
import { useVaultApy } from 'hooks/useVaultApy'
import { useVaultMaxDuration } from 'hooks/useVaultMaxDuration'
import Balance from 'components/Balance'
import { memo } from 'react'
import styled from 'styled-components'
import format from 'date-fns/format'
import formatDuration from 'date-fns/formatDuration'
import secondsToHours from 'date-fns/secondsToHours'
import daysToWeeks from 'date-fns/daysToWeeks'
import compose from 'lodash/fp/compose'
import { useCakeBusdPrice } from 'hooks/useBUSDPrice'
import BigNumber from 'bignumber.js'
import { getBalanceNumber } from 'utils/formatBalance'
import { multiplyPriceByAmount } from 'utils/prices'

const secondsToWeeks = compose(daysToWeeks, (hours) => hours / 24, secondsToHours)

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

const Divider = styled.hr`
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

const useUserDataInVaultPrensenter = (vaultPool) => {
  const { userData } = vaultPool
  const cakePriceBusd = useCakeBusdPrice()

  const secondDuration = userData?.lockEndTime - userData?.lockStartTime

  const cakeBalance = getBalanceNumber(userData?.lockedAmount, 18)
  const usdValueStaked = multiplyPriceByAmount(cakePriceBusd, cakeBalance)

  return {
    weekDuration: formatDuration({ weeks: secondsToWeeks(secondDuration) }),
    lockEndDate: format(parseInt(userData?.lockEndTime) * 1000, 'MMM do, yyyy HH:mm'),
    lockedAmount: cakeBalance,
    usdValueStaked,
    secondDuration,
  }
}

const LockedStakingApy = memo(({ action, vaultPool }) => {
  const { t } = useTranslation()

  const { weekDuration, lockEndDate, lockedAmount, usdValueStaked, secondDuration } =
    useUserDataInVaultPrensenter(vaultPool)

  const { lockedApy } = useVaultApy({ duration: Number(secondDuration) })

  return (
    <LightGreyCard>
      <Flex justifyContent="space-between" mb="16px">
        <DetailSection
          title="CAKE LOCKED"
          value={<Balance color="text" bold fontSize="16px" value={lockedAmount} decimals={2} />}
          detail={
            <Balance value={usdValueStaked} fontSize="12px" color="textSubtle" decimals={2} prefix="~" unit=" USD" />
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
        {lockedApy ? (
          <Balance color="text" bold fontSize="16px" value={parseFloat(lockedApy)} decimals={2} unit="%" />
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </Flex>
      <Flex alignItems="center" justifyContent="space-between">
        <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
          {t('Recent CAKE profit')}
        </Text>
        <Balance color="text" bold fontSize="16px" value={1200} decimals={2} unit="$" />
      </Flex>
    </LightGreyCard>
  )
})

export default LockedStakingApy
