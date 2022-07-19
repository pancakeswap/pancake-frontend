import { mainnetTokens } from 'config/constants/tokens'
import IfoContainer from './components/IfoContainer'
import IfoSteps from './components/IfoSteps'
import ComingSoonSection from './components/ComingSoonSection'

const SoonIfo = () => (
  <IfoContainer
    ifoSection={<ComingSoonSection />}
    ifoSteps={
      <IfoSteps isLive={false} hasClaimed={false} isCommitted={false} ifoCurrencyAddress={mainnetTokens.cake.address} />
    }
  />
)

export default SoonIfo
