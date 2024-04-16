import { useTranslation } from '@pancakeswap/localization'
import { ChainId, CurrencyAmount, Token } from '@pancakeswap/sdk'
import { AutoRenewIcon, Button, useToast } from '@pancakeswap/uikit'
import tryParseAmount from '@pancakeswap/utils/tryParseAmount'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useQuery } from '@tanstack/react-query'
import { ToastDescriptionWithTx } from 'components/Toast'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import useCatchTxError from 'hooks/useCatchTxError'
import { useV2SSBCakeWrapperContract } from 'hooks/useContract'
import React, { useMemo } from 'react'
import { useFarmFromPid } from 'state/farms/hooks'
import { publicClient } from 'utils/wagmi'
import { Address, erc20Abi } from 'viem'

export interface StakeButtonProps {
  wrapperAddress?: Address
  pid?: number
  lpSymbol: string
  onDone: () => void
}

export async function getLpData({ lpAddress, chainId, account, wrapperAddress }): Promise<{
  userLp: bigint
  lpDecimals: number
  allowanceLp: bigint
} | null> {
  const [userLpData, lpDecimalsData, allowanceLpData] = await publicClient({
    chainId,
  }).multicall({
    contracts: [
      {
        address: lpAddress,
        functionName: 'balanceOf',
        abi: erc20Abi,
        args: [account],
      },
      {
        address: lpAddress,
        functionName: 'decimals',
        abi: erc20Abi,
      },
      {
        address: lpAddress,
        functionName: 'allowance',
        abi: erc20Abi,
        args: [account, wrapperAddress],
      },
    ],
  })

  if (
    (!userLpData?.result && userLpData?.result !== 0n) ||
    !lpDecimalsData?.result ||
    (!allowanceLpData?.result && allowanceLpData?.result !== 0n)
  )
    return null

  const [userLp, lpDecimals, allowanceLp] = [userLpData.result, lpDecimalsData.result, allowanceLpData.result]

  return {
    userLp,
    lpDecimals,
    allowanceLp,
  }
}

export const useLpData = (lpAddress: Address, wrapperAddress: Address) => {
  const { chainId, account } = useWeb3React()
  const { data, refetch, isLoading } = useQuery({
    queryKey: ['lpContractData', lpAddress, chainId, wrapperAddress],
    queryFn: () => getLpData({ lpAddress, chainId, account, wrapperAddress }),
    enabled: !!lpAddress && !!chainId && !!account && !!wrapperAddress && lpAddress !== '0x' && wrapperAddress !== '0x',
    refetchInterval: 3000,
    staleTime: 3000,
    gcTime: 3000,
  })
  return { data, refetch, isDataLoading: isLoading }
}

const StakeButton: React.FC<React.PropsWithChildren<StakeButtonProps>> = ({
  wrapperAddress,
  pid,
  lpSymbol,
  onDone,
}) => {
  const { t } = useTranslation()
  const { lpAddress } = useFarmFromPid(pid) ?? {}
  const { data, refetch, isDataLoading } = useLpData(lpAddress ?? '0x', wrapperAddress ?? '0x')
  const { lpDecimals, userLp, allowanceLp } = data ?? {}

  const { account, chain, chainId } = useWeb3React()

  const { toastSuccess } = useToast()

  const { loading: pendingTx, fetchWithCatchTxError } = useCatchTxError()

  const [isLoading, setIsLoading] = React.useState(false)

  const isNeedStake = (data?.userLp ?? 0n) > 0n

  const bCakeWrapperContract = useV2SSBCakeWrapperContract(wrapperAddress ?? '0x')

  const currency = useMemo(() => {
    return new Token(chainId ?? ChainId.BSC, lpAddress ?? '0x', lpDecimals ?? 18, lpSymbol, lpSymbol)
  }, [lpAddress, chainId, lpSymbol, lpDecimals])

  const amountLp = useMemo(
    () => tryParseAmount((userLp ?? 0n).toString(), currency) || CurrencyAmount.fromRawAmount(currency, '0'),
    [userLp, currency],
  )

  const { approvalState, approveCallback } = useApproveCallback(amountLp, wrapperAddress ?? '0x')
  const isAllApproved = approvalState === ApprovalState.APPROVED || (allowanceLp === userLp && (userLp ?? 0n) > 0n)

  const handleStake = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()

    if (bCakeWrapperContract) {
      setIsLoading(true)

      const receipt = await fetchWithCatchTxError(() => {
        return bCakeWrapperContract.write.deposit([userLp ?? 0n, false], {
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
            {t('Your funds have been Staked in new BCake farm Wrapper.')}
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
          disabled={approvalState === ApprovalState.PENDING || isDataLoading}
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
