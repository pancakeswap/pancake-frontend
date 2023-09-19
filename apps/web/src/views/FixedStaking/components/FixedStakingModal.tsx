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
  Button,
  Link,
} from '@pancakeswap/uikit'
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
                      <Button
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
                      </Button>
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
                      {t(
                        'Funds will not be available for withdrawal for the first 10 days, and subsequently an early withdrawal fee will be applied if amount if unstaked before locked period is up. ',
                      )}
                      <Link
                        style={{
                          display: 'inline',
                          fontSize: '14px',
                        }}
                        href="/"
                        target="_blank"
                      >
                        Click here for more information
                      </Link>
                    </Text>
                  </Flex>
                  {isStaked ? (
                    <Message variant="warning" my="8px">
                      <MessageText>
                        {`You already have a position in ${lockPeriod}D lock period, adding to the position will restart locking and non-withdrawal period`}
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
