import { useCallback, useContext } from 'react'
import styled from 'styled-components'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Button, Flex, IconButton, AddIcon, MinusIcon, useModal } from '@pancakeswap/uikit'
import useToast from 'hooks/useToast'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useTranslation } from '@pancakeswap/localization'

import { useRouter } from 'next/router'
import { useLpTokenPrice, usePriceCakeBusd } from 'state/farms/hooks'
import { TransactionResponse } from '@ethersproject/providers'
import { useAppDispatch } from 'state'
import { ChainId } from '@pancakeswap/sdk'
import { formatNumber } from 'utils/formatBalance'
import { pickFarmTransactionTx } from 'state/global/actions'
import { getCrossFarmingContract } from 'utils/contractHelpers'
import { useTransactionAdder } from 'state/transactions/hooks'
import { FarmTransactionStatus } from 'state/transactions/actions'

import DepositModal from '../DepositModal'
import WithdrawModal from '../WithdrawModal'
import { FarmWithStakedValue } from '../types'
import StakedLP from '../StakedLP'
import { YieldBoosterStateContext } from '../YieldBooster/components/ProxyFarmContainer'
import { YieldBoosterState } from '../YieldBooster/hooks/useYieldBoosterState'

interface FarmCardActionsProps extends FarmWithStakedValue {
  lpLabel?: string
  addLiquidityUrl?: string
  displayApr?: string
  onStake?: (value: string) => Promise<TransactionResponse>
  onUnstake?: (value: string) => Promise<TransactionResponse>
  onDone?: () => void
  onApprove?: () => Promise<TransactionResponse>
  isApproved?: boolean
}

const IconButtonWrapper = styled.div`
  display: flex;
  svg {
    width: 20px;
  }
`

const StakeAction: React.FC<React.PropsWithChildren<FarmCardActionsProps>> = ({
  vaultPid,
  quoteToken,
  token,
  lpSymbol,
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
  onStake,
  onUnstake,
  onDone,
  onApprove,
  isApproved,
}) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const addTransaction = useTransactionAdder()
  const { account, chainId } = useActiveWeb3React()
  const { tokenBalance, stakedBalance } = userData
  const cakePrice = usePriceCakeBusd()
  const router = useRouter()
  const lpPrice = useLpTokenPrice(lpSymbol)
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { boosterState } = useContext(YieldBoosterStateContext)

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
    try {
      const crossFarmingAddress = getCrossFarmingContract(null, chainId)
      const [receipt, nonce] = await Promise.all([onStake(amountValue), crossFarmingAddress.nonces(account)])
      const amount = formatNumber(Number(amountValue), 5, 5)

      addTransaction(receipt, {
        type: 'non-bsc-farm-stake',
        translatableSummary: {
          text: 'Stake %amount% %lpSymbol% Token',
          data: { amount, lpSymbol },
        },
        nonBscFarm: {
          status: FarmTransactionStatus.PENDING,
          amount,
          lpSymbol,
          lpAddress,
          steps: [
            {
              step: 1,
              chainId,
              tx: receipt.hash,
              nonce: nonce.toString(),
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

      dispatch(pickFarmTransactionTx({ tx: receipt.hash }))
      onDone()
    } catch (error) {
      console.error('Stake non Bsc Farm Error: ', error)
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
    try {
      const receipt = await onUnstake(amountValue)
      const amount = formatNumber(Number(amountValue), 5, 5)

      addTransaction(receipt, {
        type: 'non-bsc-farm-unstake',
        translatableSummary: {
          text: 'Unstake %amount% %lpSymbol% Token',
          data: { amount, lpSymbol },
        },
        nonBscFarm: {
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

      dispatch(pickFarmTransactionTx({ tx: receipt.hash }))
      onDone()
    } catch (error) {
      console.error('Unstake non Bsc Farm Error: ', error)
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

  const [onPresentDeposit] = useModal(
    <DepositModal
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
        <IconButton mr="6px" variant="tertiary" onClick={onPresentWithdraw}>
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

  // TODO: Move this out to prevent unnecessary re-rendered
  if (!isApproved) {
    return (
      <Button mt="8px" width="100%" disabled={pendingTx} onClick={handleApprove}>
        {t('Enable Contract')}
      </Button>
    )
  }

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <StakedLP
        lpAddress={lpAddress}
        stakedBalance={stakedBalance}
        lpSymbol={lpSymbol}
        quoteTokenSymbol={quoteToken.symbol}
        tokenSymbol={token.symbol}
        lpTotalSupply={lpTotalSupply}
        tokenAmountTotal={tokenAmountTotal}
        quoteTokenAmountTotal={quoteTokenAmountTotal}
      />
      {renderStakingButtons()}
    </Flex>
  )
}

export default StakeAction
