import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, Percent } from '@pancakeswap/swap-sdk-core'
import { Box, Button, Card, Flex, Modal, ModalV2, PreTitle, Text, useModalV2 } from '@pancakeswap/uikit'
import { LightCard } from 'components/Card'
import { ReactNode, useMemo } from 'react'
import { formatUnixTime } from 'utils/formatTime'

import { useHandleWithdrawSubmission } from '../hooks/useHandleWithdrawSubmission'
import { PoolGroup, StakePositionUserInfo, StakedPosition } from '../type'
import { AmountWithUSDSub } from './AmountWithUSDSub'
import { ModalTitle } from './ModalTitle'
import { StakedLimitEndOn } from './StakedLimitEndOn'
import { UnstakeEndedModal } from './UnstakeModal'

export function ClaimModal({
  token,
  lockPeriod,
  children,
  unlockTime,
  lockAPR,
  stakePositionUserInfo,
  poolIndex,
  boostAPR,
  poolEndDay,
}: {
  stakePosition: StakedPosition
  poolEndDay: number
  token: Currency
  lockPeriod: number
  unlockTime: number
  lockAPR: Percent
  boostAPR: Percent
  unlockAPR: Percent
  stakePositionUserInfo: StakePositionUserInfo
  poolIndex: number
  pool: PoolGroup
  stakedPeriods: number[]
  children: (openClaimModal: () => void) => ReactNode
}) {
  const { t } = useTranslation()
  const unstakeModal = useModalV2()
  const claimModal = useModalV2()

  const amountDeposit = useMemo(
    () => CurrencyAmount.fromRawAmount(token, stakePositionUserInfo.userDeposit.toString()),
    [stakePositionUserInfo.userDeposit, token],
  )

  const apr = useMemo(
    () => (stakePositionUserInfo.boost ? boostAPR : lockAPR),
    [boostAPR, lockAPR, stakePositionUserInfo.boost],
  )

  const accrueInterest = useMemo(
    () => CurrencyAmount.fromRawAmount(token, stakePositionUserInfo.accrueInterest.toString()),
    [stakePositionUserInfo.accrueInterest, token],
  )

  const { handleSubmission, pendingTx } = useHandleWithdrawSubmission({
    poolIndex,
    stakingToken: token,
    onSuccess: () => (unstakeModal.isOpen ? unstakeModal.onDismiss() : null),
  })

  const unlockTimeFormat = formatUnixTime(unlockTime)

  return (
    <>
      {children(claimModal.onOpen)}

      <ModalV2 {...claimModal} closeOnOverlayClick>
        <Modal
          title={<ModalTitle tokenTitle={token.symbol} token={token} lockPeriod={lockPeriod} />}
          width={['100%', '100%', '420px']}
          maxWidth={['100%', '', '420px']}
        >
          <PreTitle color="textSubtle">{t('Overview')}</PreTitle>
          <LightCard mb="16px">
            <Flex justifyContent="space-between">
              <Box>
                <PreTitle fontSize="12px" color="textSubtle">
                  {t('Stake Amount')}
                </PreTitle>
                <AmountWithUSDSub fontSize="20px" amount={amountDeposit} />
              </Box>
              <Box
                style={{
                  textAlign: 'end',
                }}
              >
                <PreTitle fontSize="12px" color="textSubtle">
                  {t('Fixed-staking Ends')}
                </PreTitle>

                <Text fontSize="20px" bold color="#D67E0A" mb="-4px">
                  {t('Ended')}
                </Text>

                <Text color="#D67E0A" fontSize={12}>
                  On {unlockTimeFormat}
                </Text>
              </Box>
            </Flex>
          </LightCard>
          <PreTitle textTransform="uppercase" bold mb="8px">
            {t('Details')}
          </PreTitle>

          <Card
            mb="16px"
            isActive
            innerCardProps={{
              padding: '16px',
              opacity: '0.9',
            }}
          >
            <Flex justifyContent="space-between" alignItems="start">
              <Text fontSize="14px" textTransform="uppercase" bold color="textSubtle" textAlign="left">
                {t('Rewards')}
              </Text>
              <Box style={{ textAlign: 'end' }}>
                <AmountWithUSDSub amount={accrueInterest} />
              </Box>
            </Flex>
            <Flex justifyContent="space-between" alignItems="center">
              <Text fontSize="14px" textTransform="uppercase" bold color="textSubtle" textAlign="left">
                {t('Restake period ends on')}
              </Text>
              <Text textAlign="end" bold>
                <StakedLimitEndOn lockPeriod={lockPeriod} poolEndDay={poolEndDay} />
              </Text>
            </Flex>
            <Flex justifyContent="space-between" mb="8px" alignItems="center">
              <Text fontSize="14px" textTransform="uppercase" bold color="textSubtle" textAlign="left">
                {t('APR')}
              </Text>
              <Text bold>{apr.toSignificant(2)}%</Text>
            </Flex>
          </Card>

          <Button
            variant="secondary"
            style={{
              minHeight: '48px',
              marginBottom: '8px',
            }}
            onClick={() => {
              claimModal.onDismiss()
              unstakeModal.onOpen()
            }}
          >
            {t('Claim Reward & Unstake')}
          </Button>
        </Modal>
      </ModalV2>

      <UnstakeEndedModal
        onBack={claimModal.onOpen}
        loading={pendingTx}
        stakeAmount={amountDeposit}
        accrueInterest={accrueInterest}
        handleSubmission={handleSubmission}
        token={token}
        lockPeriod={lockPeriod}
        unstakeModal={unstakeModal}
      />
    </>
  )
}
