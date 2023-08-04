import { Box, Flex, Heading, Modal, ModalV2, PreTitle, Text, Balance, Button, useModalV2 } from '@pancakeswap/uikit'
import { LightCard } from 'components/Card'
import { format } from 'date-fns'
import { CurrencyLogo } from 'components/Logo'
import { useTranslation } from '@pancakeswap/localization'
import { Percent, Token } from '@pancakeswap/swap-sdk-core'
import BigNumber from 'bignumber.js'
import { ReactNode } from 'react'

import { UnstakeEndedModal } from './UnstakeModal'
import { UnlockedFixedTag } from './UnlockedFixedTag'
import { HarvestModal } from './HarvestModal'
import { PoolGroup, StakePositionUserInfo } from '../type'
import { useHandleWithdrawSubmission } from '../hooks/useHandleWithdrawSubmission'
import { useCalculateProjectedReturnAmount } from '../hooks/useCalculateProjectedReturnAmount'

export function ClaimModal({
  token,
  lockPeriod,
  children,
  unlockTime,
  stakingAmount,
  formattedUsdStakingAmount,
  lockAPR,
  stakePositionUserInfo,
  poolIndex,
  pool,
  boostAPR,
}: {
  token: Token
  lockPeriod: number
  unlockTime: number
  stakingAmount: BigNumber
  formattedUsdStakingAmount: number
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

  const { projectedReturnAmount, accrueInterest, amountDeposit } = useCalculateProjectedReturnAmount({
    token,
    stakePositionUserInfo,
    lockPeriod,
    apr: boostAPR.greaterThan(0) ? boostAPR : lockAPR,
  })

  const { handleSubmission, pendingTx } = useHandleWithdrawSubmission({ poolIndex })

  return (
    <>
      {children(claimModal.onOpen)}
      <HarvestModal
        stakeAmount={stakingAmount.toNumber()}
        accrueInterest={accrueInterest}
        lockPeriod={lockPeriod}
        pools={pool.pools}
        stakingToken={token}
      >
        {(openModal) => (
          <ModalV2 {...claimModal} closeOnOverlayClick>
            <Modal
              title={
                <Flex>
                  <CurrencyLogo currency={token} size="28px" />
                  <Heading color="secondary" scale="lg" mx="8px">
                    {token?.symbol}
                  </Heading>
                  <UnlockedFixedTag>{lockPeriod}D</UnlockedFixedTag>
                </Flex>
              }
              width={['100%', '100%', '420px']}
              maxWidth={['100%', , '420px']}
            >
              <LightCard mb="16px">
                <Flex justifyContent="space-between">
                  <Box>
                    <PreTitle fontSize="12px" color="textSubtle">
                      {t('Stake Amount')}
                    </PreTitle>
                    <Flex>
                      <Balance bold fontSize="16px" decimals={4} value={stakingAmount.toNumber()} />
                      <Text ml="4px" bold>
                        {token.symbol}
                      </Text>
                    </Flex>
                    <Balance bold prefix="~$" fontSize="14px" decimals={2} value={formattedUsdStakingAmount} />
                  </Box>
                  <Box
                    style={{
                      textAlign: 'end',
                    }}
                  >
                    <PreTitle fontSize="12px" color="textSubtle">
                      {t('Fixed-staking Ends')}
                    </PreTitle>

                    <Text bold color="warning">
                      {t('Ended')}
                    </Text>

                    <Text color="warning" fontSize={12}>
                      On {format(unlockTime * 1_000, 'MMM d, yyyy hh:mm')}
                    </Text>
                  </Box>
                </Flex>
              </LightCard>
              <PreTitle textTransform="uppercase" bold mb="8px">
                {t('Details')}
              </PreTitle>

              <LightCard mb="16px">
                <Flex justifyContent="space-between">
                  <Text fontSize="14px" textTransform="uppercase" bold color="textSubtle" textAlign="left" mb="4px">
                    {t('Duration')}
                  </Text>
                  <Text bold>{lockPeriod} Days</Text>
                </Flex>
                <Flex justifyContent="space-between">
                  <Text fontSize="14px" textTransform="uppercase" bold color="textSubtle" textAlign="left" mb="4px">
                    {t('APR')}
                  </Text>
                  <Text bold>{lockAPR.toSignificant(2)}%</Text>
                </Flex>
                <Flex justifyContent="space-between">
                  <Text fontSize="14px" textTransform="uppercase" bold color="textSubtle" textAlign="left" mb="4px">
                    {t('Unlock Date')}
                  </Text>
                  <Text bold>{format(unlockTime * 1_000, 'MMM d, yyyy hh:mm')}</Text>
                </Flex>
                <Flex justifyContent="space-between" mb="8px">
                  <Text fontSize="14px" textTransform="uppercase" bold color="textSubtle" textAlign="left" mb="4px">
                    {t('Projected Return')}
                  </Text>
                  <Text bold>
                    {projectedReturnAmount.toSignificant(2)} {token.symbol}
                  </Text>
                </Flex>
                <Button
                  variant="danger"
                  width="100%"
                  onClick={() => {
                    claimModal.onDismiss()
                    openModal()
                  }}
                >
                  {t('Claim Reward & Restake')}
                </Button>
              </LightCard>

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
        loading={pendingTx}
        stakeAmount={amountDeposit}
        accrueInterest={accrueInterest}
        handleSubmission={handleSubmission}
        token={token}
        lockPeriod={lockPeriod}
        unstakeModal={{ ...unstakeModal, closeOnOverlayClick: true }}
      />
    </>
  )
}
