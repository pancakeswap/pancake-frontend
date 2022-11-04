import { useAccountBalance } from '@pancakeswap/awgmi'
import { TransactionResponse } from '@pancakeswap/awgmi/core'
import type { DeserializedFarmUserData } from '@pancakeswap/farms'
import { useTranslation } from '@pancakeswap/localization'
import { AddIcon, Farm as FarmUI, IconButton, MinusIcon, Skeleton, Text, useModal, useToast } from '@pancakeswap/uikit'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { ConnectWalletButton } from 'components/ConnectWalletButton'
import { ToastDescriptionWithTx } from 'components/Toast'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCakePriceAsBigNumber } from 'hooks/useStablePrice'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useFarmUserInfoCache } from 'state/farms/hook'
import styled from 'styled-components'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import useStakeFarms from '../../../hooks/useStakeFarms'
import useUnstakeFarms from '../../../hooks/useUnstakeFarms'
import { FarmWithStakedValue } from '../../types'
import { ActionContainer, ActionContent, ActionTitles } from './styles'

const IconButtonWrapper = styled.div`
  display: flex;
`

const StyledActionContainer = styled(ActionContainer)`
  &:nth-child(3) {
    flex-basis: 100%;
  }
  min-height: 124.5px;
  ${({ theme }) => theme.mediaQueries.sm} {
    &:nth-child(3) {
      margin-top: 16px;
    }
  }
`

interface StackedActionProps extends FarmWithStakedValue {
  userDataReady: boolean
  lpLabel?: string
  displayApr?: string
  onStake: (value: string) => Promise<TransactionResponse>
  onUnstake: (value: string) => Promise<TransactionResponse>
}

export function useStakedActions(pid, tokenType) {
  const { onStake } = useStakeFarms(pid, tokenType)
  const { onUnstake } = useUnstakeFarms(pid, tokenType)

  return {
    onStake,
    onUnstake,
  }
}

export const StakedContainer = ({ children, ...props }) => {
  const { onStake, onUnstake } = useStakedActions(props.pid, props.lpAddress)
  const { account } = useActiveWeb3React()
  const { data: tokenBalance = BIG_ZERO } = useAccountBalance({
    watch: true,
    address: account,
    coin: props.lpAddress,
    select: (d) => new BigNumber(d.value),
  })
  const { data: userInfo } = useFarmUserInfoCache(String(props.pid))

  const userData = useMemo(() => {
    return {
      stakedBalance: userInfo?.amount ? new BigNumber(userInfo.amount) : BIG_ZERO,
      tokenBalance,
    }
  }, [tokenBalance, userInfo?.amount])

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
  onStake,
  onUnstake,
}) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError } = useCatchTxError()
  const { account } = useActiveWeb3React()

  const { stakedBalance, tokenBalance } = (userData as DeserializedFarmUserData) || {}

  const router = useRouter()
  const cakePrice = useCakePriceAsBigNumber()

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

  const [onPresentDeposit] = useModal(
    <FarmUI.DepositModal
      account={account || ''}
      pid={pid}
      lpTotalSupply={lpTotalSupply}
      max={tokenBalance}
      lpPrice={lpTokenPrice}
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
    <FarmUI.WithdrawModal max={stakedBalance} onConfirm={handleUnstake} tokenName={lpSymbol} decimals={8} />,
  )

  if (!account) {
    return (
      <FarmUI.FarmTable.AccountNotConnect>
        <ConnectWalletButton width="100%" />
      </FarmUI.FarmTable.AccountNotConnect>
    )
  }

  if (!userDataReady) {
    return (
      <StyledActionContainer>
        <ActionTitles>
          <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
            {t('Start Farming')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <Skeleton width={180} marginBottom={28} marginTop={14} />
        </ActionContent>
      </StyledActionContainer>
    )
  }

  if (stakedBalance.gt(0)) {
    return (
      <StyledActionContainer>
        <ActionTitles>
          <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
            {lpSymbol}
          </Text>
          <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
            {t('Staked')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <FarmUI.StakedLP
            stakedBalance={stakedBalance}
            quoteTokenSymbol={quoteToken.symbol}
            tokenSymbol={token.symbol}
            lpTotalSupply={lpTotalSupply}
            lpTokenPrice={lpTokenPrice}
            tokenAmountTotal={tokenAmountTotal}
            quoteTokenAmountTotal={quoteTokenAmountTotal}
          />
          <IconButtonWrapper>
            <IconButton mr="6px" variant="secondary" onClick={onPresentWithdraw}>
              <MinusIcon color="primary" width="14px" />
            </IconButton>
            <IconButton variant="secondary" onClick={onPresentDeposit} disabled={isStakeReady}>
              <AddIcon color="primary" width="14px" />
            </IconButton>
          </IconButtonWrapper>
        </ActionContent>
      </StyledActionContainer>
    )
  }

  return (
    <FarmUI.FarmTable.StakeComponent
      lpSymbol={lpSymbol}
      isStakeReady={isStakeReady}
      onPresentDeposit={onPresentDeposit}
    />
  )
}

export default Staked
