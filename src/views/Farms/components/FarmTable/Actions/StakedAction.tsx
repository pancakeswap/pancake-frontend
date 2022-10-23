import { TransactionResponse } from '@ethersproject/providers'
import { useTranslation } from '@pancakeswap/localization'
import { AddIcon, Button, IconButton, MinusIcon, Skeleton, Text, useModal, useToast } from '@pancakeswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { ToastDescriptionWithTx } from 'components/Toast'
import { BASE_ADD_LIQUIDITY_URL, DEFAULT_TOKEN_DECIMAL } from 'config'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useCatchTxError from 'hooks/useCatchTxError'
import { useERC20 } from 'hooks/useContract'
import { useRouter } from 'next/router'
import { useCallback, useContext, useMemo } from 'react'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/farms'
import { useTransactionAdder, useNonBscFarmPendingTransaction } from 'state/transactions/hooks'
import { FarmTransactionStatus, NonBscFarmStepType } from 'state/transactions/actions'
import { pickFarmTransactionTx } from 'state/global/actions'
import { usePriceCakeBusd } from 'state/farms/hooks'
import styled from 'styled-components'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import BigNumber from 'bignumber.js'
import { formatLpBalance } from 'utils/formatBalance'
import { ChainId } from '@pancakeswap/sdk'
import { getCrossFarmingSenderContract } from 'utils/contractHelpers'
import { useWeb3React } from '@pancakeswap/wagmi'
import useApproveFarm from '../../../hooks/useApproveFarm'
import useStakeFarms from '../../../hooks/useStakeFarms'
import useUnstakeFarms from '../../../hooks/useUnstakeFarms'
import DepositModal from '../../DepositModal'
import StakedLP from '../../StakedLP'
import { FarmWithStakedValue } from '../../types'
import WithdrawModal from '../../WithdrawModal'
import { YieldBoosterStateContext } from '../../YieldBooster/components/ProxyFarmContainer'
import useProxyStakedActions from '../../YieldBooster/hooks/useProxyStakedActions'
import { YieldBoosterState } from '../../YieldBooster/hooks/useYieldBoosterState'
import { ActionContainer, ActionContent, ActionTitles } from './styles'

const IconButtonWrapper = styled.div`
  display: flex;
`

interface StackedActionProps extends FarmWithStakedValue {
  userDataReady: boolean
  lpLabel?: string
  displayApr?: string
  onStake?: (value: string) => Promise<TransactionResponse>
  onUnstake?: (value: string) => Promise<TransactionResponse>
  onDone?: () => void
  onApprove?: () => Promise<TransactionResponse>
  isApproved?: boolean
  shouldUseProxyFarm?: boolean
}

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

export function useStakedActions(lpContract, pid, vaultPid) {
  const { account, chainId } = useActiveWeb3React()
  const { onStake } = useStakeFarms(pid, vaultPid)
  const { onUnstake } = useUnstakeFarms(pid, vaultPid)
  const dispatch = useAppDispatch()

  const { onApprove } = useApproveFarm(lpContract, chainId)

  const onDone = useCallback(
    () => dispatch(fetchFarmUserDataAsync({ account, pids: [pid], chainId })),
    [account, pid, chainId, dispatch],
  )

  return {
    onStake,
    onUnstake,
    onApprove,
    onDone,
  }
}

export const ProxyStakedContainer = ({ children, ...props }) => {
  const { account } = useWeb3React()

  const { lpAddress } = props
  const lpContract = useERC20(lpAddress)

  const { onStake, onUnstake, onApprove, onDone } = useProxyStakedActions(props.pid, lpContract)

  const { allowance } = props.userData || {}

  const isApproved = account && allowance && allowance.isGreaterThan(0)

  return children({
    ...props,
    onStake,
    onDone,
    onUnstake,
    onApprove,
    isApproved,
  })
}

export const StakedContainer = ({ children, ...props }) => {
  const { account } = useWeb3React()

  const { lpAddress } = props
  const lpContract = useERC20(lpAddress)
  const { onStake, onUnstake, onApprove, onDone } = useStakedActions(lpContract, props.pid, props.vaultPid)

  const { allowance } = props.userData || {}

  const isApproved = account && allowance && allowance.isGreaterThan(0)

  return children({
    ...props,
    onStake,
    onDone,
    onUnstake,
    onApprove,
    isApproved,
  })
}

const Staked: React.FunctionComponent<React.PropsWithChildren<StackedActionProps>> = ({
  pid,
  apr,
  vaultPid,
  multiplier,
  lpSymbol,
  lpLabel,
  lpAddress,
  lpTokenPrice,
  quoteToken,
  token,
  userDataReady,
  displayApr,
  lpTotalSupply,
  tokenAmountTotal,
  quoteTokenAmountTotal,
  userData,
  onDone,
  onStake,
  onUnstake,
  onApprove,
  isApproved,
}) => {
  const dispatch = useAppDispatch()
  const pendingFarm = useNonBscFarmPendingTransaction(lpAddress)
  const { boosterState } = useContext(YieldBoosterStateContext)

  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const addTransaction = useTransactionAdder()
  const { fetchWithCatchTxError, fetchTxResponse, loading: pendingTx } = useCatchTxError()
  const { account, chainId } = useActiveWeb3React()

  const { tokenBalance, stakedBalance } = userData || {}

  const router = useRouter()
  const cakePrice = usePriceCakeBusd()

  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: quoteToken.address,
    tokenAddress: token.address,
    chainId,
  })
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`

  const isStakeReady = useMemo(() => {
    return ['history', 'archived'].some((item) => router.pathname.includes(item)) || pendingFarm.length > 0
  }, [pendingFarm, router])

  const handleStake = async (amount: string) => {
    if (vaultPid) {
      await handleNonBscStake(amount)
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

  const handleNonBscStake = async (amountValue: string) => {
    const crossFarmingAddress = getCrossFarmingSenderContract(null, chainId)
    const [receipt, isFirstTime] = await Promise.all([
      fetchTxResponse(() => onStake(amountValue)),
      crossFarmingAddress.is1st(account),
    ])
    const amountAsBigNumber = new BigNumber(amountValue).times(DEFAULT_TOKEN_DECIMAL)
    const amount = formatLpBalance(new BigNumber(amountAsBigNumber))

    if (receipt) {
      addTransaction(receipt, {
        type: 'non-bsc-farm',
        translatableSummary: {
          text: 'Stake %amount% %lpSymbol% Token',
          data: { amount, lpSymbol },
        },
        nonBscFarm: {
          type: NonBscFarmStepType.STAKE,
          status: FarmTransactionStatus.PENDING,
          amount,
          lpSymbol,
          lpAddress,
          steps: [
            {
              step: 1,
              chainId,
              tx: receipt.hash,
              isFirstTime: !isFirstTime,
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

      dispatch(pickFarmTransactionTx({ tx: receipt.hash, chainId }))
      onDone()
    }
  }

  const handleUnstake = async (amount: string) => {
    if (vaultPid) {
      await handleNonBscUnStake(amount)
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

  const handleNonBscUnStake = async (amountValue: string) => {
    const receipt = await fetchTxResponse(() => onUnstake(amountValue))
    const amountAsBigNumber = new BigNumber(amountValue).times(DEFAULT_TOKEN_DECIMAL)
    const amount = formatLpBalance(new BigNumber(amountAsBigNumber))

    if (receipt) {
      addTransaction(receipt, {
        type: 'non-bsc-farm',
        translatableSummary: {
          text: 'Unstake %amount% %lpSymbol% Token',
          data: { amount, lpSymbol },
        },
        nonBscFarm: {
          type: NonBscFarmStepType.UNSTAKE,
          status: FarmTransactionStatus.PENDING,
          amount,
          lpSymbol,
          lpAddress,
          steps: [
            {
              step: 1,
              chainId,
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
              chainId,
              tx: '',
              status: FarmTransactionStatus.PENDING,
            },
          ],
        },
      })

      dispatch(pickFarmTransactionTx({ tx: receipt.hash, chainId }))
      onDone()
    }
  }

  const [onPresentDeposit] = useModal(
    <DepositModal
      pid={pid}
      vaultPid={vaultPid}
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
      showActiveBooster={boosterState === YieldBoosterState.ACTIVE}
    />,
  )

  const [onPresentWithdraw] = useModal(
    <WithdrawModal
      showActiveBooster={boosterState === YieldBoosterState.ACTIVE}
      max={stakedBalance}
      onConfirm={handleUnstake}
      tokenName={lpSymbol}
    />,
  )

  const handleApprove = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return onApprove()
    })
    if (receipt?.status) {
      toastSuccess(t('Contract Enabled'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      onDone()
    }
  }, [onApprove, t, toastSuccess, fetchWithCatchTxError, onDone])

  if (!account) {
    return (
      <StyledActionContainer>
        <ActionTitles>
          <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
            {t('Start Farming')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <ConnectWalletButton width="100%" />
        </ActionContent>
      </StyledActionContainer>
    )
  }

  if (isApproved) {
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
            <StakedLP
              lpAddress={lpAddress}
              stakedBalance={stakedBalance}
              quoteTokenSymbol={quoteToken.symbol}
              tokenSymbol={token.symbol}
              lpTotalSupply={lpTotalSupply}
              lpTokenPrice={lpTokenPrice}
              tokenAmountTotal={tokenAmountTotal}
              quoteTokenAmountTotal={quoteTokenAmountTotal}
            />
            <IconButtonWrapper>
              <IconButton mr="6px" variant="secondary" disabled={pendingFarm.length > 0} onClick={onPresentWithdraw}>
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
      <StyledActionContainer>
        <ActionTitles>
          <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px" pr="4px">
            {t('Stake')}
          </Text>
          <Text bold textTransform="uppercase" color="secondary" fontSize="12px">
            {lpSymbol}
          </Text>
        </ActionTitles>
        <ActionContent>
          <Button width="100%" onClick={onPresentDeposit} variant="secondary" disabled={isStakeReady}>
            {t('Stake LP')}
          </Button>
        </ActionContent>
      </StyledActionContainer>
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

  return (
    <StyledActionContainer>
      <ActionTitles>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {t('Enable Farm')}
        </Text>
      </ActionTitles>
      <ActionContent>
        <Button width="100%" disabled={pendingTx} onClick={handleApprove} variant="secondary">
          {t('Enable')}
        </Button>
      </ActionContent>
    </StyledActionContainer>
  )
}

export default Staked
