import { BigNumber } from '@ethersproject/bignumber'
import { MaxUint48, MaxUint160, MaxUint256, InstantExpiration } from './constants'

describe('Constants', () => {
  it('MaxUint256', () => {
    expect(MaxUint256).toEqual(BigNumber.from(2).pow(256).sub(1))
  })

  it('MaxUint160', () => {
    expect(MaxUint160).toEqual(BigNumber.from(2).pow(160).sub(1))
  })

  it('MaxUint48', () => {
    expect(MaxUint48).toEqual(BigNumber.from(2).pow(48).sub(1))
  })

  it('InstantExpiration', () => {
    expect(InstantExpiration).toEqual(BigNumber.from(0))
  })
})
