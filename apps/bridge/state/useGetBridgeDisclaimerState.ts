import { BridgeIds } from 'components/GeneralDisclaimerModal/config'
import { useAcceptAlexarDisclaimer } from './alexar/useAlexarDisclaimer'
import { useAcceptStargateDisclaimer } from './stargate/useStargateDisclaimer'
import { useAcceptWormholeDisclaimer } from './wormhole/useWormholeDisclaimer'

const BridgeIdToDisclaimerState = {
  [BridgeIds.STARTGATE]: useAcceptStargateDisclaimer,
  [BridgeIds.ALEXAR]: useAcceptAlexarDisclaimer,
  [BridgeIds.WORMHOLE]: useAcceptWormholeDisclaimer,
}

export const useGetBridgeDisclaimerState = (bridgeId: BridgeIds) => {
  const bridgeDosclaimerState = BridgeIdToDisclaimerState[bridgeId]()
  return bridgeDosclaimerState
}
