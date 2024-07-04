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
import { useCallback } from 'react'
import { getZkSyncAirDropAddress } from 'utils/addressHelpers'
import { publicClient } from 'utils/wagmi'
import { Address, encodeFunctionData } from 'viem'
import { useAccount, useConfig } from 'wagmi'

interface ZksyncAirDropWhiteListData {
  address: Address
  amount: string
  proof: any[]
}

const MOCK_DATA = [
  {
    address: '0x80c6E2c7CBE984B1454c5796F11f0914A5e586F5',
    amount: '42000000000000000',
    proof: [
      '0x30d6cf663aa38bd29ec102e4ee28f5e4842f34cfd5f9dc77e167234beecfac20',
      '0x60e9d27dc574edcdccc703150e60e2398e5c4920f2f726f5fee8bda2ecb2f830',
      '0x61358ab3da28422ea1f65b2b3992590603ea1a2414cfbe5c03398b0e0813ca6d',
    ],
  },
  {
    address: '0x00000000632eeCE87D2031a5531549F96E873F8c',
    amount: '69000000000000000',
    proof: [
      '0x2f74f9d950a575d086ea35654bd827eb08a45c71d530cb5347cf0ffaf6d50f25',
      '0x6ae102db61c8122c09a6900e6d6179adb7b48bd78c8bb9fb6a0e0dfa8a13a51b',
      '0xa63af1d4174b721efd8c451764b4e7680fd500c421019a86b3bf92c2f463c04e',
      '0x78e2233891172ff704b254f8d17c8603e90fabdcb6f0e732e4f71ff383fee21f',
    ],
  },
  {
    address: '0xA13bb13609c3B9AABB8A4D5B4E9EcbaF502cA56E',
    amount: '10000000000000000',
    proof: [
      '0x30a9634d03dd5d860280b0fca266bfb93972a3ea18fb5871970add7af1547324',
      '0x6ae102db61c8122c09a6900e6d6179adb7b48bd78c8bb9fb6a0e0dfa8a13a51b',
      '0xa63af1d4174b721efd8c451764b4e7680fd500c421019a86b3bf92c2f463c04e',
      '0x78e2233891172ff704b254f8d17c8603e90fabdcb6f0e732e4f71ff383fee21f',
    ],
  },
  {
    address: '0xa9c60777fD1A95602D6c080A72Ff02324373F609',
    amount: '20000000000000000',
    proof: [
      '0x05e130cf5472b426805bb9735165daf5fb976724e9a1bdb5b99fe25b60c8aebb',
      '0x4214b42cf49ded83f4a318bb129d80bff5120adf288fd1b33c1df6b199de8ba1',
      '0xa63af1d4174b721efd8c451764b4e7680fd500c421019a86b3bf92c2f463c04e',
      '0x78e2233891172ff704b254f8d17c8603e90fabdcb6f0e732e4f71ff383fee21f',
    ],
  },
  {
    address: '0x99537B35c8aE53218Bc5eCeEc2b67099BbB464FF',
    amount: '30000000000000000',
    proof: [
      '0x099133dd48a3c454ac0639cdf72067a8b47108bfb95c810e10dc346113a4c4ae',
      '0x4214b42cf49ded83f4a318bb129d80bff5120adf288fd1b33c1df6b199de8ba1',
      '0xa63af1d4174b721efd8c451764b4e7680fd500c421019a86b3bf92c2f463c04e',
      '0x78e2233891172ff704b254f8d17c8603e90fabdcb6f0e732e4f71ff383fee21f',
    ],
  },
  {
    address: '0x7138De39d6aadD1C90C50199C75A6dA4e59F2B97',
    amount: '40000000000000000',
    proof: [
      '0x46af5b64fbe52f6affeb61e895550e91799560e6c3fae915cc69df8f86fa678d',
      '0x60e9d27dc574edcdccc703150e60e2398e5c4920f2f726f5fee8bda2ecb2f830',
      '0x61358ab3da28422ea1f65b2b3992590603ea1a2414cfbe5c03398b0e0813ca6d',
    ],
  },
  {
    address: '0x444D73Ea7bC7C72Ea11638203846dAD632677180',
    amount: '50000000000000000',
    proof: [
      '0xa9787fd19057ba6d7db571223751a2a6e042a6f6382fa6cc689d878925eb49d4',
      '0x0290f20267e2a55e99ec9f14459315bc1914f0d82bd45206459dfa3137881cd7',
      '0x61358ab3da28422ea1f65b2b3992590603ea1a2414cfbe5c03398b0e0813ca6d',
    ],
  },
  {
    address: '0xBF621cCc764E6e9Ad51095d7863d945333aBb333',
    amount: '60000000000000000',
    proof: [
      '0xd8ae731ed42e8eb57ca6d08581af49276edb21e568799507b5ead2fea42b7f9c',
      '0xe897e36b51bbdcba22529312a8f3514a8dde7746ec312342ab6f23398a764195',
      '0x78e2233891172ff704b254f8d17c8603e90fabdcb6f0e732e4f71ff383fee21f',
    ],
  },
  {
    address: '0xF4354944716bc79E6AaCAF0F791b0020C6F53445',
    amount: '70000000000000000',
    proof: [
      '0xd24594dfab88779e8dbc0fc9aa169d6bad83d985fe097e75aaafa100ba9d5dc1',
      '0xe897e36b51bbdcba22529312a8f3514a8dde7746ec312342ab6f23398a764195',
      '0x78e2233891172ff704b254f8d17c8603e90fabdcb6f0e732e4f71ff383fee21f',
    ],
  },
  {
    address: '0xCFe43a25b32C9C3308FaA16F7e0994e31ed73eF5',
    amount: '80000000000000000',
    proof: [
      '0xced2c66a41bc1c5999014b00cfce59cf92245f33f2595e7f3a6e5d48588928db',
      '0x0290f20267e2a55e99ec9f14459315bc1914f0d82bd45206459dfa3137881cd7',
      '0x61358ab3da28422ea1f65b2b3992590603ea1a2414cfbe5c03398b0e0813ca6d',
    ],
  },
]

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
  const { address: account, chainId } = useAccount()
  const whiteListData = useUserWhiteListData()
  const { toastSuccess } = useToast()
  const zkSyncAirDropContract = useZksyncAirDropContract()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { isPaymasterAvailable, isPaymasterTokenActive, sendPaymasterTransaction } = usePaymaster()
  const chainConfig = useConfig()
  const chain = chainConfig.chains[ChainId.ZKSYNC]
  const { switchNetwork } = useSwitchNetwork()

  const claimAirDrop = useCallback(async () => {
    if (!whiteListData || !zkSyncAirDropContract || !account || chainId !== ChainId.ZKSYNC) {
      if (chainId !== ChainId.ZKSYNC) {
        switchNetwork(ChainId.ZKSYNC)
      }
      return
    }
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
  ])

  // eslint-disable-next-line consistent-return
  return { claimAirDrop, pendingTx }
}
