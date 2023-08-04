import { Box, Button, Flex, Text, Balance, IconButton, AddIcon, MinusIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/swap-sdk-core'

import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import { useStablecoinPriceAmount } from 'hooks/useBUSDPrice'
import { differenceInMilliseconds, format } from 'date-fns'

import { LockedFixedTag } from './LockedFixedTag'
import { PoolGroup, StakePositionUserInfo } from '../type'
import { ClaimModal } from './ClaimModal'
import { UnlockedFixedTag } from './UnlockedFixedTag'
import { FixedRestakingModal } from './RestakeFixedStakingModal'
import { UnstakeBeforeEnededModal } from './UnstakeBeforeEndedModal'
import { useFixedStakeAPR } from '../hooks/useFixedStakeAPR'

export function StakedPositionSection({
  token,
  stakePositionUserInfo,
  unlockTime,
  lockPeriod,
  poolIndex,
  lockDayPercent,
  boostDayPercent,
  withdrawalFee,
  pool,
  stakedPeriods,
}: {
  unlockTime: number
  boostDayPercent: number
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

  const earnedAmount = getBalanceAmount(stakePositionUserInfo.accrueInterest, token.decimals)

  const formattedUsdEarnedAmount = useStablecoinPriceAmount(token, earnedAmount.toNumber())

  const stakingAmount = getBalanceAmount(stakePositionUserInfo.userDeposit, token.decimals)
  const formattedUsdStakingAmount = useStablecoinPriceAmount(token, stakingAmount.toNumber())
  const shouldUnlock = differenceInMilliseconds(unlockTime * 1_000, new Date()) <= 0

  const { boostAPR, lockAPR } = useFixedStakeAPR({ lockDayPercent, boostDayPercent })

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
            APR: {lockAPR.toSignificant(2)}%
          </Text>

          <Text color="textSubtle" fontSize="12px">
            {shouldUnlock ? 'Unlocked' : `Unlock on ${format(unlockTime * 1_000, 'MMM d, yyyy')}`}
          </Text>

          <Text color="textSubtle" fontSize="12px">
            {t('Reward')}: {earnedAmount.toFixed(4)} {token.symbol}
          </Text>
        </Box>
        {shouldUnlock ? (
          <ClaimModal
            stakedPeriods={stakedPeriods}
            pool={pool}
            lockAPR={lockAPR}
            boostAPR={boostAPR}
            poolIndex={poolIndex}
            stakePositionUserInfo={stakePositionUserInfo}
            token={token}
            lockPeriod={lockPeriod}
            unlockTime={unlockTime}
            stakingAmount={stakingAmount}
            formattedUsdStakingAmount={formattedUsdStakingAmount}
          >
            {(openClaimModal) => (
              <Button height="auto" onClick={openClaimModal}>
                {t('Claim')}
              </Button>
            )}
          </ClaimModal>
        ) : (
          <Flex>
            <UnstakeBeforeEnededModal
              token={token}
              lockPeriod={lockPeriod}
              lockAPR={lockAPR}
              boostAPR={boostAPR}
              stakePositionUserInfo={stakePositionUserInfo}
              withdrawalFee={withdrawalFee}
              poolIndex={poolIndex}
            >
              {(openUnstakeModal) => (
                <IconButton variant="secondary" onClick={openUnstakeModal} mr="6px">
                  <MinusIcon color="primary" width="14px" />
                </IconButton>
              )}
            </UnstakeBeforeEnededModal>
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
    </>
  )
}
