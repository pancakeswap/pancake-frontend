export type BridgeDisclaimerConfig = {
  id: string
  title: BridgeIds
}

export enum BridgeIds {
  STARTGATE = 'Stargate',
  ALEXAR = 'Alexar',
  WORMHOLE = 'Wormhole',
}

export const BridgeDisclaimerConfigs: { [bridge in BridgeIds]: BridgeDisclaimerConfig } = {
  [BridgeIds.STARTGATE]: {
    id: 'stargate-risk-disclaimer',
    title: BridgeIds.STARTGATE,
  },
  [BridgeIds.ALEXAR]: {
    id: 'alexar-risk-disclaimer',
    title: BridgeIds.ALEXAR,
  },
  [BridgeIds.WORMHOLE]: {
    id: 'wormhole-risk-disclaimer',
    title: BridgeIds.WORMHOLE,
  },
}
