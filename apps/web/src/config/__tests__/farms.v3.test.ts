import { farmsV3Map } from '@pancakeswap/farms/constants/index.v3'
import { ChainId } from '@pancakeswap/sdk'
import { describe, it } from 'vitest'

const mainnetFarms = [farmsV3Map[ChainId.BSC], farmsV3Map[ChainId.ETHEREUM]]

function hasDuplicates(array: any[]) {
  return new Set(array).size !== array.length
}

describe('Config farms V3', () => {
  it.each(mainnetFarms)('All farm has an unique pid', (...farms) => {
    const pids = farms.map((farm) => farm.pid)
    expect(hasDuplicates(pids)).toBeFalsy()
  })

  it.each(mainnetFarms)('All tokens should be sorted', (...farms) => {
    expect(farms.every((f) => f.token0.sortsBefore(f.token1))).toBeTruthy()
  })

  it.todo('should has correct lpAddress')
  it.todo('should has related common price')
})
