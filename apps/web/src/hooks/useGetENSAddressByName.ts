import { ChainId } from '@pancakeswap/chains'
import { CHAINS } from 'config/chains'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo } from 'react'
import { useEnsAddress } from 'wagmi'

const ENS_SUPPORT_CHAIN_IDS = CHAINS.filter((c) => 'contracts' in c && 'ensUniversalResolver' in c.contracts).map(
  (c) => c.id,
)

const ENS_NAME_REGEX = /^[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)?$/

const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/

export const useGetENSAddressByName = (ensNameOrAddress?: string) => {
  const { chainId } = useActiveChainId()
  const ensSupported = useMemo(
    () => Boolean(chainId && ENS_SUPPORT_CHAIN_IDS.includes(chainId as (typeof ENS_SUPPORT_CHAIN_IDS)[number])),
    [chainId],
  )
  const { data: recipientENSAddress } = useEnsAddress({
    name: ensNameOrAddress,
    chainId,
    enabled:
      typeof ensNameOrAddress !== 'undefined' &&
      (ENS_NAME_REGEX.test(ensNameOrAddress) || ADDRESS_REGEX.test(ensNameOrAddress)) &&
      chainId !== ChainId.BSC &&
      chainId !== ChainId.BSC_TESTNET &&
      ensSupported,
  })
  return recipientENSAddress
}
