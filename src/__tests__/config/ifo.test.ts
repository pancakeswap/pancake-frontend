import ifos from 'config/constants/ifo'
import campaigns from 'config/constants/campaigns'

describe('Config IFOs', () => {
  it.each(ifos.map((ifo) => ifo.id))('IFO #%d has an unique id', (id) => {
    const duplicates = ifos.filter((i) => id === i.id)
    expect(duplicates).toHaveLength(1)
  })
  it.each(ifos.map((ifo) => [ifo.id, ifo.address]))('IFO #%d has an unique address', (id, address) => {
    const duplicates = ifos.filter((i) => address === i.address)
    expect(duplicates).toHaveLength(1)
  })
  it.each(ifos.map((ifo) => [ifo.id, ifo.campaignId]))('IFO #%d has an unique campaign ID', (id, campaignId) => {
    const duplicates = ifos.filter((i) => campaignId === i.campaignId)
    expect(duplicates).toHaveLength(1)
  })
  it.each(ifos.map((ifo) => [ifo.id, ifo.campaignId]))('IFO #%d has an existing campaign ID', (id, campaignId) => {
    const campaign = campaigns.find((c) => campaignId === c.id)
    expect(campaign).not.toBeUndefined()
  })
})
