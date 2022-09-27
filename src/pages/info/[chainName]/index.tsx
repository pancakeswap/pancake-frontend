import { InfoPageLayout } from 'views/Info'
import Overview from 'views/Info/Overview'
import { useEffect } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { ChainId } from '@pancakeswap/sdk'
import { useWeb3React } from '@pancakeswap/wagmi'

const MultiChainPage = () => {
  const { account } = useWeb3React()
  const { chainId } = useActiveWeb3React()
  useEffect(() => {
    console.log(chainId, '????????')
    if (account && chainId === ChainId.BSC) window.location.href = '/info'
  }, [chainId, account])
  return <Overview />
}

MultiChainPage.Layout = InfoPageLayout
MultiChainPage.chains = []

export default MultiChainPage
