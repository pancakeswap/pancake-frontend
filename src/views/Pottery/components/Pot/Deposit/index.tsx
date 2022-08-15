import styled from 'styled-components'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { Flex, Box, Text, TooltipText, useTooltip } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { GreyCard } from 'components/Card'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useVaultApy } from 'hooks/useVaultApy'
import { usePotteryData, useLatestVaultAddress } from 'state/pottery/hook'
import getTimePeriods from 'utils/getTimePeriods'
import { getBalanceNumber } from 'utils/formatBalance'
import Balance from 'components/Balance'
import { BIG_ZERO } from 'utils/bigNumber'
import { PotteryDepositStatus } from 'state/types'
import { remainTimeToNextFriday, calculateCakeAmount } from 'views/Pottery/helpers'
import { weeksToSeconds } from 'views/Pools/components/utils/formatSecondsToWeeks'
import YourDeposit from '../YourDeposit'
import WinRate from '../WinRate'
import DepositAction from './DepositAction'

const Container = styled(Flex)`
  flex-direction: column;
  padding: 16px 24px;
  border-bottom: solid 1px ${({ theme }) => theme.colors.cardBorder};
`

const CardAction = styled(Flex)`
  flex-direction: column;
  padding: 26px 24px 36px 24px;
`

const Deposit: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const { getLockedApy } = useVaultApy()
  const { publicData, userData } = usePotteryData()
  const lastVaultAddress = useLatestVaultAddress()
  const { totalSupply, totalLockCake, getStatus, totalLockedValue, maxTotalDeposit } = publicData

  const { targetRef, tooltip, tooltipVisible } = useTooltip(t('Pottery draws on each Friday at 12 PM UTC!'), {
    placement: 'bottom-start',
  })

  const apyDisplay = useMemo(() => {
    const apy = getLockedApy(weeksToSeconds(10))
    return !Number.isNaN(apy) ? `${Number(apy).toFixed(2)}%` : '0%'
  }, [getLockedApy])

  const secondsRemaining = remainTimeToNextFriday()
  const { days, hours, minutes } = getTimePeriods(secondsRemaining)

  const totalValueLocked = useMemo(() => {
    if (getStatus === PotteryDepositStatus.LOCK) {
      return getBalanceNumber(totalLockCake)
    }
    return getBalanceNumber(totalLockedValue)
  }, [getStatus, totalLockCake, totalLockedValue])

  const currentDeposit = userData.withdrawAbleData.find(
    (data) => data.potteryVaultAddress.toLocaleLowerCase() === lastVaultAddress.toLocaleLowerCase(),
  )

  const depositBalance = useMemo(() => {
    // Because subgraph will delay, if currency vault status is before lock don't use currentDeposit value.
    if (getStatus !== PotteryDepositStatus.LOCK) {
      return new BigNumber(userData.previewDepositBalance)
    }

    if (currentDeposit) {
      const { previewRedeem, shares, status } = currentDeposit
      return calculateCakeAmount({ status, previewRedeem, shares, totalSupply, totalLockCake })
    }

    return BIG_ZERO
  }, [userData, getStatus, currentDeposit, totalSupply, totalLockCake])

  return (
    <Box>
      <Container>
        <GreyCard mb="18px">
          <Flex justifyContent="space-between">
            <YourDeposit depositBalance={depositBalance} />
            <WinRate />
          </Flex>
        </GreyCard>
        <Flex justifyContent="space-between">
          <Text color="textSubtle">{t('APY')}</Text>
          <Text bold>{apyDisplay}</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text color="textSubtle">{t('Next draw date')}</Text>
          {tooltipVisible && tooltip}
          <TooltipText ref={targetRef}>
            <Text bold as="span">
              {t('in')}
            </Text>
            {days ? <Text bold as="span" ml="2px">{`${days}${t('d')}`}</Text> : null}
            {hours ? <Text bold as="span" ml="2px">{`${hours}${t('h')}`}</Text> : null}
            {minutes ? <Text bold as="span" ml="2px">{`${minutes}${t('m')}`}</Text> : null}
          </TooltipText>
        </Flex>
        <Flex justifyContent="space-between">
          <Text color="textSubtle">{t('Total Value Locked')}</Text>
          <Balance bold decimals={2} value={totalValueLocked} unit=" CAKE" />
        </Flex>
        <Flex justifyContent="space-between">
          <Text color="textSubtle">{t('Max. deposit cap')}</Text>
          <Balance bold decimals={2} value={getBalanceNumber(maxTotalDeposit)} unit=" CAKE" />
        </Flex>
      </Container>
      <CardAction>
        {account ? <DepositAction totalValueLockedValue={totalValueLocked} /> : <ConnectWalletButton />}
      </CardAction>
    </Box>
  )
}

export default Deposit
