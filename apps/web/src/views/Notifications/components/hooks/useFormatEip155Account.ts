import { useAccount, useChainId } from 'wagmi'

const useFormattedEip155Account = () => {
  const { address } = useAccount()
  const chainId = useChainId()

  const eip155Account = chainId && address ? `eip155:1:${address}` : null
  return { eip155Account, account: address }
}

export default useFormattedEip155Account
