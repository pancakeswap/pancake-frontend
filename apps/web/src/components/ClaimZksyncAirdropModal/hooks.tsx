import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { useToast } from '@pancakeswap/uikit'
import { useQuery } from '@tanstack/react-query'
import { ToastDescriptionWithTx } from 'components/Toast'
import { zkSyncAirDropABI } from 'config/abi/zksyncAirdrop'
import useCatchTxError from 'hooks/useCatchTxError'
import { useZksyncAirDropContract } from 'hooks/useContract'
import { usePaymaster } from 'hooks/usePaymaster'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'
import { useCallback, useMemo } from 'react'
import { calculateGasMargin } from 'utils'
import { getZkSyncAirDropAddress } from 'utils/addressHelpers'
import { getGasSponsorship } from 'utils/paymaster'
import { publicClient } from 'utils/wagmi'
import { Address, encodeFunctionData } from 'viem'
import { useAccount, useConfig } from 'wagmi'

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
  const { data, refetch } = useQuery({
    queryKey: ['zksyncAirdrop', account, address, proof],
    queryFn: () => fetchZksyncAirDropData(account!, address, proof!),
    enabled: Boolean(account) && Boolean(address) && Boolean(proof),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })
  return { zksyncAirdropData: data, refetch }
}

export const useUserWhiteListData = (enable: boolean) => {
  const { address: account } = useAccount()
  const { data } = useQuery({
    queryKey: ['zksyncAirdropWhiteList', account],
    queryFn: async () => {
      try {
        return await fetchZksyncAirDropWhitelist(account!)
      } catch (error) {
        return {
          address: account!,
          amount: undefined,
          proof: undefined,
        }
      }
    },
    enabled: Boolean(account && enable),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  return useMemo(
    () =>
      data
        ? {
            account: data.address,
            amount: data?.amount ? BigInt(data.amount) : undefined,
            proof: data?.proof,
          }
        : undefined,
    [data],
  )
}

export const useClaimZksyncAirdrop = (enable: boolean | undefined, onDone?: () => void) => {
  const { t } = useTranslation()
  const { address: account, chainId } = useAccount()
  const whiteListData = useUserWhiteListData(enable ?? false)
  const { toastSuccess } = useToast()
  const zkSyncAirDropContract = useZksyncAirDropContract()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { isPaymasterAvailable, isPaymasterTokenActive, sendPaymasterTransaction } = usePaymaster()
  const chainConfig = useConfig()
  const chain = chainConfig.chains[ChainId.ZKSYNC]
  const { switchNetwork } = useSwitchNetwork()

  const claimAirDrop = useCallback(async () => {
    if (
      !whiteListData ||
      !whiteListData.amount ||
      !whiteListData.proof ||
      !zkSyncAirDropContract ||
      !account ||
      chainId !== ChainId.ZKSYNC
    ) {
      if (chainId !== ChainId.ZKSYNC) {
        switchNetwork(ChainId.ZKSYNC)
      }
      return
    }
    const receipt = await fetchWithCatchTxError(async () => {
      if (isPaymasterAvailable && isPaymasterTokenActive) {
        // Check gas balance
        const { isEnoughGasBalance } = await getGasSponsorship()

        if (isEnoughGasBalance) {
          const estimatedGas = await zkSyncAirDropContract.estimateGas.claim(
            [account, whiteListData.amount!, whiteListData.proof!],
            {
              account,
            },
          )

          const calldata = encodeFunctionData({
            abi: zkSyncAirDropContract.abi,
            functionName: 'claim',
            args: [account, whiteListData.amount!, whiteListData.proof!],
          })

          const call = {
            address: zkSyncAirDropContract.address,
            calldata,
            gas: calculateGasMargin(estimatedGas),
          }

          return sendPaymasterTransaction(call, account)
        }
        // If not enough gas balance, continue to normal claim
      }

      return zkSyncAirDropContract.write.claim([account, whiteListData.amount!, whiteListData.proof!], {
        account,
        chain,
      })
    })
    if (receipt?.status) {
      onDone?.()
      toastSuccess(
        `${t('AirDrop Claimed!')}`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>{t('ZK AirDrop Claimed')}</ToastDescriptionWithTx>,
      )
    }
  }, [
    whiteListData,
    zkSyncAirDropContract,
    account,
    chainId,
    fetchWithCatchTxError,
    switchNetwork,
    isPaymasterAvailable,
    isPaymasterTokenActive,
    chain,
    sendPaymasterTransaction,
    toastSuccess,
    t,
    onDone,
  ])

  // eslint-disable-next-line consistent-return
  return { claimAirDrop, pendingTx }
}
