import { Box, Button, Flex, Text, useModalV2, Balance, IconButton, AddIcon, MinusIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { Percent, Token } from '@pancakeswap/swap-sdk-core'

import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import { useStablecoinPriceAmount } from 'hooks/useBUSDPrice'
import { differenceInMilliseconds, format } from 'date-fns'

import { LockedFixedTag } from './LockedFixedTag'
import { PoolGroup, StakePositionUserInfo } from '../type'
import { DetailModal } from './DetailModal'
import { UnlockedFixedTag } from './UnlockedFixedTag'
import { FixedRestakingModal } from './RestakeFixedStakingModal'

export function StakedPositionSection({
  token,
  stakePositionUserInfo,
  unlockTime,
  lockPeriod,
  poolIndex,
  lockDayPercent,
  withdrawalFee,
  pool,
  stakedPeriods,
}: {
  unlockTime: number
  token: Token
  stakePositionUserInfo: StakePositionUserInfo
  lockPeriod: number
  poolIndex: number
  lockDayPercent: number
  withdrawalFee: number
  pool: PoolGroup
  stakedPeriods: number[]
}) {
  const { t } = useTranslation()
  const stakeModal = useModalV2()

  const apr = new Percent(lockDayPercent, 1000000000).multiply(365)

  const earnedAmount = getBalanceAmount(stakePositionUserInfo.accrueInterest, token.decimals)

  const formattedUsdEarnedAmount = useStablecoinPriceAmount(token, earnedAmount.toNumber())

  const stakingAmount = getBalanceAmount(stakePositionUserInfo.userDeposit, token.decimals)
  const formattedUsdStakingAmount = useStablecoinPriceAmount(token, stakingAmount.toNumber())
  const shouldUnlock = differenceInMilliseconds(unlockTime * 1_000, new Date()) <= 0

  return (
    <>
      <Flex mb="8px" justifyContent="space-between" width="100%">
        <Flex>
          <Box>
            <Flex>
              <Balance color="secondary" bold fontSize="16px" decimals={4} value={stakingAmount.toNumber()} />
              <Text color="secondary" ml="4px" bold>
                {token.symbol}
              </Text>
            </Flex>
            <Balance unit=" USD" bold prefix="~$" fontSize="14px" decimals={2} value={formattedUsdEarnedAmount} />
          </Box>
        </Flex>

        {shouldUnlock ? (
          <UnlockedFixedTag>{lockPeriod}D</UnlockedFixedTag>
        ) : (
          <LockedFixedTag>{lockPeriod}D</LockedFixedTag>
        )}
      </Flex>
      <Flex justifyContent="space-between" width="100%">
        <Box>
          <Text color="textSubtle" fontSize="12px">
            APR: {apr.toSignificant(2)}%
          </Text>

          <Text color="textSubtle" fontSize="12px">
            {shouldUnlock ? 'Unlocked' : `Unlock on ${format(unlockTime * 1_000, 'MMM d, yyyy')}`}
          </Text>

          <Text color="textSubtle" fontSize="12px">
            Reward: {earnedAmount.toFixed(4)} {token.symbol}
          </Text>
        </Box>
        {shouldUnlock ? (
          <Button height="auto" onClick={stakeModal.onOpen}>
            {t('Claim')}
          </Button>
        ) : (
          <Flex>
            <IconButton variant="secondary" onClick={stakeModal.onOpen} mr="6px">
              <MinusIcon color="primary" width="14px" />
            </IconButton>
            <FixedRestakingModal
              stakedPeriods={stakedPeriods}
              stakingToken={token}
              pools={pool.pools}
              initialLockPeriod={lockPeriod}
            >
              {(openModal) => (
                <IconButton variant="secondary" onClick={openModal}>
                  <AddIcon color="primary" width="14px" />
                </IconButton>
              )}
            </FixedRestakingModal>
          </Flex>
        )}
      </Flex>
      <DetailModal
        stakedPeriods={stakedPeriods}
        pool={pool}
        apr={apr}
        poolIndex={poolIndex}
        withdrawalFee={withdrawalFee}
        stakeModal={{
          ...stakeModal,
          closeOnOverlayClick: true,
        }}
        stakePositionUserInfo={stakePositionUserInfo}
        token={token}
        lockPeriod={lockPeriod}
        unlockTime={unlockTime}
        stakingAmount={stakingAmount}
        formattedUsdStakingAmount={formattedUsdStakingAmount}
      />
    </>
  )
}
