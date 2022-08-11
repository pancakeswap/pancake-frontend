import React, { useCallback } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from '@pancakeswap/localization'
import { Button, useModal, IconButton, AddIcon, MinusIcon, useMatchBreakpointsContext } from '@pancakeswap/uikit'
import { FarmWithStakedValue } from 'views/Farms/components/types'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useERC20 } from 'hooks/useContract'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import useToast from 'hooks/useToast'
import useCatchTxError from 'hooks/useCatchTxError'
import { getAddress } from 'utils/addressHelpers'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { useFarmUser, useLpTokenPrice, usePriceCakeBusd } from 'state/farms/hooks'
import useApproveFarm from 'views/Farms/hooks/useApproveFarm'
import useStakeFarms from 'views/Farms/hooks/useStakeFarms'
import useUnstakeFarms from 'views/Farms/hooks/useUnstakeFarms'
import DepositModal from 'views/Farms/components/DepositModal'
import WithdrawModal from 'views/Farms/components/WithdrawModal'
import { fetchFarmUserDataAsync } from 'state/farms'
import { useAppDispatch } from 'state'

const IconButtonWrapper = styled.div`
  display: flex;
`

interface StackedActionProps extends FarmWithStakedValue {
  lpLabel?: string
  displayApr?: string
}

const StakeButton: React.FC<React.PropsWithChildren<StackedActionProps>> = ({
  pid,
  apr,
  multiplier,
  lpSymbol,
  lpLabel,
  lpAddresses,
  quoteToken,
  token,
  displayApr,
}) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { isDesktop } = useMatchBreakpointsContext()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { allowance, tokenBalance, stakedBalance } = useFarmUser(pid)
  const { onStake } = useStakeFarms(pid)
  const { onUnstake } = useUnstakeFarms(pid)
  const lpPrice = useLpTokenPrice(lpSymbol)
  const cakePrice = usePriceCakeBusd()

  const isApproved = account && allowance && allowance.isGreaterThan(0)

  const lpAddress = getAddress(lpAddresses)
  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: quoteToken.address,
    tokenAddress: token.address,
  })
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`

  const handleStake = async (amount: string) => {
    const receipt = await fetchWithCatchTxError(() => {
      return onStake(amount)
    })
    if (receipt?.status) {
      toastSuccess(
        `${t('Staked')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your funds have been staked in the farm')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
    }
  }

  const handleUnstake = async (amount: string) => {
    const receipt = await fetchWithCatchTxError(() => {
      return onUnstake(amount)
    })
    if (receipt?.status) {
      toastSuccess(
        `${t('Unstaked')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your earnings have also been harvested to your wallet')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
    }
  }

  const [onPresentDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      lpPrice={lpPrice}
      lpLabel={lpLabel}
      apr={apr}
      displayApr={displayApr}
      stakedBalance={stakedBalance}
      onConfirm={handleStake}
      tokenName={lpSymbol}
      multiplier={multiplier}
      addLiquidityUrl={addLiquidityUrl}
      cakePrice={cakePrice}
    />,
  )
  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={stakedBalance} onConfirm={handleUnstake} tokenName={lpSymbol} />,
  )
  const lpContract = useERC20(lpAddress)
  const dispatch = useAppDispatch()
  const { onApprove } = useApproveFarm(lpContract)

  const handleApprove = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    handlePoolApprove()
  }

  const handlePoolApprove = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return onApprove()
    })
    if (receipt?.status) {
      toastSuccess(t('Contract Enabled'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
    }
  }, [onApprove, dispatch, account, pid, t, toastSuccess, fetchWithCatchTxError])

  const handleDeposit = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    onPresentDeposit()
  }

  const handleWithdraw = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    onPresentWithdraw()
  }

  if (isApproved) {
    if (stakedBalance.gt(0)) {
      return (
        <IconButtonWrapper>
          <IconButton variant="secondary" onClick={handleWithdraw} mr="6px">
            <MinusIcon color="primary" width="14px" />
          </IconButton>
          <IconButton variant="secondary" onClick={handleDeposit}>
            <AddIcon color="primary" width="14px" />
          </IconButton>
        </IconButtonWrapper>
      )
    }

    return (
      <Button width={isDesktop ? '142px' : '120px'} onClick={onPresentDeposit} marginLeft="auto">
        {t('Stake')}
      </Button>
    )
  }

  return (
    <Button
      disabled={pendingTx}
      onClick={handleApprove}
      variant="tertiary"
      marginLeft="auto"
      width={isDesktop ? '142px' : '120px'}
    >
      {t('Enable')}
    </Button>
  )
}

export default StakeButton
