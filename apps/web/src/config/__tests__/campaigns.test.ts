import { campaigns } from '@pancakeswap/achievements'

describe('Config campaigns', () => {
  it.each(campaigns.map((campaign) => campaign.id))('Campaign #%d has an unique id', (id) => {
    const duplicates = campaigns.filter((c) => id === c.id)
    expect(duplicates).toHaveLength(1)
  })
})
