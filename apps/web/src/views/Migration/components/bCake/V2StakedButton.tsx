import { useTranslation } from '@pancakeswap/localization'
import { ChainId, CurrencyAmount, Token } from '@pancakeswap/sdk'
import { AutoRenewIcon, Button, useToast } from '@pancakeswap/uikit'
import tryParseAmount from '@pancakeswap/utils/tryParseAmount'
import { useWeb3React } from '@pancakeswap/wagmi'
import { ToastDescriptionWithTx } from 'components/Toast'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import useCatchTxError from 'hooks/useCatchTxError'
import { useERC20, useV2SSBCakeWrapperContract } from 'hooks/useContract'
import React, { useEffect, useMemo, useState } from 'react'
import { useFarmFromPid } from 'state/farms/hooks'
import { Address } from 'viem'

export interface StakeButtonProps {
  wrapperAddress?: Address
  pid?: number
  lpSymbol: string
  onDone: () => void
}

const StakeButton: React.FC<React.PropsWithChildren<StakeButtonProps>> = ({
  wrapperAddress,
  pid,
  lpSymbol,
  onDone,
}) => {
  const [userLp, setUserLp] = useState(0n)
  const [lpDecimals, setLpDecimals] = useState(18)
  const [allowanceLp, setAllowanceLp] = useState(0n)
  const [fetchCounts, setFetchCounts] = useState(1)
  const { t } = useTranslation()
  const { lpAddress } = useFarmFromPid(pid) ?? {}

  const { account, chain, chainId } = useWeb3React()

  const { toastSuccess } = useToast()

  const { loading: pendingTx, fetchWithCatchTxError } = useCatchTxError()

  const [isLoading, setIsLoading] = React.useState(false)

  const lpContract = useERC20(lpAddress ?? '0x')

  useEffect(() => {
    if (account && lpContract && wrapperAddress && fetchCounts) {
      lpContract?.read.balanceOf([account ?? '0x']).then((res) => {
        setUserLp(res)
      })
      lpContract?.read.decimals().then((res) => {
        setLpDecimals(res)
      })
      lpContract?.read.allowance([account, wrapperAddress]).then((res) => {
        setAllowanceLp(res)
      })
    }
  }, [lpContract, account, wrapperAddress, fetchCounts])

  const isNeedStake = userLp > 0n

  const bCakeWrapperContract = useV2SSBCakeWrapperContract(wrapperAddress ?? '0x')

  const currency = useMemo(() => {
    return new Token(chainId ?? ChainId.BSC, lpAddress ?? '0x', lpDecimals, lpSymbol, lpSymbol)
  }, [lpAddress, chainId, lpSymbol, lpDecimals])

  const amountLp = useMemo(
    () => tryParseAmount(userLp.toString(), currency) || CurrencyAmount.fromRawAmount(currency, '0'),
    [userLp, currency],
  )

  const { approvalState, approveCallback } = useApproveCallback(amountLp, wrapperAddress ?? '0x')
  const isAllApproved = approvalState === ApprovalState.APPROVED || (allowanceLp === userLp && userLp > 0n)
  // eslint-disable-next-line consistent-return
  const handleStake = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()

    if (bCakeWrapperContract) {
      setIsLoading(true)

      const receipt = await fetchWithCatchTxError(() => {
        return bCakeWrapperContract.write.deposit([userLp, false], {
          account: account ?? '0x',
          chain,
        })
      })

      if (receipt?.status) {
        onDone()
        setFetchCounts(fetchCounts + 1)
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
      ) : !isAllApproved ? (
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
