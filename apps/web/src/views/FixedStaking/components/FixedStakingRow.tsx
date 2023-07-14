import { memo, useMemo } from 'react'
import {
  CurrencyLogo,
  Text,
  Pool,
  Flex,
  StarFillIcon,
  Tag,
  Balance,
  Box,
  Button,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { StyledCell } from 'views/Pools/components/PoolsTable/Cells/NameCell'
import BigNumber from 'bignumber.js'
import { useTranslation } from '@pancakeswap/localization'
import { useStablecoinPriceAmount } from 'hooks/useBUSDPrice'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import {
  ActionContainer,
  InfoSection,
  StyledActionPanel,
} from 'views/Pools/components/PoolsTable/ActionPanel/ActionPanel'
import { LightGreyCard } from 'components/Card'

import { LockedFixedTag } from './LockedFixedTag'
import { HarvestFixedStaking } from './HarvestFixedStaking'
import { FixedStakingPool, StakedPosition } from '../type'
import { InlineText } from './InlineText'
import { FixedStakingActions } from './FixedStakingActions'
import { FixedStakingModal } from './FixedStakingModal'
import { useCurrenDay } from '../hooks/useStakedPools'
import { useFixedStakeAPR } from '../hooks/useFixedStakeAPR'

const FixedStakingRow = ({ pool, stakedPositions }: { pool: FixedStakingPool; stakedPositions: StakedPosition[] }) => {
  const isBoost = useMemo(() => new BigNumber(pool.boostDayPercent).gt(0), [pool.boostDayPercent])
  const { t } = useTranslation()
  const totalStakedAmount = getBalanceAmount(pool.totalDeposited, pool.token.decimals)
  const { isMobile, isTablet } = useMatchBreakpoints()

  const currentDate = useCurrenDay()

  const remainingDays = pool.endDay - currentDate

  const formattedUsdValueStaked = useStablecoinPriceAmount(pool.token, totalStakedAmount.toNumber())
  const stakePosition = stakedPositions.find((position) => position.pool.token.address === pool.token.address)
  const { boostAPR, lockAPR } = useFixedStakeAPR(pool)

  return (
    <Pool.ExpandRow
      initialActivity={false}
      panel={
        <StyledActionPanel expanded>
          <InfoSection mt="8px">
            <Flex alignItems="center" justifyContent="space-between">
              <Text textTransform="uppercase" fontSize="12px">
                {t('APR:')}
              </Text>
              <Text>
                {lockAPR.toSignificant(2)}% ~ {boostAPR.toSignificant(2)}%
              </Text>
            </Flex>
            <Flex alignItems="center" justifyContent="space-between">
              <Text fontSize="12px">{t('Ends in')}</Text>
              <Text color="textSubtle" fontSize="12px">
                {remainingDays > 0 ? remainingDays : 0} {t('days')}
              </Text>
            </Flex>
          </InfoSection>
          <ActionContainer>
            {stakePosition && new BigNumber(stakePosition?.userInfo?.accrueInterest).gt(0) ? (
              <ActionContainer pl={['0px', '0px', '0px', '0px', '32px']}>
                <HarvestFixedStaking
                  apr={boostAPR.greaterThan(0) ? boostAPR : lockAPR}
                  lockPeriod={pool.lockPeriod}
                  unlockTime={stakePosition.timestampEndLockPeriod}
                  stakePositionUserInfo={stakePosition.userInfo}
                  token={pool.token}
                  poolIndex={pool.poolIndex}
                />
              </ActionContainer>
            ) : null}
            <ActionContainer>
              {stakePosition && new BigNumber(stakePosition?.userInfo?.userDeposit).gt(0) ? (
                <LightGreyCard mb="16px" mt="8px" ml={['0px', '0px', '32px']}>
                  <Box display="inline">
                    <InlineText color="secondary" bold fontSize="12px">
                      {`${pool.token.symbol} `}
                    </InlineText>
                    <InlineText color="textSubtle" textTransform="uppercase" bold fontSize="12px">
                      {t('Staked')}
                    </InlineText>
                  </Box>
                  <FixedStakingActions
                    withdrawalFee={pool.withdrawalFee}
                    apr={boostAPR.greaterThan(0) ? boostAPR : lockAPR}
                    poolIndex={pool.poolIndex}
                    lockPeriod={pool.lockPeriod}
                    unlockTime={stakePosition?.timestampEndLockPeriod}
                    stakePositionUserInfo={stakePosition?.userInfo}
                    token={pool.token}
                  />
                </LightGreyCard>
              ) : (
                <LightGreyCard
                  mb="16px"
                  mt="8px"
                  ml="32px"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Box display="inline">
                    <InlineText color="textSubtle" textTransform="uppercase" bold fontSize="12px" mr="4px">
                      {t('Stake')}
                    </InlineText>
                    <InlineText color="secondary" bold fontSize="12px">
                      {`${pool.token.symbol} `}
                    </InlineText>
                  </Box>
                  <FixedStakingModal
                    apr={boostAPR.greaterThan(0) ? boostAPR : lockAPR}
                    lockPeriod={pool.lockPeriod}
                    poolIndex={pool.poolIndex}
                    stakingToken={pool.token}
                  >
                    {(openModal) => <Button onClick={openModal}>{t('Stake')}</Button>}
                  </FixedStakingModal>
                </LightGreyCard>
              )}
            </ActionContainer>
          </ActionContainer>
        </StyledActionPanel>
      }
    >
      <StyledCell minWidth="120px" display="flex" alignItems="center">
        <CurrencyLogo currency={pool.token} size="40px" />
        <Flex flexDirection="column" justifyContent="center" alignItems="start" ml="8px">
          <Text color="secondary" fontSize="16px" bold>
            {pool.token.symbol}
          </Text>
          {isBoost ? (
            isMobile || isTablet ? (
              <>
                <LockedFixedTag
                  style={{
                    height: '16px',
                    marginBottom: '4px',
                  }}
                >
                  {pool.lockPeriod}D
                </LockedFixedTag>
                {isBoost ? (
                  <Tag
                    outline
                    variant="success"
                    style={{ height: '16px', width: 'fit-content', padding: '0 4px' }}
                    startIcon={<StarFillIcon width="12px" color="success" scale="sm" />}
                  >
                    <Text bold color="success" fontSize="12px">
                      vCAKE
                    </Text>
                  </Tag>
                ) : null}
              </>
            ) : isBoost ? (
              <Tag
                outline
                variant="success"
                style={{ height: '16px', width: 'fit-content', padding: '0 4px' }}
                startIcon={<StarFillIcon width="12px" color="success" scale="sm" />}
              >
                <Text bold color="success" fontSize="12px">
                  vCAKE Boost
                </Text>
              </Tag>
            ) : null
          ) : null}
        </Flex>
      </StyledCell>
      {isMobile || isTablet ? null : (
        <StyledCell>
          <Pool.CellContent>
            <Text fontSize="12px" color="textSubtle" textAlign="left" mb="4px">
              Lock Periods
            </Text>
            <LockedFixedTag>{pool.lockPeriod}D</LockedFixedTag>
          </Pool.CellContent>
        </StyledCell>
      )}
      <StyledCell>
        <Pool.CellContent>
          <Text fontSize="12px" color="textSubtle" textAlign="left" mb="4px">
            {t('APR')}
          </Text>
          <Text>
            {lockAPR.toSignificant(2)}% ~ {boostAPR.toSignificant(2)}%
          </Text>
        </Pool.CellContent>
      </StyledCell>
      <StyledCell>
        <Pool.CellContent>
          <Text fontSize="12px" color="textSubtle" textAlign="left" mb="4px">
            {t('Total Staked:')}
          </Text>
          <Balance
            fontSize={['14px', '14px', '16px']}
            value={formattedUsdValueStaked}
            decimals={2}
            unit="$"
            fontWeight={[600, 400]}
          />
        </Pool.CellContent>
      </StyledCell>
      {isMobile || isTablet ? null : (
        <StyledCell>
          <Pool.CellContent>
            <Text fontSize="12px" color="textSubtle" textAlign="left" mb="4px">
              {t('Ends in')}
            </Text>
            <Text fontSize="12px" color="textSubtle" textAlign="left" mb="4px">
              {remainingDays > 0 ? remainingDays : 0} {t('days')}
            </Text>
          </Pool.CellContent>
        </StyledCell>
      )}
    </Pool.ExpandRow>
  )
}

export default memo(FixedStakingRow)
