import { useBalance } from '@pancakeswap/awgmi'
import { TransactionResponse } from '@pancakeswap/awgmi/core'
import type { DeserializedFarmUserData } from '@pancakeswap/farms'
import { FarmWithStakedValue } from '@pancakeswap/farms'
import { useTranslation } from '@pancakeswap/localization'
import { useModal, useToast } from '@pancakeswap/uikit'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { FarmWidget } from '@pancakeswap/widgets-internal'
import BigNumber from 'bignumber.js'
import { ConnectWalletButton } from 'components/ConnectWalletButton'
import { FARM_DEFAULT_DECIMALS } from 'components/Farms/constants'
import { useCheckIsUserIpPass } from 'components/Farms/hooks/useCheckIsUserIpPass'
import { ToastDescriptionWithTx } from 'components/Toast'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useCatchTxError from 'hooks/useCatchTxError'
import { usePriceCakeUsdc } from 'hooks/useStablePrice'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { logGTMClickStakeFarmEvent, logGTMClickUnStakeFarmEvent } from 'utils/customGTMEventTracking'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import useStakeFarms from '../../../hooks/useStakeFarms'
import useUnstakeFarms from '../../../hooks/useUnstakeFarms'

interface StackedActionProps extends FarmWithStakedValue {
  userDataReady: boolean
  lpLabel?: string
  displayApr?: string
  farmCakePerSecond?: string
  totalMultipliers?: string
  onStake: (value: string) => Promise<TransactionResponse>
  onUnstake: (value: string) => Promise<TransactionResponse>
}

export function useStakedActions(tokenType) {
  const { onStake } = useStakeFarms(tokenType)
  const { onUnstake } = useUnstakeFarms(tokenType)

  return {
    onStake,
    onUnstake,
  }
}

export const StakedContainer = ({ children, ...props }) => {
  const { onStake, onUnstake } = useStakedActions(props.lpAddress)
  const { account } = useActiveWeb3React()
  const { data: tokenBalance = BIG_ZERO } = useBalance({
    watch: true,
    address: account,
    coin: props.lpAddress,
    select: (d) => new BigNumber(d.value),
  })

  const userData = useMemo(
    () => ({
      ...props.userData,
      tokenBalance,
    }),
    [props.userData, tokenBalance],
  )

  return children({
    ...props,
    userData,
    onStake,
    onUnstake,
  })
}

const Staked: React.FunctionComponent<React.PropsWithChildren<StackedActionProps>> = ({
  pid,
  apr,
  multiplier,
  lpSymbol,
  lpLabel,
  lpTokenPrice = BIG_ZERO,
  quoteToken,
  token,
  userDataReady,
  displayApr,
  lpTotalSupply = BIG_ZERO,
  tokenAmountTotal = BIG_ZERO,
  quoteTokenAmountTotal = BIG_ZERO,
  userData,
  dualTokenRewardApr,
  farmCakePerSecond,
  totalMultipliers,
  lpRewardsApr,
  onStake,
  onUnstake,
}) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError } = useCatchTxError()
  const { account } = useActiveWeb3React()
  const isUserIpPass = useCheckIsUserIpPass()

  const { stakedBalance, tokenBalance } = (userData as DeserializedFarmUserData) || {}

  const router = useRouter()
  const cakePrice = usePriceCakeUsdc()

  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: quoteToken?.address,
    tokenAddress: token?.address,
  })
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`

  const isStakeReady = useMemo(() => {
    return ['history', 'archived'].some((item) => router.pathname.includes(item))
  }, [router])

  const handleStake = async (amount: string) => {
    const receipt = await fetchWithCatchTxError(() => onStake(amount))
    if (receipt?.status) {
      toastSuccess(
        `${t('Staked')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your funds have been staked in the farm')}
        </ToastDescriptionWithTx>,
      )
    }
    logGTMClickStakeFarmEvent()
  }

  const handleUnstake = async (amount: string) => {
    const receipt = await fetchWithCatchTxError(() => onUnstake(amount))
    if (receipt?.status) {
      toastSuccess(
        `${t('Unstaked')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your earnings have also been harvested to your wallet')}
        </ToastDescriptionWithTx>,
      )
    }
    logGTMClickUnStakeFarmEvent()
  }

  const combineApr = useMemo(() => {
    let total = new BigNumber(apr ?? 0).plus(lpRewardsApr ?? 0)
    if (dualTokenRewardApr) {
      total = new BigNumber(apr ?? 0).plus(lpRewardsApr ?? 0).plus(dualTokenRewardApr)
    }

    return total.toNumber()
  }, [apr, dualTokenRewardApr, lpRewardsApr])

  const [onPresentDeposit] = useModal(
    <FarmWidget.DepositModal
      account={account || ''}
      pid={pid}
      lpTotalSupply={lpTotalSupply}
      max={tokenBalance}
      lpPrice={lpTokenPrice}
      lpLabel={lpLabel}
      apr={combineApr}
      lpRewardsApr={lpRewardsApr}
      displayApr={displayApr}
      stakedBalance={stakedBalance}
      onConfirm={handleStake}
      tokenName={lpSymbol}
      multiplier={multiplier}
      addLiquidityUrl={addLiquidityUrl}
      cakePrice={cakePrice}
      decimals={FARM_DEFAULT_DECIMALS}
      dualTokenRewardApr={dualTokenRewardApr}
      farmCakePerSecond={farmCakePerSecond}
      totalMultipliers={totalMultipliers}
      rewardCakePerSecond
      showTopMessageText={
        isUserIpPass
          ? null
          : t(
              'The CAKE and APT Farm rewards for this pool will not be applicable to or claimable by U.S.-based and VPN users.',
            )
      }
    />,
  )

  const [onPresentWithdraw] = useModal(
    <FarmWidget.WithdrawModal
      max={stakedBalance}
      lpPrice={lpTokenPrice}
      onConfirm={handleUnstake}
      tokenName={lpSymbol}
      decimals={FARM_DEFAULT_DECIMALS}
    />,
  )

  if (!account) {
    return (
      <FarmWidget.FarmTable.AccountNotConnect>
        <ConnectWalletButton width="100%" />
      </FarmWidget.FarmTable.AccountNotConnect>
    )
  }

  if (!userDataReady) {
    return <FarmWidget.FarmTable.StakeActionDataNotReady />
  }

  if (stakedBalance.gt(0)) {
    return (
      <FarmWidget.FarmTable.StakedActionComponent
        lpSymbol={lpSymbol}
        disabledPlusButton={isStakeReady}
        onPresentWithdraw={onPresentWithdraw}
        onPresentDeposit={onPresentDeposit}
      >
        <FarmWidget.StakedLP
          decimals={FARM_DEFAULT_DECIMALS}
          stakedBalance={stakedBalance}
          quoteTokenSymbol={quoteToken.symbol}
          tokenSymbol={token.symbol}
          lpTotalSupply={lpTotalSupply}
          lpTokenPrice={lpTokenPrice}
          tokenAmountTotal={tokenAmountTotal}
          quoteTokenAmountTotal={quoteTokenAmountTotal}
        />
      </FarmWidget.FarmTable.StakedActionComponent>
    )
  }

  return (
    <FarmWidget.FarmTable.StakeComponent
      lpSymbol={lpSymbol}
      isStakeReady={isStakeReady}
      onPresentDeposit={onPresentDeposit}
    />
  )
}

export default Staked
