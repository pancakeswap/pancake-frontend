import { useTranslation } from '@pancakeswap/localization'
import { AddIcon, Button, Flex, IconButton, MinusIcon, useModal, useToast, Farm as FarmUI } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { ToastDescriptionWithTx } from 'components/Toast'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCakePriceAsBigNumber } from 'hooks/useStablePrice'
import { DeserializedFarmUserData } from '@pancakeswap/farms'
import { TransactionResponse } from '@pancakeswap/awgmi/core'
import useCatchTxError from 'hooks/useCatchTxError'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
// import { useLpTokenPrice } from 'state/farms/hooks'
import { FarmWithStakedValue } from '../types'

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
  onDone?: () => void
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
  onStake,
  onUnstake,
  onDone,
}) => {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError } = useCatchTxError()
  const { tokenBalance, stakedBalance } = userData as DeserializedFarmUserData
  const cakePrice = useCakePriceAsBigNumber()
  const router = useRouter()
  const lpPrice = BIG_ZERO
  // const lpPrice = useLpTokenPrice(lpSymbol)

  const handleStake = async (amount: string) => {
    const receipt = await fetchWithCatchTxError(() => onStake(amount))
    if (receipt?.status) {
      toastSuccess(
        `${t('Staked')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your funds have been staked in the farm')}
        </ToastDescriptionWithTx>,
      )
      onDone?.()
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
      onDone?.()
    }
  }

  const [onPresentDeposit] = useModal(
    <FarmUI.DepositModal
      account={account || ''}
      pid={pid}
      lpTotalSupply={lpTotalSupply}
      max={tokenBalance}
      stakedBalance={stakedBalance}
      onConfirm={handleStake}
      tokenName={lpSymbol}
      multiplier={multiplier}
      lpPrice={lpPrice}
      lpLabel={lpLabel}
      apr={apr}
      displayApr={displayApr}
      addLiquidityUrl={addLiquidityUrl}
      cakePrice={cakePrice}
    />,
  )

  const [onPresentWithdraw] = useModal(
    <FarmUI.WithdrawModal max={stakedBalance} onConfirm={handleUnstake} tokenName={lpSymbol} />,
  )

  const renderStakingButtons = () => {
    return stakedBalance.eq(0) ? (
      <Button
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
    <Flex justifyContent="space-between" alignItems="center">
      <FarmUI.StakedLP
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
