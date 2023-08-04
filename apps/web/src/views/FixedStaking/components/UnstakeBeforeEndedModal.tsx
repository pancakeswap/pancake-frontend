import { useTranslation } from '@pancakeswap/localization'
import { Percent, Token } from '@pancakeswap/swap-sdk-core'
import { Button, Flex, Heading, Message, MessageText, Modal, ModalV2, Text, useModalV2 } from '@pancakeswap/uikit'
import { CurrencyLogo } from 'components/Logo'
import { LightCard } from 'components/Card'
import { ReactNode, useMemo } from 'react'

import { StakePositionUserInfo } from '../type'
import { LockedFixedTag } from './LockedFixedTag'
import { useCalculateProjectedReturnAmount } from '../hooks/useCalculateProjectedReturnAmount'
import { useHandleWithdrawSubmission } from '../hooks/useHandleWithdrawSubmission'

export function UnstakeBeforeEnededModal({
  token,
  lockPeriod,
  apr,
  stakePositionUserInfo,
  withdrawalFee,
  poolIndex,
  children,
}: {
  token: Token
  lockPeriod: number
  apr: Percent
  stakePositionUserInfo: StakePositionUserInfo
  withdrawalFee: number
  poolIndex: number
  children: (openModal: () => void) => ReactNode
}) {
  const { t } = useTranslation()
  const unstakeModal = useModalV2()

  const { accrueInterest, amountDeposit } = useCalculateProjectedReturnAmount({
    token,
    stakePositionUserInfo,
    lockPeriod,
    apr,
  })

  const feePercent = useMemo(() => new Percent(withdrawalFee, 10000), [withdrawalFee])

  const withdrawFee = amountDeposit.multiply(feePercent).add(accrueInterest)

  const totalGetAmount = amountDeposit.add(accrueInterest).subtract(withdrawFee)

  const { handleSubmission, pendingTx: loading } = useHandleWithdrawSubmission({ poolIndex })

  return (
    <>
      {children(unstakeModal.onOpen)}
      <ModalV2 {...unstakeModal} closeOnOverlayClick>
        <Modal
          title={
            <Flex>
              <CurrencyLogo currency={token} size="28px" />
              <Heading color="secondary" scale="lg" mx="8px">
                {token?.symbol}
              </Heading>

              <LockedFixedTag>{lockPeriod}D</LockedFixedTag>
            </Flex>
          }
          width={['100%', '100%', '420px']}
          maxWidth={['100%', , '420px']}
        >
          <LightCard mb="16px">
            <Message variant="warning" mb="16px">
              <MessageText maxWidth="200px">
                {t('No rewards are credited for early withdrawal, and commission is required')}
              </MessageText>
            </Message>
            <Text fontSize="14px" color="textSubtle" textAlign="left" mb="4px">
              {t('Commission for early withdrawal:')}
            </Text>
            <Text bold>
              {withdrawFee.toSignificant(2)} {token.symbol}
            </Text>
            <Text fontSize="14px" color="textSubtle" textAlign="left" mb="4px">
              {t('You will get:')}
            </Text>
            <Text bold>
              {totalGetAmount.toSignificant(2)} {token.symbol}
            </Text>
          </LightCard>

          <Button
            disabled={loading}
            style={{
              minHeight: '48px',
            }}
            onClick={handleSubmission}
          >
            {loading ? t('Staking') : t('Confirm Unstake')}
          </Button>
        </Modal>
      </ModalV2>
    </>
  )
}
