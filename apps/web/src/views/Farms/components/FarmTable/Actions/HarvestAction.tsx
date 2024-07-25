import { useTranslation } from '@pancakeswap/localization'
import { Skeleton, useModal, useToast } from '@pancakeswap/uikit'
import { FarmWidget } from '@pancakeswap/widgets-internal'
import BigNumber from 'bignumber.js'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCatchTxError from 'hooks/useCatchTxError'
import { useERC20 } from 'hooks/useContract'
import { useAppDispatch } from 'state'
import { fetchBCakeWrapperUserDataAsync, fetchFarmUserDataAsync } from 'state/farms'

import { FarmWithStakedValue } from '@pancakeswap/farms'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useCakePrice } from 'hooks/useCakePrice'
import { useCallback, useMemo } from 'react'
import MultiChainHarvestModal from 'views/Farms/components/MultiChainHarvestModal'
import useHarvestFarm, { useBCakeHarvestFarm } from '../../../hooks/useHarvestFarm'
import useProxyStakedActions from '../../YieldBooster/hooks/useProxyStakedActions'

const { FarmTableHarvestAction } = FarmWidget.FarmTable

interface HarvestActionProps extends FarmWithStakedValue {
  userDataReady: boolean
  onReward?: <TResult>() => Promise<TResult>
  proxyCakeBalance?: number
  onDone?: () => void
  style?: React.CSSProperties
}

export const ProxyHarvestActionContainer = ({ children, ...props }) => {
  const { lpAddress } = props
  const lpContract = useERC20(lpAddress)

  const { onReward, onDone, proxyCakeBalance } = useProxyStakedActions(props.pid, lpContract)

  return children({ ...props, onReward, proxyCakeBalance, onDone })
}

export const HarvestActionContainer = ({ children, ...props }) => {
  const { onReward } = useHarvestFarm(props.pid)
  const { onReward: onRewardBCake } = useBCakeHarvestFarm(props.bCakeWrapperAddress ?? '0x')
  const isBooster = Boolean(props.bCakeWrapperAddress)
  const { account, chainId } = useAccountActiveChain()
  const dispatch = useAppDispatch()

  const onDone = useCallback(() => {
    if (account && chainId) {
      dispatch(fetchFarmUserDataAsync({ account, pids: [props.pid], chainId }))
    }
  }, [account, dispatch, chainId, props.pid])
  const onBCakeDone = useCallback(() => {
    if (account && chainId) {
      dispatch(fetchBCakeWrapperUserDataAsync({ account, pids: [props.pid], chainId }))
    }
  }, [account, dispatch, chainId, props.pid])

  return children({
    ...props,
    onDone: isBooster ? onBCakeDone : onDone,
    onReward: isBooster ? onRewardBCake : onReward,
  })
}

export const HarvestAction: React.FunctionComponent<React.PropsWithChildren<HarvestActionProps>> = ({
  pid,
  token,
  quoteToken,
  vaultPid,
  userData,
  userDataReady,
  proxyCakeBalance,
  lpSymbol,
  onReward,
  onDone,
  bCakeUserData,
  bCakeWrapperAddress,
  style,
}) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const cakePrice = useCakePrice()

  const earningsBigNumber = useMemo(
    () => (bCakeWrapperAddress ? new BigNumber(bCakeUserData?.earnings ?? 0) : new BigNumber(userData?.earnings ?? 0)),
    [bCakeWrapperAddress, bCakeUserData, userData],
  )

  const earnings = useMemo(
    () => (!earningsBigNumber.isZero() ? getBalanceAmount(earningsBigNumber) : BIG_ZERO),
    [earningsBigNumber],
  )

  const earningsBusd = useMemo(() => earnings.multipliedBy(cakePrice).toNumber(), [earnings, cakePrice])

  const displayBalance = useMemo(
    () => (userDataReady ? earnings.toFixed(5, BigNumber.ROUND_DOWN) : <Skeleton width={60} />),
    [userDataReady, earnings],
  )

  const handleHarvest = useCallback(async () => {
    const receipt = await fetchWithCatchTxError((): any => onReward?.())
    if (receipt?.status) {
      toastSuccess(
        `${t('Harvested')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your %symbol% earnings have been sent to your wallet!', { symbol: 'CAKE' })}
        </ToastDescriptionWithTx>,
      )
      onDone?.()
    }
  }, [onReward, t, toastSuccess, onDone, fetchWithCatchTxError])

  const [onPresentCrossChainHarvestModal] = useModal(
    <MultiChainHarvestModal
      pid={pid}
      token={token}
      lpSymbol={lpSymbol}
      quoteToken={quoteToken}
      earningsBigNumber={earningsBigNumber}
      earningsBusd={earningsBusd}
    />,
  )

  const onClickHarvestButton = useCallback(() => {
    if (vaultPid) {
      onPresentCrossChainHarvestModal()
    } else {
      handleHarvest()
    }
  }, [vaultPid, onPresentCrossChainHarvestModal, handleHarvest])

  return (
    <FarmTableHarvestAction
      earnings={earnings}
      earningsBusd={earningsBusd}
      displayBalance={displayBalance}
      pendingTx={pendingTx}
      userDataReady={userDataReady}
      proxyCakeBalance={proxyCakeBalance}
      disabled={earnings.eq(0) || pendingTx || !userDataReady}
      handleHarvest={onClickHarvestButton}
      style={style}
    />
  )
}

export default HarvestAction
