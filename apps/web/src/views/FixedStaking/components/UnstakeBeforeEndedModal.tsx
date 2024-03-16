import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, Percent } from '@pancakeswap/swap-sdk-core'
import { Box, Button, Flex, Message, MessageText, Modal, ModalV2, PreTitle, Text, useModalV2 } from '@pancakeswap/uikit'
import { LightCard } from 'components/Card'
import { ReactNode, useMemo } from 'react'

import { useHandleWithdrawSubmission } from '../hooks/useHandleWithdrawSubmission'
import { useShouldNotAllowWithdraw } from '../hooks/useStakedPools'
import { FixedStakingPool, StakePositionUserInfo, UnstakeType } from '../type'
import { AmountWithUSDSub } from './AmountWithUSDSub'
import { FixedStakingCalculator } from './FixedStakingCalculator'
import FixedStakingOverview from './FixedStakingOverview'
import { ModalTitle } from './ModalTitle'

export function UnstakeBeforeEnededModal({
  token,
  lockPeriod,
  lockAPR,
  stakePositionUserInfo,
  withdrawalFee,
  poolIndex,
  boostAPR,
  unlockAPR,
  pools,
  poolEndDay,
  lastDayAction,
  unlockTime,
  children,
}: {
  unlockTime: number
  lastDayAction: number
  poolEndDay: number
  boostAPR: Percent
  unlockAPR: Percent
  token: Currency
  lockPeriod: number
  lockAPR: Percent
  stakePositionUserInfo: StakePositionUserInfo
  withdrawalFee: number
  poolIndex: number
  children: (openModal: () => void, notAllowWithdrawal: boolean) => ReactNode
  pools: FixedStakingPool[]
}) {
  const { t } = useTranslation()
  const unstakeModal = useModalV2()

  const amountDeposit = useMemo(
    () => CurrencyAmount.fromRawAmount(token, stakePositionUserInfo.userDeposit.toString()),
    [stakePositionUserInfo.userDeposit, token],
  )

  const accrueInterest = useMemo(
    () => CurrencyAmount.fromRawAmount(token, stakePositionUserInfo.accrueInterest.toString()),
    [stakePositionUserInfo.accrueInterest, token],
  )

  const feePercent = useMemo(() => new Percent(withdrawalFee ?? 0, 10000), [withdrawalFee])

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

  const notAllowWithdrawal = useShouldNotAllowWithdraw({
    lastDayAction,
    lockPeriod,
  })

  return (
    <>
      {children(unstakeModal.onOpen, notAllowWithdrawal)}
      <ModalV2 {...unstakeModal} closeOnOverlayClick>
        <Modal
          title={<ModalTitle token={token} tokenTitle={token.symbol} lockPeriod={lockPeriod} />}
          width={['100%', '100%', '420px']}
          maxWidth={['100%', null, '420px']}
        >
          <PreTitle mb="4px">{t('Unstake Overview')}</PreTitle>
          <LightCard mb="16px">
            <Flex justifyContent="space-between">
              <Box>
                <Text fontSize="12px" textTransform="uppercase" bold color="textSubtle">
                  {t('Withdrawal Fee')}
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
            unlockTime={unlockTime}
            lastDayAction={stakePositionUserInfo.lastDayAction}
            lockPeriod={lockPeriod}
            stakeAmount={amountDeposit}
            lockAPR={lockAPR}
            boostAPR={boostAPR}
            unlockAPR={unlockAPR}
            isBoost={stakePositionUserInfo.boost}
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
