import { useTranslation } from '@pancakeswap/localization'
import { Percent, Token } from '@pancakeswap/swap-sdk-core'
import {
  Box,
  Button,
  Flex,
  Heading,
  Message,
  MessageText,
  Modal,
  ModalV2,
  PreTitle,
  Text,
  useModalV2,
} from '@pancakeswap/uikit'
import { CurrencyLogo } from 'components/Logo'
import { LightCard } from 'components/Card'
import { ReactNode, useMemo } from 'react'

import { StakePositionUserInfo, UnstakeType } from '../type'
import { LockedFixedTag } from './LockedFixedTag'
import { useCalculateProjectedReturnAmount } from '../hooks/useCalculateProjectedReturnAmount'
import { useHandleWithdrawSubmission } from '../hooks/useHandleWithdrawSubmission'
import FixedStakingOverview from './FixedStakingOverview'
import { AmountWithUSDSub } from './AmountWithUSDSub'

export function UnstakeBeforeEnededModal({
  token,
  lockPeriod,
  lockAPR,
  stakePositionUserInfo,
  withdrawalFee,
  poolIndex,
  boostAPR,
  children,
}: {
  boostAPR: Percent
  token: Token
  lockPeriod: number
  lockAPR: Percent
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
          <PreTitle mb="4px">{t('Unstake Overview')}</PreTitle>
          <LightCard mb="16px">
            <Flex justifyContent="space-between">
              <Box>
                <Text fontSize="12px" textTransform="uppercase" bold color="textSubtle">
                  {t('Commission')}
                </Text>
                <Text color="warning" bold marginBottom="-4px">
                  {withdrawFee.toSignificant(2)} {token.symbol}
                </Text>
                <Text fontSize="12px" color="warning">
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
                <AmountWithUSDSub amount={totalGetAmount} />
              </Box>
            </Flex>
          </LightCard>

          <PreTitle color="textSubtle" mb="4px">
            {t('Position Details')}
          </PreTitle>

          <FixedStakingOverview
            lockPeriod={lockPeriod}
            stakeAmount={amountDeposit}
            lockAPR={lockAPR}
            boostAPR={boostAPR}
          />

          <Message variant="warning" my="16px">
            <MessageText maxWidth="200px">
              {t('No rewards are credited for early withdrawal, and commission is required')}
            </MessageText>
          </Message>

          <Button
            disabled={loading}
            style={{
              minHeight: '48px',
            }}
            onClick={() => handleSubmission(UnstakeType.WITHDRAW)}
          >
            {loading ? t('Unstaking') : t('Unstake')}
          </Button>
        </Modal>
      </ModalV2>
    </>
  )
}
