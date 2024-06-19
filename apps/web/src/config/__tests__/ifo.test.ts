import { getIfoConfig } from '@pancakeswap/ifos'
import { ChainId } from '@pancakeswap/sdk'

import { campaigns } from '@pancakeswap/achievements'

// TODO: multichain support
describe('Config IFOs', async () => {
  const ifos = await getIfoConfig(ChainId.BSC)
  it.each(ifos.map((ifo) => ifo.id))('IFO %s has an unique id', (id) => {
    const duplicates = ifos.filter((i) => id === i.id)
    expect(duplicates).toHaveLength(1)
  })
  it.each(ifos.map((ifo) => [ifo.id, ifo.address]))('IFO %s has an unique address', (id, address) => {
    const duplicates = ifos.filter((i) => address === i.address)
    expect(duplicates).toHaveLength(1)
  })
  it.each(ifos.map((ifo) => [ifo.id, ifo.campaignId]))('IFO %s has an unique campaign ID', (id, campaignId) => {
    const duplicates = ifos.filter((i) => campaignId === i.campaignId)
    expect(duplicates).toHaveLength(1)
  })
  it.each(ifos.map((ifo) => [ifo.id, ifo.campaignId]))('IFO %s has an existing campaign ID', (id, campaignId) => {
    const campaign = campaigns.find((c) => campaignId === c.id)
    expect(campaign).not.toBeUndefined()
  })
})
