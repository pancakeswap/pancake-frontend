import Pools from 'views/Info/Pools'
import { InfoPageLayout } from 'views/Info'
import { CHAIN_IDS } from '@pancakeswap/wagmi'

const InfoPoolsPage = () => {
  return <Pools />
}

InfoPoolsPage.Layout = InfoPageLayout
InfoPoolsPage.chains = CHAIN_IDS

export default InfoPoolsPage
