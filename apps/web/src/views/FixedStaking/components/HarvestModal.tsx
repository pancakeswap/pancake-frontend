import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Card, Flex, InfoFilledIcon, Modal, ModalV2, PreTitle, Text, useModalV2 } from '@pancakeswap/uikit'

import { Currency, CurrencyAmount, Percent } from '@pancakeswap/sdk'
import { LightGreyCard } from 'components/Card'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { ReactNode, useState } from 'react'

import { useAccount } from 'wagmi'
import { FixedStakingPool, UnstakeType } from '../type'
import { AmountWithUSDSub } from './AmountWithUSDSub'
import { DisclaimerCheckBox } from './DisclaimerCheckBox'
import { FixedStakingCalculator } from './FixedStakingCalculator'
import { ModalTitle } from './ModalTitle'
import { StakeConfirmModal } from './StakeConfirmModal'
import { StakedLimitEndOn } from './StakedLimitEndOn'

export function HarvestModal({
  stakingToken,
  children,
  lockPeriod,
  amountDeposit,
  accrueInterest,
  projectedReturnAmount,
  boostAPR,
  lockAPR,
  handleSubmission,
  pendingTx,
  onBack,
  poolEndDay,
  pools,
  isConfirmed,
  isBoost,
  unlockAPR,
}: {
  isBoost?: boolean
  isConfirmed?: boolean
  poolEndDay: number
  onBack: () => void
  stakingToken: Currency
  pools: FixedStakingPool[]
  children: (openModal: () => void) => ReactNode
  lockPeriod: number
  amountDeposit: CurrencyAmount<Currency>
  accrueInterest: CurrencyAmount<Currency>
  projectedReturnAmount: CurrencyAmount<Currency>
  boostAPR: Percent
  lockAPR: Percent
  unlockAPR: Percent
  pendingTx: boolean
  handleSubmission: (type: UnstakeType, amount: CurrencyAmount<Currency>) => Promise<void>
}) {
  const { address: account } = useAccount()
  const [check, setCheck] = useState(false)

  const { t } = useTranslation()
  const restakeModal = useModalV2()

  return account ? (
    <>
      {children(restakeModal.onOpen)}
      <ModalV2 {...restakeModal} closeOnOverlayClick>
        <Modal
          onBack={() => {
            restakeModal.onDismiss()
            onBack()
          }}
          title={
            <ModalTitle
              token={stakingToken}
              tokenTitle={`${t('Restake')} ${stakingToken?.symbol}`}
              lockPeriod={lockPeriod}
            />
          }
          width={['100%', '100%', '420px']}
          maxWidth={['100%', null, '420px']}
        >
          {isConfirmed ? (
            <StakeConfirmModal
              isBoost={isBoost}
              stakeCurrencyAmount={amountDeposit}
              poolEndDay={poolEndDay}
              lockAPR={lockAPR}
              boostAPR={boostAPR}
              unlockAPR={unlockAPR}
              lockPeriod={lockPeriod}
            />
          ) : (
            <>
              <Box mb="16px">
                <Card
                  isActive
                  mb="16px"
                  innerCardProps={{
                    padding: '16px',
                    opacity: '0.9',
                  }}
                >
                  <Flex justifyContent="space-between" alignItems="baseline" mb="8px">
                    <PreTitle color="textSubtle">{t('Claim Reward')}</PreTitle>
                    <Box style={{ textAlign: 'end' }}>
                      <AmountWithUSDSub fontSize="20px" amount={accrueInterest} />
                    </Box>
                  </Flex>
                  <Flex>
                    <InfoFilledIcon color="secondary" mr="4px" />
                    <Text fontSize="14px" color="secondary">
                      {t('Claimed amount will be sent to your wallet')}
                    </Text>
                  </Flex>
                </Card>
                <Flex alignItems="center" mb="8px">
                  <PreTitle textTransform="uppercase" bold mr="4px">
                    {t('Restaking')}
                  </PreTitle>
                  <PreTitle color="textSubtle">{t('Position Overview')}</PreTitle>
                </Flex>
                <LightGreyCard>
                  <Flex alignItems="center" justifyContent="space-between">
                    <Text fontSize={12} textTransform="uppercase" color="textSubtle" bold>
                      {t('Stake Amount')}
                    </Text>
                    <Text bold>
                      {amountDeposit.toSignificant(5)} {amountDeposit.currency.symbol}
                    </Text>
                  </Flex>
                  <Flex alignItems="center" justifyContent="space-between">
                    <Text fontSize={12} textTransform="uppercase" color="textSubtle" bold>
                      {t('Duration')}
                    </Text>
                    <Text bold>
                      {lockPeriod} {t('days')}
                    </Text>
                  </Flex>
                  <Flex alignItems="center" justifyContent="space-between">
                    <Text fontSize={12} textTransform="uppercase" color="textSubtle" bold>
                      {t('APR')}
                    </Text>
                    <Text bold>{isBoost ? boostAPR.toSignificant(2) : lockAPR?.toSignificant(2)}%</Text>
                  </Flex>
                  {boostAPR?.greaterThan(0) ? (
                    <Flex alignItems="center" justifyContent="space-between">
                      <Text fontSize={12} textTransform="uppercase" color="textSubtle" bold>
                        {t('Locked Cake Boost')}
                      </Text>
                      <Text bold>{boostAPR.divide(lockAPR).divide(100).toSignificant(2)}x</Text>
                    </Flex>
                  ) : null}
                  <Flex alignItems="center" justifyContent="space-between">
                    <Text fontSize={12} textTransform="uppercase" color="textSubtle" bold>
                      {t('Fixed Staking Ends On')}
                    </Text>
                    <Text bold>
                      <StakedLimitEndOn lockPeriod={lockPeriod} poolEndDay={poolEndDay} />
                    </Text>
                  </Flex>
                  <Flex alignItems="baseline" justifyContent="space-between">
                    <Text fontSize={12} textTransform="uppercase" color="textSubtle" bold>
                      {t('Projected Return')}
                    </Text>
                    <Flex>
                      <Box style={{ textAlign: 'end' }}>
                        <AmountWithUSDSub amount={projectedReturnAmount} />
                      </Box>
                      <FixedStakingCalculator
                        stakingToken={stakingToken}
                        pools={pools}
                        initialLockPeriod={lockPeriod}
                      />
                    </Flex>
                  </Flex>
                </LightGreyCard>
              </Box>
              <DisclaimerCheckBox check={check} setCheck={setCheck} />
              <Button
                disabled
                style={{
                  minHeight: '48px',
                  marginBottom: '8px',
                }}
                onClick={() => handleSubmission(UnstakeType.HARVEST, accrueInterest)}
              >
                {pendingTx ? t('Restaking') : t('Confirm Claim & Restake')}
              </Button>
            </>
          )}
        </Modal>
      </ModalV2>
    </>
  ) : (
    <ConnectWalletButton />
  )
}
