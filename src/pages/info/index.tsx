import { InfoPageLayout } from 'views/Info'
import { useEffect } from 'react'
import Overview from 'views/Info/Overview'
import { useRouter } from 'next/router'
import { ChainId } from '@pancakeswap/sdk'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { CHAIN_IDS } from '@pancakeswap/wagmi'

const InfoPage = () => {
  const router = useRouter()
  const { chainId } = useActiveChainId()
  useEffect(() => {
    const { chainName } = router.query
    if (chainId === ChainId.ETHEREUM && !chainName)
      router.replace({ pathname: '/info/eth', query: '' }, undefined, { shallow: true })
    else if (!chainName && chainId === ChainId.BSC)
      router.replace({ pathname: '/info', query: '' }, undefined, { shallow: true })
  }, [chainId, router])

  return <Overview />
}

InfoPage.Layout = InfoPageLayout
InfoPage.chains = CHAIN_IDS

export default InfoPage
