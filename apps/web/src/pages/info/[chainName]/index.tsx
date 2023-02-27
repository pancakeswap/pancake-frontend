import { InfoPageLayout } from 'views/Info'
import Overview from 'views/Info/Overview'

const MultiChainPage = () => {
  return <Overview />
}

MultiChainPage.Layout = InfoPageLayout
MultiChainPage.chains = []

export default MultiChainPage
