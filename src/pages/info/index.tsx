import { InfoPageLayout } from 'views/Info'
import Overview from 'views/Info/Overview'
import { useEffect } from 'react'
import { ChainId } from '@pancakeswap/sdk'
import { useWeb3React } from '@pancakeswap/wagmi'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

const InfoPage = () => {
  const { chainId } = useActiveWeb3React()
  const { account } = useWeb3React()
  useEffect(() => {
    if (account && chainId === ChainId.ETHEREUM) window.location.href = '/info/eth'
  }, [chainId, account])
  return <Overview />
}

InfoPage.Layout = InfoPageLayout
InfoPage.chains = [] // set all

export default InfoPage
