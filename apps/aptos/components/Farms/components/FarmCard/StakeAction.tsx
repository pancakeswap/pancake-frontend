import { useTranslation } from '@pancakeswap/localization'
import {
  AddIcon,
  Button,
  Flex,
  IconButton,
  MinusIcon,
  useModal,
  // useToast,
  // Farm as FarmUI
} from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useRouter } from 'next/router'
// import useActiveWeb3React from 'hooks/useActiveWeb3React'
// import { useLpTokenPrice, usePriceCakeBusd } from 'state/farms/hooks'
// import { FarmWithStakedValue } from '../types'

const IconButtonWrapper = styled.div`
  display: flex;
  svg {
    width: 20px;
  }
`

// interface FarmCardActionsProps extends FarmWithStakedValue {
//   lpLabel?: string
//   addLiquidityUrl?: string
//   displayApr?: string
//   onStake?: (value: string) => Promise<any>
//   onUnstake?: (value: string) => Promise<any>
//   onDone?: () => void
// }

const StakeAction: React.FC<React.PropsWithChildren<any>> = ({
  // pid,
  // quoteToken,
  // token,
  // lpSymbol,
  // multiplier,
  // apr,
  // displayApr,
  // addLiquidityUrl,
  // lpLabel,
  // lpTokenPrice,
  // lpTotalSupply,
  // tokenAmountTotal,
  // quoteTokenAmountTotal,
  userData,
  // onStake,
  // onUnstake,
  // onDone,
}) => {
  const { t } = useTranslation()
  // const { account } = useActiveWeb3React()
  const {
    // tokenBalance,
    stakedBalance,
  } = userData
  // const cakePrice = usePriceCakeBusd()
  const router = useRouter()
  // const lpPrice = useLpTokenPrice(lpSymbol)
  // const { toastSuccess } = useToast()

  // const handleStake = async (amount: string) => {
  // const receipt = await fetchWithCatchTxError(() => onStake(amount))
  // if (receipt?.status) {
  //   toastSuccess(
  //     `${t('Staked')}!`,
  //     <ToastDescriptionWithTx txHash={receipt.transactionHash}>
  //       {t('Your funds have been staked in the farm')}
  //     </ToastDescriptionWithTx>,
  //   )
  //   onDone()
  // }
  // }

  // const handleUnstake = async (amount: string) => {
  // const receipt = await fetchWithCatchTxError(() => onUnstake(amount))
  // if (receipt?.status) {
  //   toastSuccess(
  //     `${t('Unstaked')}!`,
  //     <ToastDescriptionWithTx txHash={receipt.transactionHash}>
  //       {t('Your earnings have also been harvested to your wallet')}
  //     </ToastDescriptionWithTx>,
  //   )
  //   onDone()
  // }
  // }

  const [onPresentDeposit] = useModal(
    // <FarmUI.DepositModal
    //   account={account}
    //   pid={pid}
    //   lpTotalSupply={lpTotalSupply}
    //   max={tokenBalance}
    //   stakedBalance={stakedBalance}
    //   onConfirm={handleStake}
    //   tokenName={lpSymbol}
    //   multiplier={multiplier}
    //   lpPrice={lpPrice}
    //   lpLabel={lpLabel}
    //   apr={apr}
    //   displayApr={displayApr}
    //   addLiquidityUrl={addLiquidityUrl}
    //   cakePrice={cakePrice}
    // />,
    null,
  )

  const [onPresentWithdraw] = useModal(
    // <FarmUI.WithdrawModal
    //   max={stakedBalance}
    //   onConfirm={handleUnstake}
    //   tokenName={lpSymbol}
    // />,
    null,
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
      {/* <FarmUI.StakedLP
        stakedBalance={stakedBalance}
        quoteTokenSymbol={quoteToken.symbol}
        tokenSymbol={token.symbol}
        lpTotalSupply={lpTotalSupply}
        lpTokenPrice={lpTokenPrice}
        tokenAmountTotal={tokenAmountTotal}
        quoteTokenAmountTotal={quoteTokenAmountTotal}
      /> */}
      {renderStakingButtons()}
    </Flex>
  )
}

export default StakeAction
