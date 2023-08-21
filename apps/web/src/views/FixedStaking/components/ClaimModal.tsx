import { Box, Flex, Modal, ModalV2, PreTitle, Text, Button, useModalV2, Card } from '@pancakeswap/uikit'
import { LightCard, LightGreyCard } from 'components/Card'
import { useTranslation } from '@pancakeswap/localization'
import { Percent, Token } from '@pancakeswap/swap-sdk-core'
import { ReactNode, useState } from 'react'
import { formatTime } from 'utils/formatTime'

import { UnstakeEndedModal } from './UnstakeModal'
import { HarvestModal } from './HarvestModal'
import { PoolGroup, StakePositionUserInfo } from '../type'
import { useHandleWithdrawSubmission } from '../hooks/useHandleWithdrawSubmission'
import { useCalculateProjectedReturnAmount } from '../hooks/useCalculateProjectedReturnAmount'
import { AmountWithUSDSub } from './AmountWithUSDSub'
import { ModalTitle } from './ModalTitle'
import { StakedLimitEndOn } from './StakedLimitEndOn'

export function ClaimModal({
  token,
  lockPeriod,
  children,
  unlockTime,
  lockAPR,
  stakePositionUserInfo,
  poolIndex,
  pool,
  boostAPR,
  poolEndDay,
}: {
  poolEndDay: number
  token: Token
  lockPeriod: number
  unlockTime: number
  lockAPR: Percent
  boostAPR: Percent
  stakePositionUserInfo: StakePositionUserInfo
  poolIndex: number
  pool: PoolGroup
  stakedPeriods: number[]
  children: (openClaimModal: () => void) => ReactNode
}) {
  const { t } = useTranslation()
  const unstakeModal = useModalV2()
  const claimModal = useModalV2()
  const [isConfirmed, setIsConfirmed] = useState(false)

  const { accrueInterest, amountDeposit, projectedReturnAmount } = useCalculateProjectedReturnAmount({
    token,
    stakePositionUserInfo,
    lockPeriod,
    apr: boostAPR.greaterThan(0) ? boostAPR : lockAPR,
  })

  const { handleSubmission, pendingTx } = useHandleWithdrawSubmission({
    poolIndex,
    stakingToken: token,
    onSuccess: () => (unstakeModal.isOpen ? unstakeModal.onDismiss() : setIsConfirmed(true)),
  })

  const unlockTimeFormat = formatTime(unlockTime * 1_000)

  const apr = stakePositionUserInfo.boost ? boostAPR : lockAPR

  return (
    <>
      {children(claimModal.onOpen)}
      <HarvestModal
        isConfirmed={isConfirmed}
        poolEndDay={poolEndDay}
        onBack={claimModal.onOpen}
        handleSubmission={handleSubmission}
        pendingTx={pendingTx}
        lockAPR={lockAPR}
        boostAPR={boostAPR}
        projectedReturnAmount={projectedReturnAmount}
        amountDeposit={amountDeposit}
        accrueInterest={accrueInterest}
        lockPeriod={lockPeriod}
        pools={pool.pools}
        stakingToken={token}
      >
        {(openModal) => (
          <ModalV2 {...claimModal} closeOnOverlayClick>
            <Modal
              title={<ModalTitle tokenTitle={token.symbol} token={token} lockPeriod={lockPeriod} />}
              width={['100%', '100%', '420px']}
              maxWidth={['100%', , '420px']}
            >
              <PreTitle color="textSubtle">{t('Overview')}</PreTitle>
              <LightCard mb="16px">
                <Flex justifyContent="space-between">
                  <Box>
                    <PreTitle fontSize="12px" color="textSubtle">
                      {t('Stake Amount')}
                    </PreTitle>
                    <AmountWithUSDSub amount={amountDeposit} />
                  </Box>
                  <Box
                    style={{
                      textAlign: 'end',
                    }}
                  >
                    <PreTitle fontSize="12px" color="textSubtle">
                      {t('Fixed-staking Ends')}
                    </PreTitle>

                    <Text bold color="#D67E0A" mb="-4px">
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

              <Card mb="16px" isActive>
                <LightGreyCard>
                  <Flex justifyContent="space-between" alignItems="start">
                    <Text fontSize="14px" textTransform="uppercase" bold color="textSubtle" textAlign="left">
                      {t('Rewards')}
                    </Text>
                    <Box style={{ textAlign: 'end' }}>
                      <AmountWithUSDSub amount={projectedReturnAmount} />
                    </Box>
                  </Flex>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Text fontSize="14px" textTransform="uppercase" bold color="textSubtle" textAlign="left">
                      {t('Fixed Staking Ended On')}
                    </Text>
                    <Text bold>
                      <StakedLimitEndOn lockPeriod={lockPeriod} poolEndDay={poolEndDay} />
                    </Text>
                  </Flex>
                  <Flex justifyContent="space-between" mb="8px" alignItems="center">
                    <Text fontSize="14px" textTransform="uppercase" bold color="textSubtle" textAlign="left">
                      {t('APR')}
                    </Text>
                    <Text bold>{apr.toSignificant(2)}%</Text>
                  </Flex>
                  <Button
                    variant="subtle"
                    width="100%"
                    onClick={() => {
                      claimModal.onDismiss()
                      openModal()
                    }}
                  >
                    {t('Claim Reward & Restake')}
                  </Button>
                </LightGreyCard>
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
                {t('Unstake')}
              </Button>
            </Modal>
          </ModalV2>
        )}
      </HarvestModal>
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
