import { memo } from 'react'
import { WormholeBridgeWidget } from '../components/WormHole/WormholeWidget'

function WormholeAptos() {
  return <WormholeBridgeWidget isAptos />
}

export default memo(WormholeAptos)
