import { InfoPageLayout } from 'views/Info'
import { useEffect } from 'react'
import Overview from 'views/Info/Overview'
import { useRouter } from 'next/router'
import { ChainId } from '@pancakeswap/sdk'
import { useActiveChainId } from 'hooks/useActiveChainId'

const InfoPage = () => {
  const router = useRouter()
  const { chainId } = useActiveChainId()
  useEffect(() => {
    const { chainName } = router.query
    if (chainId === ChainId.ETHEREUM && !chainName)
      router.push({ pathname: '/info/eth', query: '' }, undefined, { shallow: true })
  }, [chainId, router])

  return <Overview />
}

InfoPage.Layout = InfoPageLayout
InfoPage.chains = [] // set all

export default InfoPage
