import { CHAIN_IDS } from 'utils/wagmi'
import FixedStaking from 'views/FixedStaking'

const FixedStakingPage = () => {
  return <FixedStaking />
}

FixedStakingPage.chains = CHAIN_IDS

export default FixedStakingPage
