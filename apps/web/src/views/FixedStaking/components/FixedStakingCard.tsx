import { useTranslation } from '@pancakeswap/localization'
import { CardBody, Flex, Heading, StarFillIcon, Tag, Box, Button } from '@pancakeswap/uikit'
import { StyledCard } from '@pancakeswap/uikit/src/widgets/Pool'
import CurrencyLogo from 'components/Logo/CurrencyLogo'
import BigNumber from 'bignumber.js'

import { FixedStakingCardBody } from './FixedStakingCardBody'
import { FixedStakingActions } from './FixedStakingActions'
import { HarvestFixedStaking } from './HarvestFixedStaking'
import { FixedStakingModal } from './FixedStakingModal'
import { InlineText } from './InlineText'
import { FixedStakingPool, StakedPosition } from '../type'
import { useFixedStakeAPR } from '../hooks/useFixedStakeAPR'

export function FixedStakingCard({
  pool,
  stakedPositions,
}: {
  pool: FixedStakingPool
  stakedPositions: StakedPosition[]
}) {
  const { t } = useTranslation()

  const stakePosition = stakedPositions.find((position) => position.pool.token.address === pool.token.address)
  const { boostAPR, lockAPR } = useFixedStakeAPR(pool)

  return (
    <StyledCard>
      <Flex px="24px" pt="24px" alignItems="center" justifyContent="space-between">
        <>
          <CurrencyLogo currency={pool.token} size="56px" />
          <Box>
            <Heading color="secondary" scale="lg" textAlign="end">
              {pool.token.symbol}
            </Heading>
            {new BigNumber(pool.boostDayPercent).gt(0) ? (
              <Tag outline variant="success" startIcon={<StarFillIcon width="18px" color="success" />}>
                vCAKE Boost
              </Tag>
            ) : null}
          </Box>
        </>
      </Flex>
      <CardBody>
        <FixedStakingCardBody pool={pool}>
          {stakePosition && new BigNumber(stakePosition?.userInfo?.accrueInterest).gt(0) ? (
            <>
              <Box display="inline">
                <InlineText color="secondary" bold fontSize="12px">
                  {`${pool.token.symbol} `}
                </InlineText>
                <InlineText color="textSubtle" textTransform="uppercase" bold fontSize="12px">
                  {t('Earned')}
                </InlineText>
              </Box>
              <HarvestFixedStaking
                apr={boostAPR.greaterThan(0) ? boostAPR : lockAPR}
                lockPeriod={pool.lockPeriod}
                unlockTime={stakePosition.timestampEndLockPeriod}
                stakePositionUserInfo={stakePosition.userInfo}
                token={pool.token}
                poolIndex={pool.poolIndex}
              />
            </>
          ) : null}
          {stakePosition && new BigNumber(stakePosition?.userInfo?.userDeposit).gt(0) ? (
            <>
              <Box display="inline">
                <InlineText color="secondary" bold fontSize="12px">
                  {`${pool.token.symbol} `}
                </InlineText>
                <InlineText color="textSubtle" textTransform="uppercase" bold fontSize="12px">
                  {t('Staked')}
                </InlineText>
              </Box>
              <FixedStakingActions
                apr={boostAPR.greaterThan(0) ? boostAPR : lockAPR}
                poolIndex={pool.poolIndex}
                lockPeriod={pool.lockPeriod}
                unlockTime={stakePosition.timestampEndLockPeriod}
                stakePositionUserInfo={stakePosition.userInfo}
                token={pool.token}
                withdrawalFee={pool.withdrawalFee}
              />
            </>
          ) : (
            <FixedStakingModal
              apr={boostAPR.greaterThan(0) ? boostAPR : lockAPR}
              lockPeriod={pool.lockPeriod}
              poolIndex={pool.poolIndex}
              stakingToken={pool.token}
            >
              {(openModal) => <Button onClick={openModal}>{t('Stake')}</Button>}
            </FixedStakingModal>
          )}
        </FixedStakingCardBody>
      </CardBody>
    </StyledCard>
  )
}
