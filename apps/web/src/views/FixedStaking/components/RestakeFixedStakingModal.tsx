import { useTranslation } from '@pancakeswap/localization'
import { ModalV2, useModalV2, Text, Box, PreTitle, Flex, Balance, Message, MessageText } from '@pancakeswap/uikit'
import { ReactNode } from 'react'
import { CurrencyAmount, Token } from '@pancakeswap/sdk'
import { LightGreyCard } from '@pancakeswap/uikit/src/widgets/RoiCalculator/Card'

import ConnectWalletButton from 'components/ConnectWalletButton'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import toNumber from 'lodash/toNumber'

import { FixedStakingPool, StakedPosition } from '../type'
import FixedStakingOverview from './FixedStakingOverview'
import { StakingModalTemplate } from './StakingModalTemplate'
import { FixedStakingCalculator } from './FixedStakingCalculator'

export function FixedRestakingModal({
  stakingToken,
  pools,
  children,
  initialLockPeriod,
  stakedPeriods,
  setSelectedPeriodIndex,
  amountDeposit,
  stakedPositions,
}: {
  stakingToken: Token
  pools: FixedStakingPool[]
  children: (openModal: () => void) => ReactNode
  initialLockPeriod: number
  stakedPeriods: number[]
  setSelectedPeriodIndex?: (value: number | null) => void
  amountDeposit: CurrencyAmount<Token>
  stakedPositions: StakedPosition[]
}) {
  const { account } = useAccountActiveChain()

  const { t } = useTranslation()
  const stakeModal = useModalV2()

  return account ? (
    <>
      {children(stakeModal.onOpen)}
      <ModalV2
        {...stakeModal}
        onDismiss={() => {
          if (setSelectedPeriodIndex) setSelectedPeriodIndex(null)
          stakeModal.onDismiss()
        }}
        closeOnOverlayClick
      >
        <StakingModalTemplate
          stakedPositions={stakedPositions}
          stakingToken={stakingToken}
          pools={pools}
          initialLockPeriod={initialLockPeriod}
          stakedPeriods={stakedPeriods}
          head={() => (
            <Message variant="primary" mb="24px">
              <MessageText>
                {t('Adding stake to the position will restart the entire fixed staking period.')}
              </MessageText>
            </Message>
          )}
          body={({ stakeCurrencyAmount, alreadyStakedAmount, poolEndDay, lockPeriod, boostAPR, lockAPR }) => (
            <>
              <Box mb="16px" mt="16px">
                <PreTitle textTransform="uppercase" bold mb="8px">
                  {t('Overview')}
                </PreTitle>
                <LightGreyCard>
                  <Flex justifyContent="space-between">
                    <Box>
                      <PreTitle>{t('New Staked Amount')}</PreTitle>
                      <Text bold>
                        <Balance
                          bold
                          fontSize="16px"
                          decimals={2}
                          unit={` ${stakingToken.symbol}`}
                          value={toNumber(amountDeposit.add(stakeCurrencyAmount).toExact())}
                        />{' '}
                      </Text>
                    </Box>
                    <Box style={{ textAlign: 'end' }}>
                      <PreTitle>{t('Stake Period')}</PreTitle>
                      <Text bold>{lockPeriod} Days</Text>
                    </Box>
                  </Flex>
                </LightGreyCard>
              </Box>

              <Box mb="16px" mt="16px">
                <PreTitle textTransform="uppercase" bold mb="8px">
                  {t('Position Details')}
                </PreTitle>
                <FixedStakingOverview
                  alreadyStakedAmount={alreadyStakedAmount}
                  poolEndDay={poolEndDay}
                  stakeAmount={stakeCurrencyAmount}
                  lockAPR={lockAPR}
                  boostAPR={boostAPR}
                  lockPeriod={lockPeriod}
                  calculator={
                    <FixedStakingCalculator stakingToken={stakingToken} pools={pools} initialLockPeriod={lockPeriod} />
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
