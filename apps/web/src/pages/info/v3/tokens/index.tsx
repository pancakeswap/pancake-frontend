import Token from 'views/V3Info/views/TokensPage'
import { InfoPageLayout } from 'views/V3Info/components/Layout'

const TokenPage = () => {
  return <Token />
}

TokenPage.Layout = InfoPageLayout
TokenPage.chains = [] // set all

export default TokenPage
