import { InfoPageLayout } from 'views/Info'
import Overview from 'views/Info/Overview'
import { CHAIN_IDS } from '@pancakeswap/wagmi'

const MultiChainPage = () => {
  return <Overview />
}

MultiChainPage.Layout = InfoPageLayout
MultiChainPage.chains = CHAIN_IDS

export default MultiChainPage
