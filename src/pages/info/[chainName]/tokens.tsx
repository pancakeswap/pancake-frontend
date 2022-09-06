import Tokens from 'views/Info/Tokens'
import { InfoPageLayout } from 'views/Info'
import { CHAIN_IDS } from '@pancakeswap/wagmi'

const InfoTokensPage = () => {
  return <Tokens />
}

InfoTokensPage.Layout = InfoPageLayout
InfoTokensPage.chains = CHAIN_IDS

export default InfoTokensPage
