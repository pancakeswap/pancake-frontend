import {
  Box,
  Flex,
  Heading,
  Modal,
  ModalV2,
  PreTitle,
  Text,
  Balance,
  Button,
  useModalV2,
  useToast,
} from '@pancakeswap/uikit'
import { LightCard } from 'components/Card'
import { differenceInMilliseconds, format } from 'date-fns'
import { distanceToNowStrict } from 'utils/timeHelper'
import { CurrencyLogo } from 'components/Logo'
import { useTranslation } from '@pancakeswap/localization'
import { CurrencyAmount, Percent, Token } from '@pancakeswap/swap-sdk-core'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'
import { Dispatch, SetStateAction, useCallback } from 'react'
import { useFixedStakingContract } from 'hooks/useContract'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import BigNumber from 'bignumber.js'

import { LockedFixedTag } from './LockedFixedTag'
import { FixedStakingModal } from './FixedStakingModal'
import { UnstakeEndedModal, UnstakeModal } from './UnstakeModal'
import { UnlockedFixedTag } from './UnlockedFixedTag'
import { HarvestModal } from './HarvestModal'
import { PoolGroup, StakePositionUserInfo } from '../type'

export function DetailModal({
  token,
  lockPeriod,
  stakeModal,
  unlockTime,
  stakingAmount,
  formattedUsdStakingAmount,
  apr,
  stakePositionUserInfo,
  withdrawalFee,
  poolIndex,
  pool,
  stakedPeriods,
}: {
  token: Token
  lockPeriod: number
  stakeModal: {
    onDismiss: () => void
    onOpen: () => void
    isOpen: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
    closeOnOverlayClick: boolean
  }
  unlockTime: number
  stakingAmount: BigNumber
  formattedUsdStakingAmount: number
  apr: Percent
  stakePositionUserInfo: StakePositionUserInfo
  withdrawalFee: number
  poolIndex: number
  pool: PoolGroup
  stakedPeriods: number[]
}) {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const fixedStakingContract = useFixedStakingContract()

  const unstakeModal = useModalV2()

  const amountDeposit = CurrencyAmount.fromRawAmount(token, stakePositionUserInfo.userDeposit.toString())
  const accrueInterest = CurrencyAmount.fromRawAmount(token, stakePositionUserInfo.accrueInterest.toString())

  const projectedReturnAmount = amountDeposit?.multiply(lockPeriod)?.multiply(apr.multiply(lockPeriod).divide(365))

  const feePercent = new Percent(withdrawalFee, 10000)

  const withdrawFee = amountDeposit.multiply(feePercent).add(accrueInterest)

  const totalGetAmount = amountDeposit.add(accrueInterest).subtract(withdrawFee)

  const shouldUnlock = differenceInMilliseconds(unlockTime * 1_000, new Date()) <= 0

  const handleSubmission = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => {
      const methodArgs = [poolIndex]

      return callWithGasPrice(fixedStakingContract, 'withdraw', methodArgs)
    })

    if (receipt?.status) {
      toastSuccess(
        t('Successfully submitted!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your harvest request has been submitted.')}
        </ToastDescriptionWithTx>,
      )
      unstakeModal.onDismiss()
    }
  }, [callWithGasPrice, fetchWithCatchTxError, fixedStakingContract, poolIndex, t, toastSuccess, unstakeModal])

  if (shouldUnlock) {
    return (
      <>
        <HarvestModal
          stakeAmount={stakingAmount.toNumber()}
          accrueInterest={accrueInterest}
          lockPeriod={lockPeriod}
          pools={pool.pools}
          stakingToken={token}
        >
          {(openModal) => (
            <ModalV2 {...stakeModal} closeOnOverlayClick>
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
                    <Text bold>{apr.toSignificant(2)}%</Text>
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
                      stakeModal.onDismiss()
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
                    stakeModal.onDismiss()
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

  return (
    <>
      <FixedStakingModal
        stakedPeriods={stakedPeriods}
        initialLockPeriod={lockPeriod}
        pools={pool.pools}
        stakingToken={token}
      >
        {(openModal) => (
          <ModalV2 {...stakeModal} closeOnOverlayClick>
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
                  <Box>
                    <PreTitle fontSize="12px" color="textSubtle">
                      {t('Unlocks In')}
                    </PreTitle>

                    <Text bold fontSize={16}>
                      {distanceToNowStrict(unlockTime * 1_000)}
                    </Text>

                    <Text color="textSubtle" fontSize={12}>
                      On {format(unlockTime * 1_000, 'MMM d, yyyy hh:mm')}
                    </Text>
                  </Box>
                </Flex>
              </LightCard>
              <PreTitle textTransform="uppercase" bold mb="8px">
                {t('Position Details')}
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
                  <Text bold>{apr.toSignificant(2)}%</Text>
                </Flex>
                <Flex justifyContent="space-between">
                  <Text fontSize="14px" textTransform="uppercase" bold color="textSubtle" textAlign="left" mb="4px">
                    {t('Unlock Date')}
                  </Text>
                  <Text bold>{format(unlockTime * 1_000, 'MMM d, yyyy hh:mm')}</Text>
                </Flex>
                <Flex justifyContent="space-between">
                  <Text fontSize="14px" textTransform="uppercase" bold color="textSubtle" textAlign="left" mb="4px">
                    {t('Projected Return')}
                  </Text>
                  <Text bold>
                    {projectedReturnAmount.toSignificant(2)} {token.symbol}
                  </Text>
                </Flex>
              </LightCard>
              <Button
                style={{
                  minHeight: '48px',
                  marginBottom: '8px',
                }}
                onClick={() => {
                  stakeModal.onDismiss()
                  unstakeModal.onOpen()
                }}
              >
                {t('Unstake')}
              </Button>
              <Button
                onClick={() => {
                  stakeModal.onDismiss()
                  openModal()
                }}
              >
                {t('Add Staking Amount')}
              </Button>
            </Modal>
          </ModalV2>
        )}
      </FixedStakingModal>
      <UnstakeModal
        totalGetAmount={totalGetAmount}
        withdrawFee={withdrawFee}
        loading={pendingTx}
        handleSubmission={handleSubmission}
        token={token}
        lockPeriod={lockPeriod}
        unstakeModal={{ ...unstakeModal, closeOnOverlayClick: true }}
      />
    </>
  )
}
