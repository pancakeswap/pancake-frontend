import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { useToast } from '@pancakeswap/uikit'
import { useQuery } from '@tanstack/react-query'
import { ToastDescriptionWithTx } from 'components/Toast'
import { zkSyncAirDropABI } from 'config/abi/zksyncAirdrop'
import useCatchTxError from 'hooks/useCatchTxError'
import { useZksyncAirDropContract } from 'hooks/useContract'
import { usePaymaster } from 'hooks/usePaymaster'
import { useCallback } from 'react'
import { getZkSyncAirDropAddress } from 'utils/addressHelpers'
import { publicClient } from 'utils/wagmi'
import { Address, encodeFunctionData } from 'viem'
import { useAccount } from 'wagmi'

interface ZksyncAirDropWhiteListData {
  address: Address
  amount: string
  proof: any[]
}

export const fetchZksyncAirDropWhitelist = async (account: Address): Promise<ZksyncAirDropWhiteListData> => {
  const response = await fetch(`https://proofs.pancakeswap.com/zksync-airdrop/v9/${account}`)
  if (!response.ok) {
    throw new Error('User is not in whitelist')
  }
  return response.json() as Promise<ZksyncAirDropWhiteListData>
}

export const fetchZksyncAirDropData = async (account: Address, address: Address, proof: any[]) => {
  const zksyncAirDropData = await publicClient({ chainId: ChainId.ZKSYNC }).multicall({
    contracts: [
      {
        abi: zkSyncAirDropABI,
        address,
        functionName: 'canClaim',
        args: [account, 0n, proof],
      },
      {
        abi: zkSyncAirDropABI,
        address,
        functionName: 'claimedAmounts',
        args: [account],
      },
    ],
    allowFailure: false,
  })

  return { canClaim: zksyncAirDropData[0], claimedAmount: zksyncAirDropData[1] }
}

export const useZksyncAirDropData = (proof?: any[]) => {
  const address = getZkSyncAirDropAddress(ChainId.ZKSYNC)
  const { address: account } = useAccount()
  const { data } = useQuery({
    queryKey: ['zksyncAirdrop', account, address, proof],
    queryFn: () => fetchZksyncAirDropData(account!, address, proof!),
    enabled: Boolean(account) && Boolean(address) && Boolean(proof),
  })
  return data
}

export const useUserWhiteListData = () => {
  const { address: account } = useAccount()
  const { data } = useQuery({
    queryKey: ['zksyncAirdropWhiteList', account],
    queryFn: () => fetchZksyncAirDropWhitelist(account!),
    enabled: Boolean(account),
  })

  return data
    ? {
        account: data.address,
        amount: BigInt(data.amount),
        proof: data.proof,
      }
    : undefined
}

export const useClaimZksyncAirdrop = () => {
  const { t } = useTranslation()
  const { address: account, chain } = useAccount()
  const whiteListData = useUserWhiteListData()
  const { toastSuccess } = useToast()
  const zkSyncAirDropContract = useZksyncAirDropContract()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { isPaymasterAvailable, isPaymasterTokenActive, sendPaymasterTransaction } = usePaymaster()

  const claimAirDrop = useCallback(async () => {
    if (!whiteListData || !zkSyncAirDropContract || !account) return
    const receipt = await fetchWithCatchTxError(async () => {
      if (isPaymasterAvailable && isPaymasterTokenActive) {
        const calldata = encodeFunctionData({
          abi: zkSyncAirDropContract.abi,
          functionName: 'claim',
          args: [account, whiteListData.amount, whiteListData.proof],
        })

        const call = {
          address: zkSyncAirDropContract.address,
          calldata,
        }

        return sendPaymasterTransaction(call, account)
      }

      return zkSyncAirDropContract.write.claim([account, whiteListData.amount, whiteListData.proof], {
        account,
        chain,
      })
    })
    if (receipt?.status) {
      toastSuccess(
        `${t('AirDrop Claimed!')}`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>{t('ZK AirDrop Claimed')}</ToastDescriptionWithTx>,
      )
    }
  }, [
    account,
    chain,
    fetchWithCatchTxError,
    t,
    toastSuccess,
    whiteListData,
    zkSyncAirDropContract,
    isPaymasterAvailable,
    isPaymasterTokenActive,
    sendPaymasterTransaction,
  ])

  // eslint-disable-next-line consistent-return
  return { claimAirDrop, pendingTx }
}
