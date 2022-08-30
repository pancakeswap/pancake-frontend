import { InfoPageLayout } from 'views/Info'
import Overview from 'views/Info/Overview'
import { useRouter } from 'next/router'
import { ChainId } from '@pancakeswap/sdk'

const InfoPage = () => {
  const router = useRouter()
  const { chainId, chainName } = router.query
  if (chainId === ChainId.ETHEREUM.toString() && !chainName)
    router.replace({ pathname: '/info/eth', query: '' }, undefined, { shallow: true })
  else if (!chainName) router.replace({ pathname: '/info', query: '' }, undefined, { shallow: true })
  return <Overview />
}

InfoPage.Layout = InfoPageLayout

export default InfoPage
