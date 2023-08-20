import { useMemo } from 'react'
import { Box, Text, Flex, Pool, SkeletonV2 } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { usePriceCakeUSD } from 'state/farms/hooks'
import { DeserializedLockedVaultUser } from 'state/types'
import { Token } from '@pancakeswap/sdk'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import Actions from 'views/TradingReward/components/YourTradingReward/Actions'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import useUserDataInVaultPresenter from 'views/Pools/components/LockedPool/hooks/useUserDataInVaultPresenter'
import formatSecondsToWeeks from 'views/Pools/components/utils/formatSecondsToWeeks'
import { Incentives } from 'views/TradingReward/hooks/useAllTradingRewardPair'
import { ONE_WEEK_DEFAULT } from '@pancakeswap/pools'
import { getVaultPosition, VaultPosition } from 'utils/cakePool'
import AfterLockedActions from 'views/Pools/components/LockedPool/Common/AfterLockedActions'

const Container = styled(Flex)`
  justify-content: space-between;
  border-top: ${({ theme }) => `solid 1px ${theme.colors.cardBorder}`};
`

interface NoCakeLockedOrExtendLockProps {
  pool: Pool.DeserializedPool<Token>
  userData: DeserializedLockedVaultUser
  incentives: Incentives
  isLockPosition: boolean
  isValidLockDuration: boolean
  thresholdLockTime: number
}

const NoCakeLockedOrExtendLock: React.FC<React.PropsWithChildren<NoCakeLockedOrExtendLockProps>> = ({
  pool,
  userData,
  incentives,
  isLockPosition,
  isValidLockDuration,
  thresholdLockTime,
}) => {
  const { t } = useTranslation()
  const cakePriceBusd = usePriceCakeUSD()
  const { stakingToken, stakingTokenPrice, userData: poolUserData } = pool ?? {}
  const {
    lockEndTime,
    lockStartTime,
    balance: { cakeAsBigNumber, cakeAsNumberBalance, cakeAsDisplayBalance },
  } = userData

  const currentBalance = useMemo(
    () => (poolUserData?.stakingTokenBalance ? new BigNumber(poolUserData?.stakingTokenBalance ?? '0') : BIG_ZERO),
    [poolUserData],
  )

  const { remainingTime, secondDuration } = useUserDataInVaultPresenter({
    lockEndTime,
    lockStartTime,
  })

  const isOnlyNeedExtendLock = useMemo(
    () => isLockPosition && cakeAsBigNumber.gt(0) && !isValidLockDuration,
    [isLockPosition, cakeAsBigNumber, isValidLockDuration],
  )

  const cakePrice = useMemo(
    () => new BigNumber(cakeAsNumberBalance).times(cakePriceBusd).toNumber(),
    [cakePriceBusd, cakeAsNumberBalance],
  )

  const position = useMemo(
    () =>
      getVaultPosition({
        userShares: userData?.userShares,
        locked: userData?.locked,
        lockEndTime: userData?.lockEndTime,
      }),
    [userData],
  )

  const minLockWeekInSeconds = useMemo(() => {
    const currentTime = Date.now() / 1000
    const minusTime =
      new BigNumber(userData.lockEndTime).gt(0) && position <= VaultPosition.LockedEnd
        ? userData.lockEndTime
        : currentTime
    const lockDuration = new BigNumber(incentives?.campaignClaimTime ?? 0).plus(thresholdLockTime).minus(minusTime)
    const week = Math.ceil(new BigNumber(lockDuration).div(ONE_WEEK_DEFAULT).toNumber())
    return new BigNumber(week).times(ONE_WEEK_DEFAULT).toNumber()
  }, [incentives?.campaignClaimTime, position, thresholdLockTime, userData.lockEndTime])

  return (
    <Flex flexDirection={['column', 'column', 'column', 'row']} justifyContent="center">
      <Flex flexDirection="column" width={['100%', '100%', '100%', '354px']}>
        {position >= VaultPosition.LockedEnd ? (
          <>
            <Text textAlign={['left', 'left', 'left', 'center']} color="secondary" bold mb="8px">
              {t('Your locked staking is expired')}
            </Text>
            <Text textAlign={['left', 'left', 'left', 'center']} mb="20px">
              <Text textAlign={['left', 'left', 'left', 'center']} as="span">
                {t('Renew your stakings for')}
              </Text>
              <Text textAlign={['left', 'left', 'left', 'center']} as="span" m="0 4px" bold>
                {formatSecondsToWeeks(minLockWeekInSeconds)}
              </Text>
              <Text textAlign={['left', 'left', 'left', 'center']} as="span">
                {t('or more to claim rewards from trades!')}
              </Text>
            </Text>
          </>
        ) : (
          <>
            {!isOnlyNeedExtendLock ? (
              <>
                <Text textAlign={['left', 'left', 'left', 'center']} color="secondary" bold mb="8px">
                  {t('You have no CAKE locked.')}
                </Text>
                <Text textAlign={['left', 'left', 'left', 'center']} mb="20px">
                  <Text textAlign={['left', 'left', 'left', 'center']} as="span">
                    {t('Lock any amount of CAKE for')}
                  </Text>
                  <Text textAlign={['left', 'left', 'left', 'center']} as="span" m="0 4px" bold>
                    {formatSecondsToWeeks(minLockWeekInSeconds)}
                  </Text>
                  <Text textAlign={['left', 'left', 'left', 'center']} as="span">
                    {t('or more to claim rewards from trades!')}
                  </Text>
                </Text>
              </>
            ) : (
              <>
                <Text textAlign={['left', 'left', 'left', 'center']} color="secondary" bold mb="8px">
                  {t('Not enough remaining lock duration')}
                </Text>
                <Text textAlign={['left', 'left', 'left', 'center']} mb="20px">
                  <Text as="span">{t('Extend your position to for')}</Text>
                  <Text as="span" m="0 4px" bold>
                    {formatSecondsToWeeks(minLockWeekInSeconds)}
                  </Text>
                  <Text as="span">{t('or more to claim rewards from trades!')}</Text>
                </Text>
              </>
            )}
          </>
        )}
        <Container>
          <Flex width="100%" margin="auto" flexDirection="column">
            <Text
              padding="24px 0 8px 0"
              textTransform="uppercase"
              color="secondary"
              bold
              textAlign={['left', 'left', 'left', 'center']}
            >
              {t('Your Position')}
            </Text>
            <Flex width={['100%', '100%', '100%', '228px']} m="auto" justifyContent="space-between">
              <Flex>
                <Flex flexDirection="column">
                  <Text fontSize="12px" color="textSubtle" textTransform="uppercase" bold>
                    {`CAKE ${t('Locked')}`}
                  </Text>
                  <SkeletonV2 isDataReady={!!cakeAsDisplayBalance} wrapperProps={{ height: 'fit-content' }}>
                    <Text bold fontSize="20px" lineHeight="110%" color={cakeAsNumberBalance > 0 ? 'text' : 'failure'}>
                      {cakeAsDisplayBalance}
                    </Text>
                    <Text fontSize="12px" lineHeight="110%" color={cakeAsNumberBalance > 0 ? 'text' : 'failure'}>
                      {`~$${formatNumber(cakePrice)} USD`}
                    </Text>
                  </SkeletonV2>
                </Flex>
              </Flex>
              <Flex>
                <Flex flexDirection="column">
                  <Text fontSize="12px" color="textSubtle" textTransform="uppercase" bold>
                    {t('Unlocks In')}
                  </Text>
                  <Text
                    bold
                    fontSize="20px"
                    lineHeight="110%"
                    color={isValidLockDuration && secondDuration > 0 ? 'text' : 'failure'}
                  >
                    {position >= VaultPosition.LockedEnd
                      ? t('Unlocked')
                      : secondDuration === 0
                      ? t('0 Weeks')
                      : remainingTime}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
            {position >= VaultPosition.LockedEnd ? (
              <Box width="100%" mt="16px">
                <AfterLockedActions
                  position={position}
                  currentLockedAmount={cakeAsNumberBalance}
                  stakingToken={stakingToken}
                  stakingTokenPrice={stakingTokenPrice}
                  lockEndTime="0"
                  lockStartTime="0"
                  hideConvertToFlexibleButton
                  customLockWeekInSeconds={minLockWeekInSeconds}
                />
              </Box>
            ) : (
              <Actions
                lockEndTime={lockEndTime}
                lockStartTime={lockStartTime}
                lockedAmount={cakeAsBigNumber}
                stakingToken={stakingToken}
                stakingTokenPrice={stakingTokenPrice}
                currentBalance={currentBalance}
                isOnlyNeedExtendLock={isOnlyNeedExtendLock}
                customLockWeekInSeconds={minLockWeekInSeconds}
              />
            )}
          </Flex>
        </Container>
      </Flex>
    </Flex>
  )
}

export default NoCakeLockedOrExtendLock
