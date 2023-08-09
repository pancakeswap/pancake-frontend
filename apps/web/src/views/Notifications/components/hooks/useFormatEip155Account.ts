import { useAccount, useChainId } from 'wagmi'

const useFormattedEip155Account = () => {
  const { address } = useAccount()
  const chainId = useChainId()
  return `eip155:${chainId}:${address}`
}

export default useFormattedEip155Account
