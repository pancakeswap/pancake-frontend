import { useTranslation } from '@pancakeswap/localization'
import { useLatestTxReceipt } from 'state/farmsV4/state/accountPositions/hooks/useLatestTxReceipt'
import { AutoRow, useModal, useToast } from '@pancakeswap/uikit'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { FarmWidget } from '@pancakeswap/widgets-internal'
import BigNumber from 'bignumber.js'
import { ToastDescriptionWithTx } from 'components/Toast'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useCakePrice } from 'hooks/useCakePrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTokenAllowanceByChainId } from 'hooks/useTokenAllowance'
import React, { useCallback, useMemo } from 'react'
import { getBCakeWrapperAddress } from 'state/farmsV4/state/accountPositions/fetcher'
import { useAccountV2PendingCakeReward } from 'state/farmsV4/state/accountPositions/hooks/useAccountV2PendingCakeReward'
import { StableLPDetail, V2LPDetail } from 'state/farmsV4/state/accountPositions/type'
import { getUniversalBCakeWrapperForPool } from 'state/farmsV4/state/poolApr/fetcher'
import { Address } from 'viem'
import { useIsFarmLive } from 'views/universalFarms/hooks/useIsFarmLive'
import { useCheckShouldSwitchNetwork } from 'views/universalFarms/hooks'
import { useV2FarmActions } from 'views/universalFarms/hooks/useV2FarmActions'
import { DepositStakeAction, HarvestAction, ModifyStakeActions } from './StakeActions'

type V2PositionActionsProps = {
  data: V2LPDetail | StableLPDetail
  chainId: number
  lpAddress: Address
  pid: number
  isStaked?: boolean
  tvlUsd?: `${number}` | number | undefined
}
export const V2PositionActions: React.FC<V2PositionActionsProps> = ({ isStaked, ...props }) => {
  if (isStaked) {
    return (
      <AutoRow gap="sm">
        <V2FarmingAction {...props} />
        <V2HarvestAction {...props} />
      </AutoRow>
    )
  }
  return <V2NativeAction {...props} />
}

const useDepositModal = (props: V2PositionActionsProps) => {
  const { chainId, data, pid, lpAddress, tvlUsd } = props
  const { account } = useAccountActiveChain()
  const cakePrice = useCakePrice()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError } = useCatchTxError()
  const { t } = useTranslation()

  const bCakeAddress = getBCakeWrapperAddress(lpAddress, chainId)
  const { allowance } = useTokenAllowanceByChainId({
    chainId,
    token: data.pair.liquidityToken,
    owner: account,
    spender: bCakeAddress,
  })

  const totalSupply = useMemo(() => {
    return new BigNumber(data.totalSupply.quotient.toString())
  }, [data.totalSupply])
  const nativeBalance = useMemo(() => {
    return new BigNumber(data.nativeBalance.quotient.toString())
  }, [data.nativeBalance])
  const stakedBalance = useMemo(() => {
    return new BigNumber(data.farmingBalance.quotient.toString())
  }, [data.farmingBalance])
  const { onStake, onApprove } = useV2FarmActions(lpAddress, chainId)
  const lpSymbol = useMemo(() => {
    return `${data.pair.token0.symbol}-${data.pair.token1.symbol} LP`
  }, [data.pair.token0.symbol, data.pair.token1.symbol])
  const lpTokenPrice = useMemo(() => {
    return new BigNumber(tvlUsd ?? 0).dividedBy(data.totalSupply.toExact())
  }, [data.totalSupply, tvlUsd])

  const [, setLatestTxReceipt] = useLatestTxReceipt()

  const handleStake = useCallback(
    async (amount: string) => {
      const receipt = await fetchWithCatchTxError(() => {
        return onStake(amount)
      })
      if (receipt?.status) {
        setLatestTxReceipt(receipt)
        toastSuccess(
          `${t('Staked')}!`,
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('Your funds have been staked in the farm')}
          </ToastDescriptionWithTx>,
        )
      }
    },
    [setLatestTxReceipt, fetchWithCatchTxError, onStake, t, toastSuccess],
  )

  const handleApprove = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return onApprove()
    })
    if (receipt?.status) {
      setLatestTxReceipt(receipt)
      toastSuccess(t('Contract Enabled'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
    }
  }, [setLatestTxReceipt, fetchWithCatchTxError, onApprove, t, toastSuccess])

  const [onPresentDeposit] = useModal(
    <FarmWidget.DepositModal
      account={account}
      pid={pid}
      lpTotalSupply={totalSupply}
      tokenName={lpSymbol}
      max={nativeBalance}
      stakedBalance={stakedBalance}
      decimals={18}
      cakePrice={cakePrice}
      allowance={allowance ? new BigNumber(allowance.quotient.toString()) : BIG_ZERO}
      onConfirm={handleStake}
      handleApprove={handleApprove}
      lpPrice={lpTokenPrice}
    />,
    true,
    true,
    `farm-deposit-modal-${pid}-${lpAddress}`,
  )

  return onPresentDeposit
}

const useWithdrawModal = (
  data: V2LPDetail | StableLPDetail,
  lpAddress: Address,
  chainId: number,
  _pid: number,
  tvlUsd?: `${number}` | number | undefined,
) => {
  const { t } = useTranslation()
  const { onUnStake } = useV2FarmActions(lpAddress, chainId)
  const lpSymbol = useMemo(() => {
    return `${data.pair.token0.symbol}-${data.pair.token1.symbol} LP`
  }, [data.pair.token0.symbol, data.pair.token1.symbol])
  const lpTokenPrice = useMemo(() => {
    return new BigNumber(tvlUsd ?? 0).dividedBy(data.totalSupply.toExact())
  }, [data.totalSupply, tvlUsd])
  const stakedBalance = useMemo(() => {
    return new BigNumber(data.farmingBalance.quotient.toString())
  }, [data.farmingBalance])
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError } = useCatchTxError()
  const [, setLatestTxReceipt] = useLatestTxReceipt()
  const handleUnstake = useCallback(
    async (amount: string) => {
      const receipt = await fetchWithCatchTxError(() => onUnStake(amount))
      if (receipt?.status) {
        setLatestTxReceipt(receipt)
        toastSuccess(
          `${t('Unstaked')}!`,
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('Your earnings have also been harvested to your wallet')}
          </ToastDescriptionWithTx>,
        )
      }
    },
    [setLatestTxReceipt, fetchWithCatchTxError, onUnStake, t, toastSuccess],
  )
  const [onPresentWithdraw] = useModal(
    <FarmWidget.WithdrawModal
      max={stakedBalance ?? BIG_ZERO}
      onConfirm={handleUnstake}
      lpPrice={lpTokenPrice}
      tokenName={lpSymbol}
      decimals={18}
    />,
  )

  return onPresentWithdraw
}

const V2FarmingAction: React.FC<V2PositionActionsProps> = (props) => {
  const { data, chainId, lpAddress, pid, tvlUsd } = props
  const isFarmLive = useIsFarmLive({
    protocol: data.protocol,
    chainId,
    currency0: data.pair.token0,
    currency1: data.pair.token1,
  })
  const { switchNetworkIfNecessary } = useCheckShouldSwitchNetwork()
  const onPresentDeposit = useDepositModal(props)
  const onPresentWithdraw = useWithdrawModal(data, lpAddress, chainId, pid, tvlUsd)

  const handleIncrease = useCallback(async () => {
    const shouldSwitch = await switchNetworkIfNecessary(chainId)
    if (!shouldSwitch) {
      onPresentDeposit()
    }
  }, [chainId, onPresentDeposit, switchNetworkIfNecessary])

  const handleDecrease = useCallback(async () => {
    const shouldSwitch = await switchNetworkIfNecessary(chainId)
    if (!shouldSwitch) {
      onPresentWithdraw()
    }
  }, [chainId, onPresentWithdraw, switchNetworkIfNecessary])

  return <ModifyStakeActions increaseDisabled={!isFarmLive} onIncrease={handleIncrease} onDecrease={handleDecrease} />
}

const V2NativeAction: React.FC<V2PositionActionsProps> = (props) => {
  const { chainId } = props
  const { switchNetworkIfNecessary } = useCheckShouldSwitchNetwork()
  const onPresentDeposit = useDepositModal(props)
  const handleDeposit = useCallback(async () => {
    const shouldSwitch = await switchNetworkIfNecessary(chainId)
    if (!shouldSwitch) {
      onPresentDeposit()
    }
  }, [chainId, switchNetworkIfNecessary, onPresentDeposit])
  return <DepositStakeAction onDeposit={handleDeposit} />
}

const V2HarvestAction: React.FC<V2PositionActionsProps> = ({ chainId, lpAddress }) => {
  const { t } = useTranslation()
  const { onHarvest } = useV2FarmActions(lpAddress, chainId)
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { account } = useAccountActiveChain()
  const { switchNetworkIfNecessary } = useCheckShouldSwitchNetwork()
  const bCakeConfig = useMemo(() => {
    return getUniversalBCakeWrapperForPool({ chainId, lpAddress })
  }, [chainId, lpAddress])
  const { data: pendingReward_ } = useAccountV2PendingCakeReward(account, {
    chainId,
    lpAddress,
    bCakeWrapperAddress: bCakeConfig?.bCakeWrapperAddress,
  })
  const pendingReward = useMemo(() => {
    return new BigNumber(pendingReward_?.toString() ?? '0')
  }, [pendingReward_])
  const [, setLatestTxReceipt] = useLatestTxReceipt()
  const handleHarvest = useCallback(async () => {
    const shouldSwitch = await switchNetworkIfNecessary(chainId)
    if (shouldSwitch) {
      return
    }
    const receipt = await fetchWithCatchTxError(() => onHarvest())
    if (receipt?.status) {
      setLatestTxReceipt(receipt)
      toastSuccess(
        `${t('Harvested')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your %symbol% earnings have been sent to your wallet!', { symbol: 'CAKE' })}
        </ToastDescriptionWithTx>,
      )
    }
  }, [setLatestTxReceipt, chainId, switchNetworkIfNecessary, fetchWithCatchTxError, onHarvest, t, toastSuccess])

  if (!pendingReward || pendingReward.isZero()) {
    return null
  }

  return <HarvestAction onHarvest={handleHarvest} executing={pendingTx} disabled={pendingTx} />
}
