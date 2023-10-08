import { useTranslation } from '@pancakeswap/localization'
import {
  ModalV2,
  useModalV2,
  Box,
  PreTitle,
  IconButton,
  CalculateIcon,
  RoiCard,
  CalculatorMode,
  Flex,
  Button,
} from '@pancakeswap/uikit'
import { CurrencyAmount, Percent, Token } from '@pancakeswap/sdk'
import toNumber from 'lodash/toNumber'
import { useMemo } from 'react'
import { useStablecoinPriceAmount } from 'hooks/useBUSDPrice'

import { FixedStakingPool } from '../type'
import FixedStakingOverview from './FixedStakingOverview'
import { StakingModalTemplate } from './StakingModalTemplate'
import { useCurrentDay } from '../hooks/useStakedPools'
import { useCalculateProjectedReturnAmount } from '../hooks/useCalculateProjectedReturnAmount'

function FixedStakingRoiCard({
  stakeAmount,
  lockAPR,
  boostAPR,
  unlockAPR,
  isBoost,
  lockPeriod,
  lastDayAction,
  poolEndDay,
}: {
  stakeAmount: CurrencyAmount<Token>
  lockAPR: Percent
  boostAPR: Percent
  unlockAPR: Percent
  poolEndDay: number
  lastDayAction?: number
  lockPeriod?: number
  isBoost?: boolean
}) {
  const apr = useMemo(() => (isBoost ? boostAPR : lockAPR), [boostAPR, isBoost, lockAPR])

  const safeAlreadyStakedAmount = useMemo(
    () => CurrencyAmount.fromRawAmount(stakeAmount.currency, '0'),
    [stakeAmount.currency],
  )

  const currentDay = useCurrentDay()

  const { projectedReturnAmount } = useCalculateProjectedReturnAmount({
    amountDeposit: stakeAmount.add(safeAlreadyStakedAmount),
    lastDayAction: safeAlreadyStakedAmount.greaterThan(0) && stakeAmount.equalTo(0) ? lastDayAction : currentDay,
    lockPeriod: lockPeriod || 0,
    apr,
    poolEndDay,
    unlockAPR,
  })

  const formattedUsdProjectedReturnAmount = useStablecoinPriceAmount(
    projectedReturnAmount.currency,
    toNumber(projectedReturnAmount?.toSignificant(2)),
  )

  return (
    <RoiCard
      earningTokenSymbol={projectedReturnAmount.currency.symbol}
      calculatorState={{
        data: {
          roiUSD: formattedUsdProjectedReturnAmount || 0,
          roiTokens: projectedReturnAmount ? toNumber(projectedReturnAmount?.toSignificant(2)) : 0,
          roiPercentage: apr ? toNumber(apr?.toSignificant(2)) : 0,
        },
        controls: {
          mode: CalculatorMode.ROI_BASED_ON_PRINCIPAL,
        },
      }}
    />
  )
}

export function FixedStakingCalculator({
  stakingToken,
  pools,
  initialLockPeriod,
  hideBackButton,
}: {
  stakingToken: Token
  pools: FixedStakingPool[]
  initialLockPeriod: number
  hideBackButton?: boolean
}) {
  const stakedPeriods = useMemo(() => pools.map((p) => p.lockPeriod), [pools])

  const { t } = useTranslation()
  const stakeModal = useModalV2()

  return (
    <>
      <IconButton
        height="24px"
        variant="text"
        scale="sm"
        onClick={(e) => {
          e.stopPropagation()
          stakeModal.onOpen()
        }}
      >
        <CalculateIcon color="textSubtle" ml="0.25em" width="24px" />
      </IconButton>
      <ModalV2
        {...stakeModal}
        onDismiss={() => {
          stakeModal.onDismiss()
        }}
        closeOnOverlayClick
      >
        <StakingModalTemplate
          title={t('ROI Calculator')}
          onBack={hideBackButton ? null : () => stakeModal.onDismiss()}
          hideStakeButton
          stakingToken={stakingToken}
          pools={pools}
          initialLockPeriod={initialLockPeriod}
          stakedPeriods={stakedPeriods}
          body={({
            setLockPeriod,
            stakeCurrencyAmount,
            lockPeriod,
            boostAPR,
            lockAPR,
            unlockAPR,
            poolEndDay,
            lastDayAction,
            isBoost,
          }) => (
            <>
              <PreTitle textTransform="uppercase" bold mb="8px">
                {t('Stake Duration')}
              </PreTitle>
              <Flex mb="16px">
                {pools.map((pool) => (
                  <Button
                    key={pool.lockPeriod}
                    scale="md"
                    variant={pool.lockPeriod === lockPeriod ? 'subtle' : 'light'}
                    width="100%"
                    mx="2px"
                    onClick={(e) => {
                      e.stopPropagation()
                      setLockPeriod(pool.lockPeriod)
                    }}
                  >
                    {pool.lockPeriod}D
                  </Button>
                ))}
              </Flex>

              <FixedStakingRoiCard
                lastDayAction={lastDayAction}
                poolEndDay={poolEndDay}
                stakeAmount={stakeCurrencyAmount}
                lockAPR={lockAPR}
                boostAPR={boostAPR}
                isBoost={isBoost}
                unlockAPR={unlockAPR}
                lockPeriod={lockPeriod}
              />

              <Box mb="16px" mt="16px">
                <PreTitle textTransform="uppercase" bold mb="8px">
                  {t('Position Overview')}
                </PreTitle>
                <FixedStakingOverview
                  lastDayAction={lastDayAction}
                  poolEndDay={poolEndDay}
                  stakeAmount={stakeCurrencyAmount}
                  lockAPR={lockAPR}
                  boostAPR={boostAPR}
                  isBoost={isBoost}
                  unlockAPR={unlockAPR}
                  lockPeriod={lockPeriod}
                />
              </Box>
            </>
          )}
        />
      </ModalV2>
    </>
  )
}
