import { ChainId } from '@pancakeswap/sdk'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useGetChainName } from 'state/info/hooks'
import { useAccount } from 'wagmi'
import { v3InfoPath } from '../../constants'
import InfoNav from './InfoNav'

export const InfoPageLayout = ({ children }) => {
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()
  const router = useRouter()
  const chainName = useGetChainName()
  const isStableSwap = router.query.type === 'stableSwap'

  useEffect(() => {
    if (account && chainId === ChainId.BSC && router.query.chainName === 'eth')
      router.replace(`/${v3InfoPath}`, undefined, { shallow: true })
    else if (account && chainId === ChainId.ETHEREUM && router.query.chainName !== 'eth')
      router.replace(`/${v3InfoPath}/eth`, undefined, { shallow: true })
  }, [isStableSwap, chainId, account, chainName, router])
  return (
    <>
      <InfoNav isStableSwap={false} />
      {children}
    </>
  )
}
