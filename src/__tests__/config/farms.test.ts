import farms from 'config/constants/farms'

describe('Config farms', () => {
  it.each(farms.map((farm) => farm.pid))('Farm #%d has an unique pid', (pid) => {
    const duplicates = farms.filter((f) => pid === f.pid)
    expect(duplicates).toHaveLength(1)
  })
  it.each(farms.map((farm) => farm.lpAddresses))('Farm #%d has an unique address', (lpAddresses) => {
    const duplicates = farms.filter((f) => lpAddresses === f.lpAddresses)
    expect(duplicates).toHaveLength(1)
  })
})
