import { BigintIsh } from '@pancakeswap/sdk'
import { TickList } from '../utils/tickList'
import { Tick, TickConstructorArgs } from './tick'
import { TickDataProvider } from './tickDataProvider'

/**
 * A data provider for ticks that is backed by an in-memory array of ticks.
 */
export class TickListDataProvider implements TickDataProvider {
  private ticks: readonly Tick[]

  constructor(ticks: (Tick | TickConstructorArgs)[]) {
    const ticksMapped: Tick[] = ticks.map((t) => (t instanceof Tick ? t : new Tick(t)))
    // TickList.validateList(ticksMapped, tickSpacing)
    this.ticks = ticksMapped
  }

  async getTick(tick: number): Promise<{ liquidityNet: BigintIsh; liquidityGross: BigintIsh }> {
    return TickList.getTick(this.ticks, tick)
  }

  async nextInitializedTickWithinOneWord(tick: number, lte: boolean, tickSpacing: number): Promise<[number, boolean]> {
    return TickList.nextInitializedTickWithinOneWord(this.ticks, tick, lte, tickSpacing)
  }
}
