import { useTranslation } from '@pancakeswap/localization'
import { Button, ModalV2, useModalV2, Modal, Flex, Text, Box, PreTitle, InfoFilledIcon, Card } from '@pancakeswap/uikit'

import { ReactNode } from 'react'
import { LightGreyCard } from 'components/Card'
import { CurrencyAmount, Percent, Token } from '@pancakeswap/sdk'
import ConnectWalletButton from 'components/ConnectWalletButton'
import useAccountActiveChain from 'hooks/useAccountActiveChain'

import { FixedStakingPool, UnstakeType } from '../type'
import { DisclaimerCheckBox } from './DisclaimerCheckBox'
import { AmountWithUSDSub } from './AmountWithUSDSub'
import { StakedLimitEndOn } from './StakedLimitEndOn'
import { StakeConfirmModal } from './StakeConfirmModal'
import { FixedStakingCalculator } from './FixedStakingCalculator'
import { ModalTitle } from './ModalTitle'

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
}: {
  isConfirmed?: boolean
  poolEndDay: number
  onBack: () => void
  stakingToken: Token
  pools: FixedStakingPool[]
  children: (openModal: () => void) => ReactNode
  lockPeriod: number
  amountDeposit: CurrencyAmount<Token>
  accrueInterest: CurrencyAmount<Token>
  projectedReturnAmount: CurrencyAmount<Token>
  boostAPR: Percent
  lockAPR: Percent
  pendingTx: boolean
  handleSubmission: (type: UnstakeType, amount: CurrencyAmount<Token>) => Promise<void>
}) {
  const { account } = useAccountActiveChain()

  const { t } = useTranslation()
  const restakeModal = useModalV2()

  return account ? (
    <>
      {children(restakeModal.onOpen)}
      <ModalV2 {...restakeModal} closeOnOverlayClick>
        <Modal
          title={
            <ModalTitle
              token={stakingToken}
              tokenTitle={`${t('Restake')} ${stakingToken?.symbol}`}
              lockPeriod={lockPeriod}
            />
          }
          width={['100%', '100%', '420px']}
          maxWidth={['100%', , '420px']}
        >
          {isConfirmed ? (
            <StakeConfirmModal
              stakeCurrencyAmount={amountDeposit}
              poolEndDay={poolEndDay}
              lockAPR={lockAPR}
              boostAPR={boostAPR}
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
                      {amountDeposit.toSignificant(2)} {amountDeposit.currency.symbol}
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
                    <Text bold>{boostAPR.greaterThan(0) ? boostAPR.toSignificant(2) : lockAPR?.toSignificant(2)}%</Text>
                  </Flex>
                  {boostAPR?.greaterThan(0) ? (
                    <Flex alignItems="center" justifyContent="space-between">
                      <Text fontSize={12} textTransform="uppercase" color="textSubtle" bold>
                        {t('vCAKE Boost')}
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
              <DisclaimerCheckBox />
              <Button
                disabled={!amountDeposit.greaterThan(0) || pendingTx}
                style={{
                  minHeight: '48px',
                  marginBottom: '8px',
                }}
                onClick={() => handleSubmission(UnstakeType.HARVEST, accrueInterest)}
              >
                {pendingTx ? t('Restaking') : t('Confirm Claim & Restake')}
              </Button>
              <Button
                onClick={() => {
                  restakeModal.onDismiss()
                  onBack()
                }}
                variant="secondary"
              >
                {t('Back')}
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
