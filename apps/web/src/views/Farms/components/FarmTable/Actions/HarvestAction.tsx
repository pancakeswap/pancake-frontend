import { TransactionResponse } from '@ethersproject/providers'
import { useTranslation } from '@pancakeswap/localization'
import { Skeleton, useToast, useModal, Farm as FarmUI } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCatchTxError from 'hooks/useCatchTxError'
import { useERC20 } from 'hooks/useContract'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/farms'

import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCallback } from 'react'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import MultiChainHarvestModal from 'views/Farms/components/MultiChainHarvestModal'
import { FarmWithStakedValue } from '@pancakeswap/farms'
import useHarvestFarm from '../../../hooks/useHarvestFarm'
import useProxyStakedActions from '../../YieldBooster/hooks/useProxyStakedActions'

const { FarmTableHarvestAction } = FarmUI.FarmTable

interface HarvestActionProps extends FarmWithStakedValue {
  userDataReady: boolean
  onReward?: () => Promise<TransactionResponse>
  proxyCakeBalance?: number
  onDone?: () => void
}

export const ProxyHarvestActionContainer = ({ children, ...props }) => {
  const { lpAddress } = props
  const lpContract = useERC20(lpAddress)

  const { onReward, onDone, proxyCakeBalance } = useProxyStakedActions(props.pid, lpContract)

  return children({ ...props, onReward, proxyCakeBalance, onDone })
}

export const HarvestActionContainer = ({ children, ...props }) => {
  const { onReward } = useHarvestFarm(props.pid)
  const { account, chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()

  const onDone = useCallback(
    () => dispatch(fetchFarmUserDataAsync({ account, pids: [props.pid], chainId })),
    [account, dispatch, chainId, props.pid],
  )

  return children({ ...props, onDone, onReward })
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
}) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const earningsBigNumber = new BigNumber(userData.earnings)
  const cakePrice = usePriceCakeBusd()
  let earnings = BIG_ZERO
  let earningsBusd = 0
  let displayBalance = userDataReady ? earnings.toFixed(5, BigNumber.ROUND_DOWN) : <Skeleton width={60} />

  // If user didn't connect wallet default balance will be 0
  if (!earningsBigNumber.isZero()) {
    earnings = getBalanceAmount(earningsBigNumber)
    earningsBusd = earnings.multipliedBy(cakePrice).toNumber()
    displayBalance = earnings.toFixed(5, BigNumber.ROUND_DOWN)
  }

  const onClickHarvestButton = () => {
    if (vaultPid) {
      onPresentNonBscHarvestModal()
    } else {
      handleHarvest()
    }
  }

  const handleHarvest = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return onReward()
    })
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

  const [onPresentNonBscHarvestModal] = useModal(
    <MultiChainHarvestModal
      pid={pid}
      token={token}
      lpSymbol={lpSymbol}
      quoteToken={quoteToken}
      earningsBigNumber={earningsBigNumber}
      earningsBusd={earningsBusd}
    />,
  )

  return (
    <FarmTableHarvestAction
      earnings={earnings}
      earningsBusd={earningsBusd}
      displayBalance={displayBalance}
      pendingTx={pendingTx}
      userDataReady={userDataReady}
      proxyCakeBalance={proxyCakeBalance}
      handleHarvest={onClickHarvestButton}
    />
  )
}

export default HarvestAction
