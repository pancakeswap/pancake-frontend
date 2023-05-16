import { ChainId } from '@pancakeswap/sdk'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useEnsAddress } from 'wagmi'

const ENS_NAME_REGEX = /^[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)?$/

const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/

export const useGetENSAddressByName = (ensNameOrAddress: string) => {
  const { chainId } = useActiveChainId()
  const { data: recipientENSAddress } = useEnsAddress({
    name: ensNameOrAddress,
    chainId,
    enabled:
      (ENS_NAME_REGEX.test(ensNameOrAddress) || ADDRESS_REGEX.test(ensNameOrAddress)) &&
      chainId !== ChainId.BSC &&
      chainId !== ChainId.BSC_TESTNET,
  })
  return recipientENSAddress
}
