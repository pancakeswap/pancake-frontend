import { ChainId } from '@pancakeswap/sdk'
import { useWeb3React } from '@pancakeswap/wagmi'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useEffect } from 'react'
import { useGetChainName } from 'state/info/hooks'
import InfoNav from './components/InfoNav'

export const InfoPageLayout = ({ children }) => {
  const { account } = useWeb3React()
  const { chainId } = useActiveWeb3React()
  const chainName = useGetChainName()

  useEffect(() => {
    if (account && chainId === ChainId.BSC && window.location.pathname.includes('eth')) window.location.href = '/info'
    if (account && chainId === ChainId.ETHEREUM && !window.location.pathname.includes('eth'))
      window.location.href = '/info/eth'
  }, [chainId, account, chainName])
  return (
    <>
      <InfoNav />
      {children}
    </>
  )
}
