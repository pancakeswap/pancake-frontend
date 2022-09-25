import { useAccount } from '@pancakeswap/awgmi'
import { useIsMounted } from '@pancakeswap/hooks'

export default function HasAccount({ fallbackComp, children }) {
  const { account } = useAccount()
  const isMounted = useIsMounted()

  return isMounted && account ? <>{children}</> : fallbackComp
}
