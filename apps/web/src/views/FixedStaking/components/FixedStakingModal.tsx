import { useTranslation } from '@pancakeswap/localization'
import {
  ModalV2,
  useModalV2,
  Flex,
  Text,
  Box,
  PreTitle,
  MessageText,
  Message,
  InfoFilledIcon,
} from '@pancakeswap/uikit'
import StyledButton from '@pancakeswap/uikit/src/components/Button/StyledButton'
import { ReactNode, useMemo } from 'react'
import Divider from 'components/Divider'
import { Token } from '@pancakeswap/sdk'
import { differenceInMilliseconds } from 'date-fns'

import ConnectWalletButton from 'components/ConnectWalletButton'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { FixedStakingPool, StakedPosition } from '../type'
import FixedStakingOverview from './FixedStakingOverview'
import { StakingModalTemplate } from './StakingModalTemplate'
import { FixedStakingCalculator } from './FixedStakingCalculator'
import { useCurrentDay } from '../hooks/useStakedPools'

export function FixedStakingModal({
  stakingToken,
  pools,
  children,
  initialLockPeriod,
  stakedPositions,
  setSelectedPeriodIndex,
}: {
  stakingToken: Token
  pools: FixedStakingPool[]
  children: (openModal: () => void, hideStakeButton: boolean) => ReactNode
  initialLockPeriod: number
  stakedPositions: StakedPosition[]
  setSelectedPeriodIndex?: (value: number | null) => void
}) {
  const { account } = useAccountActiveChain()

  const { t } = useTranslation()
  const stakeModal = useModalV2()

  const stakedPeriods = useMemo(
    () =>
      stakedPositions
        .filter((sP) => differenceInMilliseconds(sP.endLockTime * 1_000, new Date()) > 0)
        .map((sP) => sP.pool.lockPeriod),
    [stakedPositions],
  )

  const claimedPeriods = useMemo(
    () =>
      stakedPositions
        .filter((sP) => differenceInMilliseconds(sP.endLockTime * 1_000, new Date()) <= 0)
        .map((sP) => sP.pool.lockPeriod),
    [stakedPositions],
  )

  const hideStakeButton = stakedPositions.length === pools.length

  const currentDay = useCurrentDay()

  return account ? (
    <>
      {children(stakeModal.onOpen, hideStakeButton)}
      <ModalV2
        {...stakeModal}
        onDismiss={() => {
          if (setSelectedPeriodIndex) setSelectedPeriodIndex(null)
          stakeModal.onDismiss()
        }}
        closeOnOverlayClick
      >
        <StakingModalTemplate
          stakingToken={stakingToken}
          pools={pools}
          initialLockPeriod={initialLockPeriod}
          stakedPeriods={stakedPeriods}
          stakedPositions={stakedPositions}
          body={({
            setLockPeriod,
            alreadyStakedAmount,
            poolEndDay,
            stakeCurrencyAmount,
            lockPeriod,
            isStaked,
            boostAPR,
            lockAPR,
            unlockAPR,
            isBoost,
            lastDayAction,
          }) => (
            <>
              {pools.length > 1 ? (
                <>
                  <PreTitle textTransform="uppercase" bold mb="8px">
                    {t('Stake Duration')}
                  </PreTitle>
                  <Flex>
                    {pools.map((pool) => (
                      <StyledButton
                        disabled={
                          currentDay + pool.lockPeriod > pool.endDay || claimedPeriods.includes(pool.lockPeriod)
                        }
                        key={pool.lockPeriod}
                        scale="md"
                        variant={pool.lockPeriod === lockPeriod ? 'subtle' : 'light'}
                        width="100%"
                        mx="2px"
                        onClick={() => setLockPeriod(pool.lockPeriod)}
                      >
                        {pool.lockPeriod}D
                      </StyledButton>
                    ))}
                  </Flex>
                  <Flex mt="8px">
                    <InfoFilledIcon
                      style={{
                        alignSelf: 'baseline',
                        marginTop: '4px',
                        marginRight: '8px',
                      }}
                      color="textSubtle"
                      mr="4px"
                    />
                    <Text fontSize="14px" color="textSubtle">
                      {t('A withdrawal fee of 2% will be applied if amount is unstaked before locked period is up.')}
                    </Text>
                  </Flex>
                  {isStaked ? (
                    <Message variant="warning" my="8px">
                      <MessageText>
                        {`You already have a position in ${lockPeriod}D lock period, adding stake to the position will restart the whole locking period.`}
                      </MessageText>
                    </Message>
                  ) : null}

                  <Divider />
                </>
              ) : null}

              <Box mb="16px" mt="16px">
                <PreTitle textTransform="uppercase" bold mb="8px">
                  {t('Position Overview')}
                </PreTitle>
                <FixedStakingOverview
                  isBoost={isBoost}
                  lastDayAction={lastDayAction}
                  alreadyStakedAmount={alreadyStakedAmount}
                  poolEndDay={poolEndDay}
                  stakeAmount={stakeCurrencyAmount}
                  lockAPR={lockAPR}
                  boostAPR={boostAPR}
                  unlockAPR={unlockAPR}
                  lockPeriod={lockPeriod}
                  calculator={
                    <FixedStakingCalculator
                      isBoost={isBoost}
                      stakingToken={stakingToken}
                      pools={pools}
                      initialLockPeriod={lockPeriod}
                    />
                  }
                />
              </Box>
            </>
          )}
        />
      </ModalV2>
    </>
  ) : (
    <ConnectWalletButton />
  )
}
