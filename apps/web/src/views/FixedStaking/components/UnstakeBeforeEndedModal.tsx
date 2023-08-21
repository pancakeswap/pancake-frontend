import { useTranslation } from '@pancakeswap/localization'
import { Percent, Token } from '@pancakeswap/swap-sdk-core'
import { Box, Button, Flex, Message, MessageText, Modal, ModalV2, PreTitle, Text, useModalV2 } from '@pancakeswap/uikit'
import { LightCard } from 'components/Card'
import { ReactNode, useMemo } from 'react'

import { FixedStakingPool, StakePositionUserInfo, UnstakeType } from '../type'
import { useCalculateProjectedReturnAmount } from '../hooks/useCalculateProjectedReturnAmount'
import { useHandleWithdrawSubmission } from '../hooks/useHandleWithdrawSubmission'
import FixedStakingOverview from './FixedStakingOverview'
import { AmountWithUSDSub } from './AmountWithUSDSub'
import { FixedStakingCalculator } from './FixedStakingCalculator'
import { ModalTitle } from './ModalTitle'

export function UnstakeBeforeEnededModal({
  token,
  lockPeriod,
  lockAPR,
  stakePositionUserInfo,
  withdrawalFee,
  poolIndex,
  boostAPR,
  pools,
  poolEndDay,
  children,
}: {
  poolEndDay: number
  boostAPR: Percent
  token: Token
  lockPeriod: number
  lockAPR: Percent
  stakePositionUserInfo: StakePositionUserInfo
  withdrawalFee: number
  poolIndex: number
  children: (openModal: () => void) => ReactNode
  pools: FixedStakingPool[]
}) {
  const { t } = useTranslation()
  const unstakeModal = useModalV2()

  const { accrueInterest, amountDeposit } = useCalculateProjectedReturnAmount({
    token,
    stakePositionUserInfo,
    lockPeriod,
    apr: boostAPR.greaterThan(0) ? boostAPR : lockAPR,
  })

  const feePercent = useMemo(() => new Percent(withdrawalFee, 10000), [withdrawalFee])

  const withdrawFee = useMemo(
    () => amountDeposit.multiply(feePercent).add(accrueInterest),
    [accrueInterest, amountDeposit, feePercent],
  )

  const totalGetAmount = useMemo(
    () => amountDeposit.add(accrueInterest).subtract(withdrawFee),
    [accrueInterest, amountDeposit, withdrawFee],
  )

  const { handleSubmission, pendingTx: loading } = useHandleWithdrawSubmission({
    poolIndex,
    stakingToken: token,
    onSuccess: () => unstakeModal.onDismiss(),
  })

  return (
    <>
      {children(unstakeModal.onOpen)}
      <ModalV2 {...unstakeModal} closeOnOverlayClick>
        <Modal
          title={<ModalTitle token={token} tokenTitle={token.symbol} lockPeriod={lockPeriod} />}
          width={['100%', '100%', '420px']}
          maxWidth={['100%', , '420px']}
        >
          <PreTitle mb="4px">{t('Unstake Overview')}</PreTitle>
          <LightCard mb="16px">
            <Flex justifyContent="space-between">
              <Box>
                <Text fontSize="12px" textTransform="uppercase" bold color="textSubtle">
                  {t('Commission')}
                </Text>
                <Text color="#D67E0A" fontSize="20px" bold mb="-4px">
                  {withdrawFee.toSignificant(2)} {token.symbol}
                </Text>

                <Text fontSize="12px" color="#D67E0A">
                  {t('for early withdrawal')}
                </Text>
              </Box>
              <Box
                style={{
                  textAlign: 'end',
                }}
              >
                <Text fontSize="12px" textTransform="uppercase" bold color="textSubtle">
                  {t('You will get')}
                </Text>
                <AmountWithUSDSub fontSize="20px" amount={totalGetAmount} />
              </Box>
            </Flex>
          </LightCard>

          <PreTitle color="textSubtle" mb="4px">
            {t('Position Details')}
          </PreTitle>

          <FixedStakingOverview
            isUnstakeView
            lockPeriod={lockPeriod}
            stakeAmount={amountDeposit}
            lockAPR={lockAPR}
            boostAPR={boostAPR}
            poolEndDay={poolEndDay}
            calculator={<FixedStakingCalculator stakingToken={token} pools={pools} initialLockPeriod={lockPeriod} />}
          />

          <Message variant="warning" my="16px">
            <MessageText>{t('No rewards are credited for early withdrawal, and commission is required')}</MessageText>
          </Message>

          <Button
            disabled={loading}
            style={{
              minHeight: '48px',
            }}
            onClick={() => {
              handleSubmission(UnstakeType.WITHDRAW, totalGetAmount)
            }}
          >
            {loading ? t('Confirming') : t('Confirm Unstake')}
          </Button>
        </Modal>
      </ModalV2>
    </>
  )
}
