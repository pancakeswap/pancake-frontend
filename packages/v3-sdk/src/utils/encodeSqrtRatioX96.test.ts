import { describe, it, expect } from 'vitest'
import { Q96 } from '../internalConstants'
import { encodeSqrtRatioX96 } from './encodeSqrtRatioX96'

describe('#encodeSqrtRatioX96', () => {
  it('1/1', () => {
    expect(encodeSqrtRatioX96(1, 1)).toEqual(Q96)
  })

  it('100/1', () => {
    expect(encodeSqrtRatioX96(100, 1)).toEqual(792281625142643375935439503360n)
  })

  it('1/100', () => {
    expect(encodeSqrtRatioX96(1, 100)).toEqual(7922816251426433759354395033n)
  })

  it('111/333', () => {
    expect(encodeSqrtRatioX96(111, 333)).toEqual(45742400955009932534161870629n)
  })

  it('333/111', () => {
    expect(encodeSqrtRatioX96(333, 111)).toEqual(137227202865029797602485611888n)
  })
})
