import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/sdk'
import { Balance, Box, Button, Flex, Text, useToast } from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import BigNumber from 'bignumber.js'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCatchTxError from 'hooks/useCatchTxError'
import { usePositionManagerBCakeWrapperContract, usePositionManagerWrapperContract } from 'hooks/useContract'
import { useCallback, useMemo } from 'react'
import { Address } from 'viem'
import { useEarningTokenPriceInfo } from '../hooks'

interface RewardAssetsProps {
  contractAddress: Address
  bCakeWrapper?: Address
  earningToken: Currency
  pendingReward: bigint | undefined
  refetch?: () => void
}

export const RewardAssets: React.FC<RewardAssetsProps> = ({
  contractAddress,
  pendingReward,
  earningToken,
  refetch,
  bCakeWrapper,
}) => {
  const { t } = useTranslation()
  const { account, chain } = useWeb3React()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { earningUsdValue, earningsBalance } = useEarningTokenPriceInfo(earningToken, pendingReward)
  const bCakeWrapperAddress = bCakeWrapper ?? '0x'
  const bCakeWrapperContract = usePositionManagerBCakeWrapperContract(bCakeWrapperAddress)
  const wrapperContract = usePositionManagerWrapperContract(contractAddress)

  const isDisabled = useMemo(() => pendingTx || new BigNumber(earningsBalance).lte(0), [pendingTx, earningsBalance])

  const onClickHarvest = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(
      bCakeWrapper
        ? () =>
            bCakeWrapperContract.write.deposit([BigInt(0), false], {
              account: account ?? '0x',
              chain,
            })
        : () =>
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
  }, [
    fetchWithCatchTxError,
    bCakeWrapper,
    bCakeWrapperContract.write,
    account,
    chain,
    wrapperContract.write,
    refetch,
    toastSuccess,
    t,
    earningToken.symbol,
  ])

  return (
    <Flex width="100%">
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
        <Balance prefix="~$" decimals={2} fontSize="12px" display="inline" color="textSubtle" value={earningUsdValue} />
      </Box>
      <Button
        ml="auto"
        width="100px"
        variant="primary"
        style={{ alignSelf: 'center' }}
        disabled={isDisabled}
        onClick={onClickHarvest}
      >
        {t('Harvest')}
      </Button>
    </Flex>
  )
}
