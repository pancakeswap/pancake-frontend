import { useTranslation } from '@pancakeswap/localization'
import {
  Box,
  Button,
  ButtonMenu,
  ButtonMenuItem,
  Flex,
  LockIcon,
  Text,
  UnlockIcon,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { CurrencyLogo, Pool } from '@pancakeswap/widgets-internal'
import Divider from 'components/Divider'
import React from 'react'
import { StyledCell } from 'views/Pools/components/PoolsTable/Cells/NameCell'

import { CurrencyAmount } from '@pancakeswap/swap-sdk-core'
import { LightGreyCard } from 'components/Card'
import {
  ActionContainer,
  InfoSection,
  StyledActionPanel,
} from 'views/Pools/components/PoolsTable/ActionPanel/ActionPanel'

import useSelectedPeriod from '../hooks/useSelectedPeriod'
import { PoolGroup, StakedPosition } from '../type'
import { AmountWithUSDSub } from './AmountWithUSDSub'
import AprCell from './AprCell'
import { AprFooter } from './AprFooter'
import { FixedStakingModal } from './FixedStakingModal'
import { InlineText } from './InlineText'
import { StakedPositionSection } from './StakedPositionSection'

const FixedStakingRow = ({ pool, stakedPositions }: { pool: PoolGroup; stakedPositions: StakedPosition[] }) => {
  const { t } = useTranslation()
  const totalStakedAmount = CurrencyAmount.fromRawAmount(pool.token, pool.totalDeposited.toNumber())
  const { isMobile, isTablet } = useMatchBreakpoints()

  const { selectedPeriodIndex, setSelectedPeriodIndex, claimedIndexes, lockedIndexes, selectedPool } =
    useSelectedPeriod({
      pool,
      stakedPositions,
    })

  const hideStakeButton = stakedPositions.length === pool.pools.length

  return (
    <>
      {isMobile ? (
        <StyledCell
          style={{
            border: 'none',
            paddingBottom: '0px',
          }}
          display="flex"
          alignItems="center"
        >
          <CurrencyLogo currency={pool.token} size="32px" />
          <Flex flexDirection="column" justifyContent="center" alignItems="start" ml="8px">
            <Text color="secondary" textTransform="uppercase" fontSize="12px" bold mb="-4px">
              {t('Stake & Earn')}
            </Text>
            <Text fontSize="16px" bold>
              {pool.token.symbol}
            </Text>
          </Flex>
          <Box ml="auto" pr="4px">
            <Text color="secondary" textAlign="end" textTransform="uppercase" fontSize="12px" bold mb="-4px">
              {t('APR')}
            </Text>

            <AprCell
              hideCalculator={isMobile}
              selectedPeriodIndex={selectedPeriodIndex}
              selectedPool={selectedPool}
              pool={pool}
            />
          </Box>
        </StyledCell>
      ) : null}
      <Pool.ExpandRow
        initialActivity={false}
        panel={
          <StyledActionPanel expanded>
            <InfoSection mt="8px">
              {isMobile || isTablet ? (
                <Flex justifyContent="space-between" mb="8px">
                  <Text textAlign="left">{t('Total Staked:')}</Text>
                  <Box
                    style={{
                      textAlign: 'end',
                    }}
                  >
                    <AmountWithUSDSub amount={totalStakedAmount} />
                  </Box>
                </Flex>
              ) : null}
              {pool.pools.map((p) => (
                <AprFooter
                  key={p.lockPeriod}
                  stakingToken={pool.token}
                  lockPeriod={p.lockPeriod}
                  pools={pool.pools}
                  boostDayPercent={p.boostDayPercent}
                  lockDayPercent={p.lockDayPercent}
                  unlockDayPercent={p.unlockDayPercent}
                />
              ))}
            </InfoSection>
            <ActionContainer style={{ alignItems: isMobile ? 'center' : 'start' }}>
              {stakedPositions?.length ? (
                <ActionContainer width="100%" pl={['0px', '0px', '0px', '0px', '32px']}>
                  <LightGreyCard mb="16px" mt="8px">
                    {stakedPositions.map((stakePosition, index) => (
                      <React.Fragment key={stakePosition.pool.poolIndex}>
                        <StakedPositionSection
                          showRow={hideStakeButton && !isMobile}
                          stakePosition={stakePosition}
                          lockDayPercent={stakePosition.pool.lockDayPercent}
                          boostDayPercent={stakePosition.pool.boostDayPercent}
                          unlockDayPercent={stakePosition.pool.unlockDayPercent}
                          lockPeriod={stakePosition.pool.lockPeriod}
                          unlockTime={stakePosition.endLockTime}
                          stakePositionUserInfo={stakePosition.userInfo}
                          token={stakePosition.pool.token}
                          poolIndex={stakePosition.pool.poolIndex}
                          withdrawalFee={stakePosition.pool.withdrawalFee}
                          pool={pool}
                          stakedPeriods={stakedPositions.map((position) => position.pool.lockPeriod)}
                        />
                        {index < stakedPositions.length - 1 ? (
                          <Box my="16px">
                            <Divider />
                          </Box>
                        ) : null}
                      </React.Fragment>
                    ))}
                  </LightGreyCard>
                </ActionContainer>
              ) : null}
              {hideStakeButton ? null : (
                <ActionContainer width="100%">
                  <LightGreyCard
                    mb="16px"
                    mt="8px"
                    ml={['0px', '0px', '32px', '32px', '32px']}
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
                      setSelectedPeriodIndex={setSelectedPeriodIndex}
                      key={selectedPeriodIndex}
                      initialLockPeriod={selectedPool?.lockPeriod}
                      pools={pool.pools}
                      stakingToken={pool.token}
                      stakedPositions={stakedPositions}
                    >
                      {(openModal) => (
                        <Button disabled onClick={openModal}>
                          {t('Stake')}
                        </Button>
                      )}
                    </FixedStakingModal>
                  </LightGreyCard>
                </ActionContainer>
              )}
            </ActionContainer>
          </StyledActionPanel>
        }
      >
        <>
          {isMobile ? null : (
            <StyledCell minWidth="120px" display="flex" alignItems="center">
              <CurrencyLogo currency={pool.token} size="48px" />
              <Flex flexDirection="column" justifyContent="center" alignItems="start" ml="8px">
                <Text color="secondary" textTransform="uppercase" fontSize="12px" bold mb="-4px">
                  {t('Stake & Earn')}
                </Text>
                <Text fontSize="16px" bold>
                  {pool.token.symbol}
                </Text>
              </Flex>
            </StyledCell>
          )}

          <StyledCell>
            <Pool.CellContent>
              <Text fontSize="12px" color="textSubtle" textAlign="left" mb="4px">
                {t('Stake Periods')}
              </Text>
              <ButtonMenu
                activeIndex={selectedPeriodIndex ?? pool.pools.length}
                onItemClick={(index, event) => {
                  event.stopPropagation()

                  if ([...claimedIndexes, ...lockedIndexes].includes(index)) {
                    return
                  }

                  setSelectedPeriodIndex(index)
                }}
                scale="sm"
                variant="subtle"
              >
                {pool.pools.map((p, index) => (
                  <ButtonMenuItem width="48px" key={p.lockPeriod}>
                    {claimedIndexes.includes(index) ? <UnlockIcon color="secondary" /> : null}
                    {lockedIndexes.includes(index) ? <LockIcon color="secondary" /> : null}
                    {p.lockPeriod}D
                  </ButtonMenuItem>
                ))}
              </ButtonMenu>
            </Pool.CellContent>
          </StyledCell>

          {isMobile ? null : (
            <StyledCell>
              <Pool.CellContent>
                <Text fontSize="12px" color="textSubtle" textAlign="left" mb="4px">
                  {t('APR')}
                </Text>

                <AprCell
                  hideCalculator={isMobile}
                  selectedPeriodIndex={selectedPeriodIndex}
                  selectedPool={selectedPool}
                  pool={pool}
                />
              </Pool.CellContent>
            </StyledCell>
          )}
          {isMobile || isTablet ? null : (
            <StyledCell>
              <Pool.CellContent>
                <Text fontSize="12px" color="textSubtle" textAlign="left" mb="4px">
                  {t('Total Staked:')}
                </Text>
                <AmountWithUSDSub mb="0px" amount={totalStakedAmount} />
              </Pool.CellContent>
            </StyledCell>
          )}
        </>
      </Pool.ExpandRow>
    </>
  )
}

export default FixedStakingRow
