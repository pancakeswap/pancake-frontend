import { ChainId } from '@pancakeswap/chains'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import AnniversaryAchievementModal from './AnniversaryAchievementModal'
import V3AirdropModal from './V3AirdropModal'

interface GlobalCheckClaimStatusProps {
  excludeLocations: string[]
}

// change it to true if we have events to check claim status
const enable = true

const GlobalCheckClaimStatus: React.FC<React.PropsWithChildren<GlobalCheckClaimStatusProps>> = (props) => {
  const { account, chainId } = useAccountActiveChain()
  if (!enable || chainId !== ChainId.BSC || !account) {
    return null
  }
  return <GlobalCheckClaim key={account} {...props} />
}

/**
 * This is represented as a component rather than a hook because we need to keep it
 * inside the Router.
 *
 * TODO: Put global checks in redux or make a generic area to house global checks
 */

const GlobalCheckClaim: React.FC<React.PropsWithChildren<GlobalCheckClaimStatusProps>> = ({ excludeLocations }) => {
  return (
    <>
      <AnniversaryAchievementModal excludeLocations={excludeLocations} />
      <V3AirdropModal />
    </>
  )
}

export default GlobalCheckClaimStatus
