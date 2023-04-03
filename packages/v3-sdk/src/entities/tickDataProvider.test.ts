import { NoTickDataProvider } from './tickDataProvider'

describe('TickDataProvider', () => {
  describe('NoTickDataProvider', () => {
    const provider = new NoTickDataProvider()
    it('throws on getTick', () => {
      expect(provider.getTick(0)).rejects.toThrow('No tick data provider was given')
    })
    it('throws on nextInitializedTickWithinOneWord', () => {
      expect(provider.nextInitializedTickWithinOneWord(0, false, 1)).rejects.toThrow('No tick data provider was given')
    })
  })
})
