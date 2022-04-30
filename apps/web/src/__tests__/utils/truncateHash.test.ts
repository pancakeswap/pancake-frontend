import truncateHash from 'utils/truncateHash'

describe('truncateHash', () => {
  it.each([
    ['aaaaaaaaaaaaaaaabbbbbbbbbbbbbbbb', 'aaaa...bbbb', 4, 4],
    ['aaaaaaaaaaaaaaaabbbbbbbbbbbbbbbb', 'aaaaa...bbbb', 5, 4],
    ['aaaaaaaaaaaaaaaabbbbbbbbbbbbbbbb', 'a...bbbbb', 1, 5],
    ['aaaaaaaaaaaaaaaabbbbbbbbbbbbbbbb', 'aaaaaa...b', 6, 1],
    ['aaaaaaaaaaaaaaaabbbbbbbbbbbbbbbb', 'aaaaaaaa...bbbbbbbb', 8, 8],
  ])('truncates "%s" to "%s" correctly', (address, expected, startLength, endLength) => {
    expect(truncateHash(address, startLength, endLength)).toEqual(expected)
  })

  it('formats address with default lengths of 4', () => {
    expect(truncateHash('a1a2a3a4a5a6a7a8n1n2n3n4n5n6n7n8')).toEqual('a1a2...n7n8')
    expect(truncateHash('cacacacacacacacaxzxzxzxzxzxzxzxz', 5)).toEqual('cacac...xzxz')
    expect(truncateHash('cacacacacacacacaxzxzxzxzxzxzxzxz', undefined, 9)).toEqual('caca...zxzxzxzxz')
  })
})
