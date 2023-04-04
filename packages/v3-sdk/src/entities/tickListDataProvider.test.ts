// import JSBI from 'jsbi'
// import { TickListDataProvider } from './tickListDataProvider'
import { describe } from 'vitest'

describe.skip('TickListDataProvider', () => {
  // describe('constructor', () => {
  //   it('can take an empty list of ticks', () => {
  //     new TickListDataProvider([], 1)
  //   })
  //   it('throws for 0 tick spacing', () => {
  //     expect(() => new TickListDataProvider([], 0)).toThrow('TICK_SPACING_NONZERO')
  //   })
  //   it('throws for uneven tick list', async () => {
  //     await expect(
  //       () =>
  //         new TickListDataProvider(
  //           [
  //             { index: -1, liquidityNet: -1, liquidityGross: 1 },
  //             { index: 1, liquidityNet: 2, liquidityGross: 1 },
  //           ],
  //           1
  //         )
  //     ).toThrow('ZERO_NET')
  //   })
  // })
  // describe('#getTick', () => {
  //   it('throws if tick not in list', async () => {
  //     const provider = new TickListDataProvider(
  //       [
  //         { index: -1, liquidityNet: -1, liquidityGross: 1 },
  //         { index: 1, liquidityNet: 1, liquidityGross: 1 },
  //       ],
  //       1
  //     )
  //     await expect(provider.getTick(0)).rejects.toThrow('NOT_CONTAINED')
  //   })
  //   it('gets the smallest tick from the list', async () => {
  //     const provider = new TickListDataProvider(
  //       [
  //         { index: -1, liquidityNet: -1, liquidityGross: 1 },
  //         { index: 1, liquidityNet: 1, liquidityGross: 1 },
  //       ],
  //       1
  //     )
  //     const { liquidityNet, liquidityGross } = await provider.getTick(-1)
  //     expect(liquidityNet).toEqual(JSBI.BigInt(-1))
  //     expect(liquidityGross).toEqual(JSBI.BigInt(1))
  //   })
  //   it('gets the largest tick from the list', async () => {
  //     const provider = new TickListDataProvider(
  //       [
  //         { index: -1, liquidityNet: -1, liquidityGross: 1 },
  //         { index: 1, liquidityNet: 1, liquidityGross: 1 },
  //       ],
  //       1
  //     )
  //     const { liquidityNet, liquidityGross } = await provider.getTick(1)
  //     expect(liquidityNet).toEqual(JSBI.BigInt(1))
  //     expect(liquidityGross).toEqual(JSBI.BigInt(1))
  //   })
  // })
})
