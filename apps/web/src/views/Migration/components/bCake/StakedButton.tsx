import { useTranslation } from '@pancakeswap/localization'
import { ChainId, CurrencyAmount, Token } from '@pancakeswap/sdk'
import { AutoRenewIcon, Button, useToast } from '@pancakeswap/uikit'
import tryParseAmount from '@pancakeswap/utils/tryParseAmount'
import { useWeb3React } from '@pancakeswap/wagmi'
import { ToastDescriptionWithTx } from 'components/Toast'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import useCatchTxError from 'hooks/useCatchTxError'
import { usePositionManagerBCakeWrapperContract } from 'hooks/useContract'
import React, { useMemo } from 'react'
import { Address } from 'viem'
import { useLpData } from './V2StakedButton'

export interface StakeButtonProps {
  bCakeWrapperAddress?: Address
  vaultAddress?: Address
  lpSymbol: string
  onDone: () => void
}

const StakeButton: React.FC<React.PropsWithChildren<StakeButtonProps>> = ({
  bCakeWrapperAddress,
  vaultAddress,
  lpSymbol,
  onDone,
}) => {
  const { t } = useTranslation()

  const { account, chain, chainId } = useWeb3React()

  const { toastSuccess } = useToast()

  const { loading: pendingTx, fetchWithCatchTxError } = useCatchTxError()

  const [isLoading, setIsLoading] = React.useState(false)

  const { data, refetch, isDataLoading } = useLpData(vaultAddress ?? '0x', bCakeWrapperAddress ?? '0x')
  const { userLp, lpDecimals, allowanceLp } = data ?? {}

  const isNeedStake = (userLp ?? 0n) > 0n

  const bCakeWrapperContract = usePositionManagerBCakeWrapperContract(bCakeWrapperAddress ?? '0x')

  const currency = useMemo(() => {
    return new Token(chainId ?? ChainId.BSC, vaultAddress ?? '0x', lpDecimals ?? 18, lpSymbol, lpSymbol)
  }, [vaultAddress, chainId, lpSymbol, lpDecimals])

  const amountLp = useMemo(
    () => tryParseAmount((userLp ?? 0n).toString(), currency) || CurrencyAmount.fromRawAmount(currency, '0'),
    [userLp, currency],
  )

  const { approvalState, approveCallback } = useApproveCallback(amountLp, bCakeWrapperAddress ?? '0x')
  const isAllApproved = approvalState === ApprovalState.APPROVED || (allowanceLp === userLp && (userLp ?? 0n) > 0n)
  // eslint-disable-next-line consistent-return
  const handleStake = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()

    if (bCakeWrapperContract && userLp) {
      setIsLoading(true)

      const receipt = await fetchWithCatchTxError(() => {
        return bCakeWrapperContract.write.deposit([userLp, false], {
          account: account ?? '0x',
          chain,
        })
      })

      if (receipt?.status) {
        onDone()
        refetch()
        toastSuccess(
          `${t('Staked')}!`,
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('Your funds have been Staked in new BCake position manager.')}
          </ToastDescriptionWithTx>,
        )
      }
    }
  }

  return (
    <>
      {pendingTx ? (
        <Button
          width="138px"
          marginLeft="auto"
          isLoading={pendingTx || isLoading}
          endIcon={<AutoRenewIcon spin color="currentColor" />}
        >
          {t('Confirming')}
        </Button>
      ) : !isAllApproved && !isDataLoading ? (
        <Button
          width="138px"
          marginLeft="auto"
          onClick={approveCallback}
          disabled={approvalState === ApprovalState.PENDING}
        >
          {approvalState === ApprovalState.PENDING ? t('Enabling...') : t('Enable')}
        </Button>
      ) : (
        <Button width="138px" marginLeft="auto" disabled={!isNeedStake} onClick={handleStake}>
          {isNeedStake ? t('Stake All') : t('Staked')}
        </Button>
      )}
    </>
  )
}

export default StakeButton
