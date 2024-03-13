import { memo } from 'react'
import { WormholeBridgeWidget } from '../components/WormHole/WormholeWidget'

function Wormhole() {
  return <WormholeBridgeWidget isAptos={false} />
}

export default memo(Wormhole)
