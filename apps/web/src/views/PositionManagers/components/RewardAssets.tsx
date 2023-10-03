import { useCallback, useMemo } from 'react'
import { Button, Text, Box, Flex, Balance, useToast } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import BigNumber from 'bignumber.js'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import { Currency } from '@pancakeswap/sdk'
import useCatchTxError from 'hooks/useCatchTxError'
import { useStablecoinPrice } from 'hooks/useBUSDPrice'
import { usePositionManagerWrapperContract } from 'hooks/useContract'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useUserPendingRewardAmounts } from 'views/PositionManagers/hooks/useAdapterInfo'
import { InnerCard } from './InnerCard'

interface RewardAssetsProps {
  earningToken: Currency
}

export const RewardAssets: React.FC<RewardAssetsProps> = ({ earningToken }) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const earningTokenPrice = useStablecoinPrice(earningToken ?? undefined, { enabled: !!earningToken })

  const wrapperContract = usePositionManagerWrapperContract()

  const { data, refetch } = useUserPendingRewardAmounts()
  const earningsBalance = useMemo(
    () => getBalanceAmount(new BigNumber(10 ** 18), earningToken.decimals).toNumber(),
    [earningToken],
  )

  const earningUsdValue = useMemo(
    () => new BigNumber(data.toString()).times(earningTokenPrice.toSignificant()).toNumber(),
    [data, earningTokenPrice],
  )

  const isDisabled = useMemo(() => pendingTx || new BigNumber(earningsBalance).lte(0), [pendingTx, earningsBalance])

  const onClickHarvest = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => wrapperContract.write.deposit([BigInt(0)], {}))

    if (receipt?.status) {
      refetch()
      toastSuccess(
        `${t('Harvested')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your %symbol% earnings have been sent to your wallet!', { symbol: earningToken.symbol })}
        </ToastDescriptionWithTx>,
      )
    }
  }, [earningToken, wrapperContract, t, refetch, fetchWithCatchTxError, toastSuccess])

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
            prefix="~"
            unit=" USD"
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
