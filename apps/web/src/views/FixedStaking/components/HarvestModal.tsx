import { useTranslation } from '@pancakeswap/localization'
import {
  Button,
  ModalV2,
  useModalV2,
  Modal,
  Flex,
  Text,
  Box,
  PreTitle,
  useToast,
  Balance,
  Heading,
  InfoFilledIcon,
} from '@pancakeswap/uikit'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { ReactNode, useCallback, useMemo } from 'react'
import { LightGreyCard } from 'components/Card'
import { useFixedStakingContract } from 'hooks/useContract'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { CurrencyAmount, Token } from '@pancakeswap/sdk'
import toNumber from 'lodash/toNumber'
import ConnectWalletButton from 'components/ConnectWalletButton'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { format, add } from 'date-fns'
import { CurrencyLogo } from 'components/Logo'
import { FixedStakingPool } from '../type'
import { useFixedStakeAPR } from '../hooks/useFixedStakeAPR'
import { UnlockedFixedTag } from './UnlockedFixedTag'
import { DisclaimerCheckBox } from './DisclaimerCheckBox'

export function HarvestModal({
  stakingToken,
  pools,
  children,
  lockPeriod,
  stakeAmount,
  accrueInterest,
}: {
  stakingToken: Token
  pools: FixedStakingPool[]
  children: (openModal: () => void) => ReactNode
  lockPeriod: number
  stakeAmount: number
  accrueInterest: CurrencyAmount<Token>
}) {
  const { account } = useAccountActiveChain()

  const { t } = useTranslation()
  const restakeModal = useModalV2()

  const selectedPool = useMemo(() => pools.find((p) => p.lockPeriod === lockPeriod), [lockPeriod, pools])

  const { boostAPR, lockAPR } = useFixedStakeAPR(selectedPool)

  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const fixedStakingContract = useFixedStakingContract()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess } = useToast()

  const rawAmount = getDecimalAmount(new BigNumber(stakeAmount), stakingToken.decimals)

  const stakeCurrencyAmount = rawAmount.gt(0)
    ? CurrencyAmount.fromRawAmount(stakingToken, rawAmount.toString())
    : undefined

  const projectedReturnAmount = stakeCurrencyAmount
    ?.multiply(lockPeriod)
    ?.multiply(boostAPR.multiply(lockPeriod).divide(365))

  const handleSubmission = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => {
      if (!selectedPool) return null
      const methodArgs = [selectedPool.poolIndex]
      return callWithGasPrice(fixedStakingContract, 'harvest', methodArgs)
    })

    if (receipt?.status) {
      toastSuccess(
        t('Restaked!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your funds have been restaked in the pool')}
        </ToastDescriptionWithTx>,
      )
      restakeModal.onDismiss()
    }
  }, [fetchWithCatchTxError, selectedPool, callWithGasPrice, fixedStakingContract, toastSuccess, t, restakeModal])

  return account ? (
    <>
      {children(restakeModal.onOpen)}
      <ModalV2 {...restakeModal} closeOnOverlayClick>
        <Modal
          title={
            <Flex>
              <CurrencyLogo currency={stakingToken} size="28px" />
              <Heading color="secondary" scale="lg" mx="8px">
                {t('Restake')} {stakingToken?.symbol}
              </Heading>
              <UnlockedFixedTag>{lockPeriod}D</UnlockedFixedTag>
            </Flex>
          }
          width={['100%', '100%', '420px']}
          maxWidth={['100%', , '420px']}
        >
          <Box mb="16px">
            <LightGreyCard mb="16px">
              <Flex justifyContent="space-between" alignItems="center" mb="8px">
                <PreTitle color="textSubtle">{t('Claim Reward')}</PreTitle>
                <Text bold>
                  {accrueInterest?.toSignificant(4) ?? 0} {stakingToken.symbol}
                </Text>
              </Flex>
              <Flex>
                <InfoFilledIcon color="secondary" mr="4px" />
                <Text fontSize="14px" color="secondary">
                  {t('Claimed amount will be sent to your wallet')}
                </Text>
              </Flex>
            </LightGreyCard>
            <Flex alignItems="center" mb="8px">
              <PreTitle textTransform="uppercase" bold mr="4px">
                {t('Restaking')}
              </PreTitle>
              <PreTitle color="textSubtle">{t('Position Overview')}</PreTitle>
            </Flex>
            <LightGreyCard>
              <Flex alignItems="center" justifyContent="space-between">
                <Text fontSize={12} textTransform="uppercase" color="textSubtle" bold>
                  {t('Restake Amount')}
                </Text>
                <Balance bold fontSize="16px" decimals={2} value={toNumber(stakeAmount)} />
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
                <Text bold>{lockAPR?.toSignificant(2)}%</Text>
              </Flex>
              <Flex alignItems="center" justifyContent="space-between">
                <Text fontSize={12} textTransform="uppercase" color="textSubtle" bold>
                  {t('vCAKE Boost')}
                </Text>
                <Text bold>{boostAPR?.toSignificant(2)}%</Text>
              </Flex>
              <Flex alignItems="center" justifyContent="space-between">
                <Text fontSize={12} textTransform="uppercase" color="textSubtle" bold>
                  {t('Fixed Staking Ends On')}
                </Text>
                <Text bold>{format(add(new Date(), { days: lockPeriod }), 'MMM d, yyyy hh:mm')}</Text>
              </Flex>
              <Flex alignItems="center" justifyContent="space-between">
                <Text fontSize={12} textTransform="uppercase" color="textSubtle" bold>
                  Projected Return
                </Text>
                <Text bold>
                  {projectedReturnAmount?.toSignificant(2) ?? 0} {stakingToken.symbol}
                </Text>
              </Flex>
            </LightGreyCard>
          </Box>
          <DisclaimerCheckBox />
          <Button
            disabled={!rawAmount.gt(0) || pendingTx}
            style={{
              minHeight: '48px',
            }}
            onClick={handleSubmission}
          >
            {pendingTx ? t('Restaking') : t('Confirm Claim & Restake')}
          </Button>
        </Modal>
      </ModalV2>
    </>
  ) : (
    <ConnectWalletButton />
  )
}
