import { TransactionResponse } from '@pancakeswap/awgmi/core'
import type { DeserializedFarmUserData } from '@pancakeswap/farms'
import { FarmWithStakedValue } from '@pancakeswap/farms'
import { useTranslation } from '@pancakeswap/localization'
import { AddIcon, Button, Flex, IconButton, MinusIcon, useModal, useToast } from '@pancakeswap/uikit'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { FarmWidget } from '@pancakeswap/widgets-internal'
import BigNumber from 'bignumber.js'
import { FARM_DEFAULT_DECIMALS } from 'components/Farms/constants'
import { useCheckIsUserIpPass } from 'components/Farms/hooks/useCheckIsUserIpPass'
import { ToastDescriptionWithTx } from 'components/Toast'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useCatchTxError from 'hooks/useCatchTxError'
import { usePriceCakeUsdc } from 'hooks/useStablePrice'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { styled } from 'styled-components'

const IconButtonWrapper = styled.div`
  display: flex;
  svg {
    width: 20px;
  }
`

interface FarmCardActionsProps extends FarmWithStakedValue {
  lpLabel?: string
  addLiquidityUrl?: string
  displayApr?: string
  onStake: (value: string) => Promise<TransactionResponse>
  onUnstake: (value: string) => Promise<TransactionResponse>
}

const StakeAction: React.FC<React.PropsWithChildren<FarmCardActionsProps>> = ({
  pid,
  quoteToken,
  token,
  lpSymbol,
  multiplier,
  apr,
  displayApr,
  addLiquidityUrl,
  lpLabel,
  lpTokenPrice = BIG_ZERO,
  lpTotalSupply = BIG_ZERO,
  tokenAmountTotal = BIG_ZERO,
  quoteTokenAmountTotal = BIG_ZERO,
  userData,
  dualTokenRewardApr,
  onStake,
  onUnstake,
}) => {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const isUserIpPass = useCheckIsUserIpPass()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError } = useCatchTxError()
  const { stakedBalance, tokenBalance } = (userData as DeserializedFarmUserData) || {}
  const cakePrice = usePriceCakeUsdc()
  const router = useRouter()

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
  }

  const totalApr = useMemo(() => {
    let finalApr = apr ?? 0
    if (dualTokenRewardApr) {
      finalApr = new BigNumber(dualTokenRewardApr).plus(apr ?? 0).toNumber() ?? 0
    }

    return finalApr
  }, [dualTokenRewardApr, apr])

  const [onPresentDeposit] = useModal(
    <FarmWidget.DepositModal
      account={account || ''}
      pid={pid}
      lpTotalSupply={lpTotalSupply}
      max={tokenBalance}
      stakedBalance={stakedBalance}
      onConfirm={handleStake}
      tokenName={lpSymbol}
      multiplier={multiplier}
      lpPrice={lpTokenPrice}
      lpLabel={lpLabel}
      apr={totalApr}
      displayApr={displayApr}
      addLiquidityUrl={addLiquidityUrl}
      cakePrice={cakePrice}
      decimals={FARM_DEFAULT_DECIMALS}
      dualTokenRewardApr={dualTokenRewardApr}
      showTopMessageText={
        isUserIpPass
          ? null
          : t('The CAKE and APT Farm rewards for this pool will not be applicable to or claimable by U.S.-based users.')
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

  const renderStakingButtons = () => {
    return stakedBalance.eq(0) ? (
      <Button
        mt="16px"
        onClick={onPresentDeposit}
        disabled={['history', 'archived'].some((item) => router.pathname.includes(item))}
      >
        {t('Stake LP')}
      </Button>
    ) : (
      <IconButtonWrapper>
        <IconButton variant="tertiary" onClick={onPresentWithdraw} mr="6px">
          <MinusIcon color="primary" width="14px" />
        </IconButton>
        <IconButton
          variant="tertiary"
          onClick={onPresentDeposit}
          disabled={['history', 'archived'].some((item) => router.pathname.includes(item))}
        >
          <AddIcon color="primary" width="14px" />
        </IconButton>
      </IconButtonWrapper>
    )
  }

  return (
    <Flex
      justifyContent="space-between"
      flexDirection={stakedBalance.eq(0) ? 'column' : 'row'}
      alignItems={stakedBalance.eq(0) ? 'none' : 'center'}
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
      {renderStakingButtons()}
    </Flex>
  )
}

export default StakeAction
