import styled from 'styled-components'
import { useMemo } from 'react'
import { getVaultPosition, VaultPosition } from 'utils/cakePool'

import { Flex, Text, Box, useTooltip, HelpIcon, BalanceWithLoading, Pool, ButtonVariant } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { DeserializedLockedVaultUser } from 'state/types'
import LockedActions from './Common/LockedActions'
import useUserDataInVaultPresenter from './hooks/useUserDataInVaultPresenter'
import OriginalLockedInfo from '../OriginalLockedInfo'

const HelpIconWrapper = styled.div`
  align-self: center;
`

interface LockedStakingProps {
  buttonVariant?: ButtonVariant
  pool: Pool.DeserializedPool<Token>
  userData: DeserializedLockedVaultUser
}

const LockedStaking: React.FC<React.PropsWithChildren<LockedStakingProps>> = ({ buttonVariant, pool, userData }) => {
  const { t } = useTranslation()

  const position = useMemo(
    () =>
      getVaultPosition({
        userShares: userData?.userShares,
        locked: userData?.locked,
        lockEndTime: userData?.lockEndTime,
      }),
    [userData],
  )

  const stakingToken = pool?.stakingToken
  const stakingTokenPrice = pool?.stakingTokenPrice
  const stakingTokenBalance = pool?.userData?.stakingTokenBalance

  const currentLockedAmountAsBigNumber = useMemo(() => {
    return userData?.balance?.cakeAsBigNumber
  }, [userData?.balance?.cakeAsBigNumber])

  const currentLockedAmount = getBalanceNumber(currentLockedAmountAsBigNumber)

  const usdValueStaked = useMemo(
    () =>
      stakingToken && stakingTokenPrice
        ? getBalanceNumber(userData?.balance?.cakeAsBigNumber.multipliedBy(stakingTokenPrice), stakingToken?.decimals)
        : null,
    [userData?.balance?.cakeAsBigNumber, stakingTokenPrice, stakingToken],
  )

  const { lockEndDate, remainingTime, burnStartTime } = useUserDataInVaultPresenter({
    lockStartTime: userData?.lockStartTime,
    lockEndTime: userData?.lockEndTime,
    burnStartTime: userData?.burnStartTime,
  })

  const {
    targetRef: tagTargetRefOfLocked,
    tooltip: tagTooltipOfLocked,
    tooltipVisible: tagTooltipVisibleOfLocked,
  } = useTooltip(<OriginalLockedInfo pool={pool} />, {
    placement: 'bottom',
  })

  const tooltipContentOfBurn = t(
    'After Burning starts at %burnStartTime%. You need to renew your fix-term position, to initiate a new lock or convert your staking position to flexible before it starts. Otherwise all the rewards will be burned within the next 90 days.',
    { burnStartTime },
  )
  const {
    targetRef: tagTargetRefOfBurn,
    tooltip: tagTooltipOfBurn,
    tooltipVisible: tagTooltipVisibleOfBurn,
  } = useTooltip(tooltipContentOfBurn, {
    placement: 'bottom',
  })

  return (
    <Box>
      <Flex justifyContent="space-between" mb="16px">
        <Box>
          <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
            {t('CAKE locked')}
          </Text>
          <Flex>
            <BalanceWithLoading color="text" bold fontSize="16px" value={currentLockedAmount} decimals={5} />
            {tagTooltipVisibleOfLocked && tagTooltipOfLocked}
            <HelpIconWrapper ref={tagTargetRefOfLocked}>
              <HelpIcon ml="4px" mt="2px" width="20px" height="20px" color="textSubtle" />
            </HelpIconWrapper>
          </Flex>
          <BalanceWithLoading
            value={usdValueStaked}
            fontSize="12px"
            color="textSubtle"
            decimals={2}
            prefix="~"
            unit=" USD"
          />
        </Box>
        <Box>
          <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
            {t('Unlocks In')}
          </Text>
          <Flex>
            <Text color={position >= VaultPosition.LockedEnd ? '#D67E0A' : 'text'} bold fontSize="16px">
              {position >= VaultPosition.LockedEnd ? t('Unlocked') : remainingTime}
            </Text>
            {tagTooltipVisibleOfBurn && tagTooltipOfBurn}
            <span ref={tagTargetRefOfBurn}>
              <HelpIcon ml="4px" mt="2px" width="20px" height="20px" color="textSubtle" />
            </span>
          </Flex>
          <Text color={position >= VaultPosition.LockedEnd ? '#D67E0A' : 'text'} fontSize="12px">
            {t('On %date%', { date: lockEndDate })}
          </Text>
        </Box>
      </Flex>
      <Box mb="16px">
        <LockedActions
          userShares={userData?.userShares}
          locked={userData?.locked}
          lockEndTime={userData?.lockEndTime}
          lockStartTime={userData?.lockStartTime}
          stakingToken={stakingToken}
          stakingTokenBalance={stakingTokenBalance}
          stakingTokenPrice={pool?.stakingTokenPrice}
          lockedAmount={currentLockedAmountAsBigNumber}
          variant={buttonVariant}
        />
      </Box>
    </Box>
  )
}

export default LockedStaking
