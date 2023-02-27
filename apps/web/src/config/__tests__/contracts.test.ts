import map from 'lodash/map'
import filter from 'lodash/filter'
import contracts from 'config/constants/contracts'

describe('Config contracts', () => {
  it.each(map(contracts, (contract, key) => [key, contract]))('Contract %s has a unique address', (key, contract) => {
    const duplicates = filter(contracts, (c) => contract[56] === c[56])
    expect(duplicates).toHaveLength(1)
  })
})
