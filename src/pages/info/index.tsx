import { InfoPageLayout } from 'views/Info'
import Overview from 'views/Info/Overview'

const InfoPage = () => {
  return <Overview />
}

InfoPage.Layout = InfoPageLayout
InfoPage.chains = [] // set all

export default InfoPage
