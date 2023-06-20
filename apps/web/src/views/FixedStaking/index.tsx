import { useTranslation } from '@pancakeswap/localization'
import {
  CardBody,
  Flex,
  FlexLayout,
  Heading,
  StarFillIcon,
  PageHeader,
  Tag,
  Box,
  Text,
  Button,
} from '@pancakeswap/uikit'
import { StyledCard } from '@pancakeswap/uikit/src/widgets/Pool'
import Page from 'components/Layout/Page'
import CurrencyLogo from 'components/Logo/CurrencyLogo'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'

import { FixedStakingCardBody } from './components/FixedStakingCardBody'
import { FixedStakingPosition } from './components/FixedStakingPosition'
import { useStakedPools, useStakedPositionsByUser } from './hooks/useStakedPools'
import { FixedStakingPool, StakedPosition } from './type'
import { HarvestFixedStaking } from './components/HarvestFixedStaking'
import { FixedStakingModal } from './components/FixedStakingModal'

const InlineText = styled(Text)`
  display: inline;
`

function FixedStakingCard({ pool, stakedPositions }: { pool: FixedStakingPool; stakedPositions: StakedPosition[] }) {
  const { t } = useTranslation()

  const stakePosition = stakedPositions.find((position) => position.pool.token.address === pool.token.address)

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
          {stakePosition ? (
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
                lockPeriod={pool.lockPeriod}
                unlockTime={stakePosition.timestampEndLockPeriod}
                stakePositionUserInfo={stakePosition.userInfo}
                token={pool.token}
              />
            </>
          ) : null}
          {stakePosition ? (
            <>
              <Box display="inline">
                <InlineText color="secondary" bold fontSize="12px">
                  {`${pool.token.symbol} `}
                </InlineText>
                <InlineText color="textSubtle" textTransform="uppercase" bold fontSize="12px">
                  {t('Staked')}
                </InlineText>
              </Box>
              <FixedStakingPosition
                poolIndex={pool.poolIndex}
                lockPeriod={pool.lockPeriod}
                unlockTime={stakePosition.timestampEndLockPeriod}
                stakePositionUserInfo={stakePosition.userInfo}
                token={pool.token}
              />
            </>
          ) : (
            <FixedStakingModal lockPeriod={pool.lockPeriod} poolIndex={pool.poolIndex} stakingToken={pool.token}>
              {(openModal) => <Button onClick={openModal}>{t('Stake')}</Button>}
            </FixedStakingModal>
          )}
        </FixedStakingCardBody>
      </CardBody>
    </StyledCard>
  )
}

const FixedStaking = () => {
  const { t } = useTranslation()

  const stakingPools = useStakedPools()

  const stakedPositions = useStakedPositionsByUser()

  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {t('Fixed Staking')}
            </Heading>
            <Heading scale="md" color="text">
              {t('Single-Sided Simple Earn Staking')}
            </Heading>
          </Flex>
        </Flex>
      </PageHeader>
      <Page title={t('Pools')}>
        <FlexLayout>
          {stakingPools.map(
            (pool) =>
              pool?.token && (
                <FixedStakingCard
                  pool={pool}
                  stakedPositions={stakedPositions.filter(
                    ({ pool: stakedPool }) => stakedPool.token.address === pool.token.address,
                  )}
                />
              ),
          )}
        </FlexLayout>
      </Page>
    </>
  )
}

export default FixedStaking
