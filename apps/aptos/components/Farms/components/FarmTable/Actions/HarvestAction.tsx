import { useState } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { Button, Heading, Skeleton, Text, useToast, Balance } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import { useCakePriceAsBigNumber } from 'hooks/useStablePrice'
import BigNumber from 'bignumber.js'
import useHarvestFarm from '../../../hooks/useHarvestFarm'
import { ActionContainer, ActionContent, ActionTitles } from './styles'

// interface HarvestActionProps extends FarmWithStakedValue {
//   userDataReady: boolean
//   onReward?: () => Promise<TransactionResponse>
//   onDone?: () => void
// }

export const HarvestActionContainer = ({ children, ...props }) => {
  const { onReward } = useHarvestFarm(props.pid)
  // const { account, chainId } = useActiveWeb3React()
  // const dispatch = useAppDispatch()

  const onDone = () => console.info('onDone')
  // const onDone = useCallback(
  //   () => dispatch(fetchFarmUserDataAsync({ account, pids: [props.pid], chainId })),
  //   [account, dispatch, chainId, props.pid],
  // )

  return children({ ...props, onDone, onReward })
}

// export const HarvestAction: React.FunctionComponent<React.PropsWithChildren<HarvestActionProps>> = ({
export const HarvestAction: React.FunctionComponent<React.PropsWithChildren<any>> = ({
  pid,
  token,
  quoteToken,
  vaultPid,
  userData,
  userDataReady,
  lpSymbol,
  onReward,
  onDone,
}) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  // const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  // const earningsBigNumber = new BigNumber(userData.earnings)
  const earningsBigNumber = BIG_ZERO
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
    if (true) {
      // toastSuccess(
      //   `${t('Harvested')}!`,
      //   <ToastDescriptionWithTx txHash={receipt.transactionHash}>
      //     {t('Your %symbol% earnings have been sent to your wallet!', { symbol: 'CAKE' })}
      //   </ToastDescriptionWithTx>,
      // )
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
