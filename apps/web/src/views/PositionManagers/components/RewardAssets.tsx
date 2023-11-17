import { useCallback, useMemo } from 'react'
import { Address } from 'viem'
import { Button, Text, Box, Flex, Balance, useToast } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@pancakeswap/wagmi'
import { Currency } from '@pancakeswap/sdk'
import useCatchTxError from 'hooks/useCatchTxError'
import { usePositionManagerWrapperContract } from 'hooks/useContract'
import { ToastDescriptionWithTx } from 'components/Toast'
import { InnerCard } from './InnerCard'
import { useEarningTokenPriceInfo } from '../hooks'

interface RewardAssetsProps {
  contractAddress: Address
  earningToken: Currency
  pendingReward: bigint | undefined
  isInCakeRewardDateRange: boolean
  refetch?: () => void
}

export const RewardAssets: React.FC<RewardAssetsProps> = ({
  contractAddress,
  pendingReward,
  earningToken,
  refetch,
  isInCakeRewardDateRange,
}) => {
  const { t } = useTranslation()
  const { account, chain } = useWeb3React()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError({ waitForTransactionTimeout: 25_000 })
  const { earningUsdValue, earningsBalance } = useEarningTokenPriceInfo(earningToken, pendingReward)

  const wrapperContract = usePositionManagerWrapperContract(contractAddress)

  const isDisabled = useMemo(() => pendingTx || new BigNumber(earningsBalance).lte(0), [pendingTx, earningsBalance])

  const onClickHarvest = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() =>
      wrapperContract.write.deposit([BigInt(0)], {
        account: account ?? '0x',
        chain,
      }),
    )

    if (receipt?.status) {
      refetch?.()
      toastSuccess(
        `${t('Harvested')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your %symbol% earnings have been sent to your wallet!', { symbol: earningToken.symbol })}
        </ToastDescriptionWithTx>,
      )
    }
  }, [earningToken, account, chain, wrapperContract, t, refetch, fetchWithCatchTxError, toastSuccess])
  if (!isInCakeRewardDateRange && earningsBalance <= 0) return null
  return (
    <InnerCard>
      <Flex>
        <Box>
          <Flex>
            <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
              {earningToken.symbol}
            </Text>
            <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
              {t('Earned')}
            </Text>
          </Flex>
          <Balance lineHeight="1" bold fontSize="20px" decimals={3} value={earningsBalance} />
          <Balance
            prefix="~$"
            decimals={2}
            fontSize="12px"
            display="inline"
            color="textSubtle"
            value={earningUsdValue}
          />
        </Box>
        <Button
          ml="auto"
          width="100px"
          variant="secondary"
          style={{ alignSelf: 'center' }}
          disabled={isDisabled}
          onClick={onClickHarvest}
        >
          {t('Harvest')}
        </Button>
      </Flex>
    </InnerCard>
  )
}
