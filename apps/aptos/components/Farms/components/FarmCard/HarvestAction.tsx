import { useTranslation } from '@pancakeswap/localization'
import { Button, Flex, Heading, useToast, Balance } from '@pancakeswap/uikit'
import { useAccount } from '@pancakeswap/awgmi'
import BigNumber from 'bignumber.js'
import { ToastDescriptionWithTx } from 'components/Toast'
import { TransactionResponse } from '@pancakeswap/awgmi/core'
import useCatchTxError from 'hooks/useCatchTxError'
import { FARM_DEFAULT_DECIMALS } from 'components/Farms/constants'
import { usePriceCakeUsdc } from 'hooks/useStablePrice'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'

interface FarmCardActionsProps {
  earnings?: BigNumber
  pid?: number
  onReward: () => Promise<TransactionResponse>
  onDone?: () => void
}

const HarvestAction: React.FC<React.PropsWithChildren<FarmCardActionsProps>> = ({ earnings, onReward, onDone }) => {
  const { t } = useTranslation()
  const { account } = useAccount()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const cakePrice = usePriceCakeUsdc()
  const rawEarningsBalance = account ? getBalanceAmount(earnings as BigNumber, FARM_DEFAULT_DECIMALS) : BIG_ZERO
  const displayBalance = rawEarningsBalance.toFixed(5, BigNumber.ROUND_DOWN)
  const earningsBusd = rawEarningsBalance ? rawEarningsBalance.times(cakePrice ?? 0).toNumber() : 0

  const handleHarvest = async () => {
    const receipt = await fetchWithCatchTxError(() => onReward())

    if (receipt?.status) {
      toastSuccess(
        `${t('Harvested')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your %symbol% earnings have been sent to your wallet!', { symbol: 'CAKE' })}
        </ToastDescriptionWithTx>,
      )
      onDone?.()
    }
  }

  return (
    <Flex mb="8px" justifyContent="space-between" alignItems="center">
      <Flex flexDirection="column" alignItems="flex-start">
        <Heading color={rawEarningsBalance.eq(0) ? 'textDisabled' : 'text'}>{displayBalance}</Heading>
        {earningsBusd > 0 && (
          <Balance fontSize="12px" color="textSubtle" decimals={2} value={earningsBusd} unit=" USD" prefix="~" />
        )}
      </Flex>
      <Button disabled={rawEarningsBalance.eq(0) || pendingTx} onClick={handleHarvest}>
        {pendingTx ? t('Harvesting') : t('Harvest')}
      </Button>
    </Flex>
  )
}

export default HarvestAction
