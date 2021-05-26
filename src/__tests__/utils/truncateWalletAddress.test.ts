import truncateWalletAddress from 'utils/truncateWalletAddress'

describe('truncateWalletAddress', () => {
  it.each([
    ['aaaaaaaaaaaaaaaabbbbbbbbbbbbbbbb', 'aaaa...bbbb', 4, 4],
    ['aaaaaaaaaaaaaaaabbbbbbbbbbbbbbbb', 'aaaaa...bbbb', 5, 4],
    ['aaaaaaaaaaaaaaaabbbbbbbbbbbbbbbb', 'a...bbbbb', 1, 5],
    ['aaaaaaaaaaaaaaaabbbbbbbbbbbbbbbb', 'aaaaaa...b', 6, 1],
    ['aaaaaaaaaaaaaaaabbbbbbbbbbbbbbbb', 'aaaaaaaa...bbbbbbbb', 8, 8],
  ])('truncates "%s" to "%s" correctly', (address, expected, startLength, endLength) => {
    expect(truncateWalletAddress(address, startLength, endLength)).toEqual(expected)
  })

  it('formats address with default lengths of 4', () => {
    expect(truncateWalletAddress('a1a2a3a4a5a6a7a8n1n2n3n4n5n6n7n8')).toEqual('a1a2...n7n8')
    expect(truncateWalletAddress('cacacacacacacacaxzxzxzxzxzxzxzxz', 5)).toEqual('cacac...xzxz')
    expect(truncateWalletAddress('cacacacacacacacaxzxzxzxzxzxzxzxz', undefined, 9)).toEqual('caca...zxzxzxzxz')
  })
})
