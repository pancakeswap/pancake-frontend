import { createClient } from '@pancakeswap/awgmi'
import { getDefaultProviders, MartianConnector, PetraConnector } from '@pancakeswap/awgmi/core'

export const client = createClient({
  connectors: [new PetraConnector(), new MartianConnector()],
  provider: getDefaultProviders,
  autoConnect: true,
})
