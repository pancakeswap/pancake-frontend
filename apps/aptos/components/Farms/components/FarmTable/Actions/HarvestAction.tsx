import { TransactionResponse } from '@pancakeswap/awgmi/core'
import { useTranslation } from '@pancakeswap/localization'
import { Balance, Button, Heading, Skeleton, Text, useToast } from '@pancakeswap/uikit'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCakePriceAsBigNumber } from 'hooks/useStablePrice'
import { useFarmEarning } from 'state/farms/hook'
import useHarvestFarm from '../../../hooks/useHarvestFarm'
import { FarmWithStakedValue } from '../../types'
import { ActionContainer, ActionContent, ActionTitles } from './styles'

interface HarvestActionProps extends FarmWithStakedValue {
  userDataReady: boolean
  onReward: () => Promise<TransactionResponse>
  onDone?: () => void
}

export const HarvestActionContainer = ({ children, ...props }) => {
  const { onReward } = useHarvestFarm(props.pid, props.lpAddress)

  const earnings = useFarmEarning(props.pid)

  const onDone = () => console.info('onDone')
  // const onDone = useCallback(
  //   () => dispatch(fetchFarmUserDataAsync({ account, pids: [props.pid], chainId })),
  //   [account, dispatch, chainId, props.pid],
  // )

  return children({
    ...props,
    onDone,
    onReward,
    userData: {
      earnings: new BigNumber(earnings),
    },
  })
}

export const HarvestAction: React.FunctionComponent<React.PropsWithChildren<HarvestActionProps>> = ({
  userData,
  userDataReady,
  onReward,
  onDone,
}) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const earningsBigNumber = userData?.earnings ? new BigNumber(userData.earnings) : BIG_ZERO
  const cakePrice = useCakePriceAsBigNumber()
  let earnings = BIG_ZERO
  let earningsBusd = 0
  let displayBalance = userDataReady ? earnings.toFixed(5, BigNumber.ROUND_DOWN) : <Skeleton width={60} />

  // If user didn't connect wallet default balance will be 0
  if (!earningsBigNumber.isZero()) {
    earnings = getBalanceAmount(earningsBigNumber, 8)
    earningsBusd = earnings.multipliedBy(cakePrice).toNumber()
    displayBalance = earnings.toFixed(5, BigNumber.ROUND_DOWN)
  }

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
    <ActionContainer style={{ minHeight: 124.5 }}>
      <ActionTitles>
        <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
          CAKE
        </Text>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {t('Earned')}
        </Text>
      </ActionTitles>
      <ActionContent>
        <div>
          <Heading>{displayBalance}</Heading>
          {earningsBusd > 0 && (
            <Balance fontSize="12px" color="textSubtle" decimals={2} value={earningsBusd} unit=" USD" prefix="~" />
          )}
        </div>
        <Button ml="4px" disabled={earnings.eq(0) || pendingTx || !userDataReady} onClick={handleHarvest}>
          {pendingTx ? t('Harvesting') : t('Harvest')}
        </Button>
      </ActionContent>
    </ActionContainer>
  )
}

export default HarvestAction
