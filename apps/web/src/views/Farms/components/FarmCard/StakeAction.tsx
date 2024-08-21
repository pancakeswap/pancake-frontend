import { ChainId } from '@pancakeswap/chains'
import { FarmWithStakedValue } from '@pancakeswap/farms'
import { useTranslation } from '@pancakeswap/localization'
import { NATIVE, WNATIVE } from '@pancakeswap/sdk'
import { AddIcon, Button, Flex, IconButton, MinusIcon, useModal, useToast } from '@pancakeswap/uikit'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { formatLpBalance } from '@pancakeswap/utils/formatBalance'
import { FarmWidget } from '@pancakeswap/widgets-internal'
import BigNumber from 'bignumber.js'
import WalletModal, { WalletView } from 'components/Menu/UserMenu/WalletModal'
import { ToastDescriptionWithTx } from 'components/Toast'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useCakePrice } from 'hooks/useCakePrice'
import useCatchTxError from 'hooks/useCatchTxError'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useRouter } from 'next/router'
import { useCallback, useContext, useMemo } from 'react'
import { useAppDispatch } from 'state'
import { pickFarmTransactionTx } from 'state/global/actions'
import { CrossChainFarmStepType, FarmTransactionStatus } from 'state/transactions/actions'
import { useCrossChainFarmPendingTransaction, useTransactionAdder } from 'state/transactions/hooks'
import { styled } from 'styled-components'
import { useIsBloctoETH } from 'views/Farms'
import { useBCakeBoostLimitAndLockInfo } from 'views/Farms/components/YieldBooster/hooks/bCakeV3/useBCakeV3Info'
import { useFirstTimeCrossFarming } from '../../hooks/useFirstTimeCrossFarming'
import { YieldBoosterStateContext } from '../YieldBooster/components/ProxyFarmContainer'
import { YieldBoosterState } from '../YieldBooster/hooks/useYieldBoosterState'

interface FarmCardActionsProps extends FarmWithStakedValue {
  lpLabel?: string
  addLiquidityUrl?: string
  displayApr?: string
  onStake: <SendTransactionResult>(value: string) => Promise<SendTransactionResult>
  onUnstake: <SendTransactionResult>(value: string) => Promise<SendTransactionResult>
  onDone: () => void
  onApprove: <SendTransactionResult>() => Promise<SendTransactionResult>
  isApproved: boolean
}

const IconButtonWrapper = styled.div`
  display: flex;
  svg {
    width: 20px;
  }
`

const StakeAction: React.FC<React.PropsWithChildren<FarmCardActionsProps>> = ({
  pid,
  vaultPid,
  quoteToken,
  token,
  lpSymbol,
  lpTokenPrice,
  multiplier,
  apr,
  lpAddress,
  displayApr,
  addLiquidityUrl,
  lpLabel,
  lpTotalSupply,
  tokenAmountTotal,
  quoteTokenAmountTotal,
  userData,
  bCakeUserData,
  bCakePublicData,
  bCakeWrapperAddress,
  lpRewardsApr,
  onStake,
  onUnstake,
  onDone,
  onApprove,
  isApproved,
}) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const addTransaction = useTransactionAdder()
  const { account, chainId } = useAccountActiveChain()
  const native = useNativeCurrency()
  const isBooster = Boolean(bCakeWrapperAddress)
  const { tokenBalance, stakedBalance, allowance } = (isBooster ? bCakeUserData : userData) || {}
  const cakePrice = useCakePrice()
  const router = useRouter()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, fetchTxResponse, loading: pendingTx } = useCatchTxError()
  const { boosterState } = useContext(YieldBoosterStateContext)
  const pendingFarm = useCrossChainFarmPendingTransaction(lpAddress)
  const { isFirstTime, refresh: refreshFirstTime } = useFirstTimeCrossFarming(vaultPid)
  const isBloctoETH = useIsBloctoETH()
  const isBoosterAndRewardInRange = isBooster && bCakePublicData?.isRewardInRange
  const { locked } = useBCakeBoostLimitAndLockInfo()

  const crossChainWarningText = useMemo(() => {
    return isFirstTime
      ? t('A small amount of %nativeToken% is required for the first-time setup of cross-chain CAKE farming.', {
          nativeToken: native.symbol,
        })
      : t('For safety, cross-chain transactions will take around 30 minutes to confirm.')
  }, [isFirstTime, native, t])

  const isStakeReady = useMemo(() => {
    return ['history', 'archived'].some((item) => router.pathname.includes(item)) || pendingFarm.length > 0
  }, [pendingFarm, router])

  const handleStake = async (amount: string) => {
    if (vaultPid) {
      await handleCrossChainStake(amount)
      refreshFirstTime()
    } else {
      const receipt = await fetchWithCatchTxError(() => onStake(amount))
      if (receipt?.status) {
        toastSuccess(
          `${t('Staked')}!`,
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('Your funds have been staked in the farm')}
          </ToastDescriptionWithTx>,
        )
        onDone()
      }
    }
  }

  const handleCrossChainStake = async (amountValue: string) => {
    const receipt = await fetchTxResponse(() => onStake(amountValue))
    const amountAsBigNumber = new BigNumber(amountValue).times(DEFAULT_TOKEN_DECIMAL)
    const amount = formatLpBalance(new BigNumber(amountAsBigNumber), 18)

    if (receipt) {
      addTransaction(receipt, {
        type: 'cross-chain-farm',
        translatableSummary: {
          text: 'Stake %amount% %lpSymbol% Token',
          data: { amount, lpSymbol },
        },
        crossChainFarm: {
          type: CrossChainFarmStepType.STAKE,
          status: FarmTransactionStatus.PENDING,
          amount,
          lpSymbol,
          lpAddress,
          steps: [
            {
              step: 1,
              chainId: chainId!,
              tx: receipt.hash,
              isFirstTime,
              status: FarmTransactionStatus.PENDING,
            },
            {
              step: 2,
              tx: '',
              chainId: ChainId.BSC,
              status: FarmTransactionStatus.PENDING,
            },
          ],
        },
      })

      dispatch(pickFarmTransactionTx({ tx: receipt.hash, chainId: chainId! }))
      onDone()
    }
  }

  const handleUnstake = async (amount: string) => {
    if (vaultPid) {
      await handleCrossChainUnStake(amount)
    } else {
      const receipt = await fetchWithCatchTxError(() => onUnstake(amount))
      if (receipt?.status) {
        toastSuccess(
          `${t('Unstaked')}!`,
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('Your earnings have also been harvested to your wallet')}
          </ToastDescriptionWithTx>,
        )
        onDone()
      }
    }
  }

  const handleCrossChainUnStake = async (amountValue: string) => {
    const receipt = await fetchTxResponse(() => onUnstake(amountValue))
    const amountAsBigNumber = new BigNumber(amountValue).times(DEFAULT_TOKEN_DECIMAL)
    const amount = formatLpBalance(new BigNumber(amountAsBigNumber), 18)

    if (receipt) {
      addTransaction(receipt, {
        type: 'cross-chain-farm',
        translatableSummary: {
          text: 'Unstake %amount% %lpSymbol% Token',
          data: { amount, lpSymbol },
        },
        crossChainFarm: {
          type: CrossChainFarmStepType.UNSTAKE,
          status: FarmTransactionStatus.PENDING,
          amount,
          lpSymbol,
          lpAddress,
          steps: [
            {
              step: 1,
              chainId: chainId!,
              tx: receipt.hash,
              status: FarmTransactionStatus.PENDING,
            },
            {
              step: 2,
              chainId: ChainId.BSC,
              tx: '',
              status: FarmTransactionStatus.PENDING,
            },
            {
              step: 3,
              chainId: chainId!,
              tx: '',
              status: FarmTransactionStatus.PENDING,
            },
          ],
        },
      })

      dispatch(pickFarmTransactionTx({ tx: receipt.hash, chainId: chainId! }))
      onDone()
    }
  }

  const handleApprove = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return onApprove()
    })
    if (receipt?.status) {
      toastSuccess(t('Contract Enabled'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      onDone()
    }
  }, [onApprove, t, toastSuccess, fetchWithCatchTxError, onDone])

  // const bCakeCalculatorSlot = (calculatorBalance) => (
  //   <BCakeCalculator
  //     targetInputBalance={calculatorBalance}
  //     earningTokenPrice={cakePrice.toNumber()}
  //     lpTokenStakedAmount={lpTokenStakedAmount ?? BIG_ZERO}
  //     setBCakeMultiplier={setBCakeMultiplier}
  //   />
  // )

  const [onPresentDeposit] = useModal(
    <FarmWidget.DepositModal
      account={account}
      pid={pid}
      lpTotalSupply={lpTotalSupply ?? BIG_ZERO}
      max={tokenBalance ?? BIG_ZERO}
      stakedBalance={stakedBalance ?? BIG_ZERO}
      tokenName={lpSymbol}
      multiplier={multiplier}
      lpPrice={lpTokenPrice}
      lpLabel={lpLabel}
      apr={apr}
      displayApr={displayApr}
      addLiquidityUrl={addLiquidityUrl}
      cakePrice={cakePrice}
      showActiveBooster={boosterState === YieldBoosterState.ACTIVE}
      bCakeMultiplier={null}
      showCrossChainFarmWarning={chainId !== ChainId.BSC && chainId !== ChainId.BSC_TESTNET && !bCakeWrapperAddress}
      crossChainWarningText={crossChainWarningText}
      decimals={18}
      allowance={allowance}
      enablePendingTx={pendingTx}
      lpRewardsApr={lpRewardsApr}
      onConfirm={handleStake}
      handleApprove={handleApprove}
      isBooster={isBoosterAndRewardInRange}
      boosterMultiplier={
        isBoosterAndRewardInRange
          ? bCakeUserData?.boosterMultiplier === 0 || bCakeUserData?.stakedBalance.eq(0) || !locked
            ? 2.5
            : bCakeUserData?.boosterMultiplier
          : 1
      }
      // bCakeCalculatorSlot={bCakeCalculatorSlot}
    />,
    true,
    true,
    `farm-deposit-modal-${pid}`,
  )

  const [onPresentWithdraw] = useModal(
    <FarmWidget.WithdrawModal
      showActiveBooster={boosterState === YieldBoosterState.ACTIVE}
      max={stakedBalance ?? BIG_ZERO}
      onConfirm={handleUnstake}
      lpPrice={lpTokenPrice}
      tokenName={lpSymbol}
      showCrossChainFarmWarning={chainId !== ChainId.BSC && chainId !== ChainId.BSC_TESTNET && !bCakeWrapperAddress}
      decimals={18}
    />,
  )

  const renderStakingButtons = () => {
    return stakedBalance?.eq(0) ? (
      <Button onClick={onPresentDeposit} disabled={isStakeReady}>
        {t('Stake LP')}
      </Button>
    ) : (
      <IconButtonWrapper>
        <IconButton mr="6px" variant="secondary" disabled={pendingFarm.length > 0} onClick={onPresentWithdraw}>
          <MinusIcon color="primary" width="14px" />
        </IconButton>
        <IconButton variant="secondary" onClick={onPresentDeposit} disabled={isStakeReady || isBloctoETH}>
          <AddIcon color="primary" width="14px" />
        </IconButton>
      </IconButtonWrapper>
    )
  }

  const [onPresentTransactionModal] = useModal(<WalletModal initialView={WalletView.TRANSACTIONS} />)

  const onClickLoadingIcon = () => {
    const { length } = pendingFarm
    if (length) {
      if (length > 1) {
        onPresentTransactionModal()
      } else if (pendingFarm[0].txid) {
        dispatch(pickFarmTransactionTx({ tx: pendingFarm[0].txid, chainId: chainId! }))
      }
    }
  }

  // TODO: Move this out to prevent unnecessary re-rendered
  if (!isApproved && stakedBalance?.eq(0)) {
    return (
      <Button mt="8px" width="100%" disabled={pendingTx || isBloctoETH} onClick={handleApprove}>
        {t('Enable Contract')}
      </Button>
    )
  }

  return (
    <Flex justifyContent="space-between" width="100%" alignItems="center">
      <FarmWidget.StakedLP
        decimals={18}
        stakedBalance={stakedBalance ?? BIG_ZERO}
        quoteTokenSymbol={
          chainId && WNATIVE[chainId]?.symbol === quoteToken.symbol ? NATIVE[chainId]?.symbol : quoteToken.symbol
        }
        tokenSymbol={chainId && WNATIVE[chainId]?.symbol === token.symbol ? NATIVE[chainId]?.symbol : token.symbol}
        lpTotalSupply={lpTotalSupply ?? BIG_ZERO}
        lpTokenPrice={lpTokenPrice ?? BIG_ZERO}
        tokenAmountTotal={tokenAmountTotal ?? BIG_ZERO}
        quoteTokenAmountTotal={quoteTokenAmountTotal ?? BIG_ZERO}
        pendingFarmLength={pendingFarm.length}
        onClickLoadingIcon={onClickLoadingIcon}
      />
      {renderStakingButtons()}
    </Flex>
  )
}

export default StakeAction
