import { createClient } from '@pancakeswap/awgmi'
import { getDefaultProviders, MartianConnector, PetraConnector } from '@pancakeswap/awgmi/core'

export const client = createClient({
  // @ts-ignore not sure why it starts type error lol
  connectors: [new PetraConnector(), new MartianConnector()],
  provider: getDefaultProviders,
  autoConnect: true,
})
