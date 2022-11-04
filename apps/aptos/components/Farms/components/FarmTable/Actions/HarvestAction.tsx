import { useTranslation } from '@pancakeswap/localization'
import { Skeleton, useToast, Farm as FarmUI } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCatchTxError from 'hooks/useCatchTxError'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import { useCakePriceAsBigNumber } from 'hooks/useStablePrice'
import BigNumber from 'bignumber.js'
import { TransactionResponse } from '@pancakeswap/awgmi/core'
import useHarvestFarm from '../../../hooks/useHarvestFarm'
import { FarmWithStakedValue } from '../../types'

const { FarmTableHarvestAction } = FarmUI.FarmTable

interface HarvestActionProps extends FarmWithStakedValue {
  userDataReady: boolean
  onReward: () => Promise<TransactionResponse>
  onDone?: () => void
}

export const HarvestActionContainer = ({ children, ...props }) => {
  const { onReward } = useHarvestFarm(props.pid, props.lpAddress)

  const onDone = () => console.info('onDone')
  // const onDone = useCallback(
  //   () => dispatch(fetchFarmUserDataAsync({ account, pids: [props.pid], chainId })),
  //   [account, dispatch, chainId, props.pid],
  // )

  return children({ ...props, onDone, onReward })
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
    earnings = getBalanceAmount(earningsBigNumber)
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
    <FarmTableHarvestAction
      earnings={earnings}
      earningsBusd={earningsBusd}
      displayBalance={displayBalance}
      pendingTx={pendingTx}
      userDataReady={userDataReady}
      handleHarvest={handleHarvest}
    />
  )
}

export default HarvestAction
