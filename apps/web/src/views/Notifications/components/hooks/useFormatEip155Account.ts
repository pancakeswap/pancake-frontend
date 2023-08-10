import { useAccount, useChainId } from 'wagmi'

const useFormattedEip155Account = () => {
  const { address } = useAccount()
  const chainId = useChainId()
  return { formattedEip155Account: `eip155:${chainId}:${address}`, account: address }
}

export default useFormattedEip155Account
