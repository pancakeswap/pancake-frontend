import {
  Box,
  Button,
  Flex,
  Heading,
  Modal,
  ModalV2,
  PreTitle,
  Text,
  useModalV2,
  useToast,
  Balance,
} from '@pancakeswap/uikit'
import { useCallback } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { LightCard, LightGreyCard } from 'components/Card'
import { Percent, Token } from '@pancakeswap/swap-sdk-core'
import { useFixedStakingContract } from 'hooks/useContract'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import { useStablecoinPriceAmount } from 'hooks/useBUSDPrice'
import { format, differenceInMilliseconds } from 'date-fns'
import { distanceToNowStrict } from 'utils/timeHelper'
import { CurrencyLogo } from 'components/Logo'
import BigNumber from 'bignumber.js'

import { LockedFixedTag } from './LockedFixedTag'
import { StakePositionUserInfo } from '../type'
import { UnlockedFixedTag } from './UnlockedFixedTag'

export function HarvestFixedStaking({
  token,
  stakePositionUserInfo,
  unlockTime,
  lockPeriod,
  poolIndex,
  apr,
}: {
  unlockTime: number
  token: Token
  stakePositionUserInfo: StakePositionUserInfo
  lockPeriod: number
  poolIndex: number
  apr: Percent
}) {
  const { t } = useTranslation()
  const stakeModal = useModalV2()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const fixedStakingContract = useFixedStakingContract()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess } = useToast()

  const earnedAmount = getBalanceAmount(stakePositionUserInfo.accrueInterest, token.decimals)

  const formattedUsdEarnedAmount = useStablecoinPriceAmount(token, earnedAmount.toNumber())

  const handleSubmission = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => {
      const methodArgs = [poolIndex]
      return callWithGasPrice(fixedStakingContract, 'harvest', methodArgs)
    })

    if (receipt?.status) {
      toastSuccess(
        t('Successfully submitted!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your harvest request has been submitted.')}
        </ToastDescriptionWithTx>,
      )
      stakeModal.onDismiss()
    }
  }, [callWithGasPrice, fetchWithCatchTxError, fixedStakingContract, poolIndex, stakeModal, t, toastSuccess])

  const shouldUnlock = differenceInMilliseconds(unlockTime * 1_000, new Date())

  return (
    <>
      <LightGreyCard mb="16px" mt="8px">
        <Flex mb="8px" justifyContent="space-between" width="100%">
          <Flex>
            <Box>
              <Flex>
                <Balance color="secondary" bold fontSize="16px" decimals={4} value={earnedAmount.toNumber()} />
                <Text color="secondary" ml="4px" bold>
                  {token.symbol}
                </Text>
              </Flex>
              <Balance unit=" USD" bold prefix="~$" fontSize="14px" decimals={2} value={formattedUsdEarnedAmount} />
            </Box>
          </Flex>
          {shouldUnlock ? (
            <UnlockedFixedTag>{t('Ended')}</UnlockedFixedTag>
          ) : (
            <LockedFixedTag>{unlockTime}D</LockedFixedTag>
          )}
        </Flex>
        <Flex justifyContent="space-between" width="100%">
          <Box>
            <Text color="textSubtle" fontSize="12px">
              APR: {apr.toSignificant(2)}%
            </Text>
            <Text color="textSubtle" fontSize="12px">
              Unlock on {format(unlockTime * 1_000, 'MMM d, yyyy')}
            </Text>
          </Box>
          <Button
            height="auto"
            disabled={new BigNumber(stakePositionUserInfo.accrueInterest).eq(0)}
            onClick={stakeModal.onOpen}
            variant="secondary"
          >
            {t('Harvest')}
          </Button>
        </Flex>
      </LightGreyCard>
      <ModalV2 {...stakeModal} closeOnOverlayClick>
        <Modal
          title={
            <Flex>
              <CurrencyLogo currency={token} size="28px" />
              <Heading color="secondary" scale="lg" mx="8px">
                {token?.symbol}
              </Heading>
              {shouldUnlock ? (
                <UnlockedFixedTag>{t('Ended')}</UnlockedFixedTag>
              ) : (
                <LockedFixedTag>{lockPeriod}D</LockedFixedTag>
              )}
            </Flex>
          }
          width={['100%', '100%', '420px']}
          maxWidth={['100%', , '420px']}
        >
          <LightCard mb="16px">
            <Flex justifyContent="space-between">
              <Box>
                <PreTitle fontSize="12px" color="textSubtle">
                  {t('Earned Amount')}
                </PreTitle>
                <Flex>
                  <Balance bold fontSize="16px" decimals={4} value={earnedAmount.toNumber()} />
                  <Text ml="4px" bold>
                    {token.symbol}
                  </Text>
                </Flex>
                <Balance bold prefix="~$" fontSize="14px" decimals={2} value={formattedUsdEarnedAmount} />
              </Box>
              <Box>
                <PreTitle fontSize="12px" color="textSubtle">
                  {t('Unlocks In')}
                </PreTitle>
                {shouldUnlock ? (
                  <Text bold color="warning">
                    {t('Unlocked')}
                  </Text>
                ) : (
                  <Text bold fontSize={16}>
                    {distanceToNowStrict(unlockTime * 1_000)}
                  </Text>
                )}
                <Text color={shouldUnlock ? 'warning' : 'textSubtle'} fontSize={12}>
                  On {format(unlockTime * 1_000, 'MMM d, yyyy hh:mm')}
                </Text>
              </Box>
            </Flex>
          </LightCard>

          <Button
            disabled={pendingTx}
            style={{
              minHeight: '48px',
            }}
            onClick={handleSubmission}
          >
            {pendingTx ? t('Harvesting') : t('Harvest')}
          </Button>
        </Modal>
      </ModalV2>
    </>
  )
}
