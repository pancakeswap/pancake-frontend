import farms from 'config/constants/farms'

describe('Config farms', () => {
  it.each(farms.map((farm) => farm.pid))('Farm #%d has an unique pid', (pid) => {
    const duplicates = farms.filter((f) => pid === f.pid)
    expect(duplicates).toHaveLength(1)
  })
  it.each(farms.map((farm) => [farm.pid, farm.lpAddresses]))('Farm #%d has an unique address', (pid, lpAddresses) => {
    const duplicates = farms.filter((f) => lpAddresses[56] === f.lpAddresses[56])
    expect(duplicates).toHaveLength(1)
  })
})
