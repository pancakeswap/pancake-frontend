import { expect, test } from 'vitest'
import { encodeBinPoolParameters, encodeCLPoolParameters } from './encodePoolParameters'

test('encode clPool params', () => {
  expect(
    encodeCLPoolParameters({
      tickSpacing: -4771792,
    })
  ).toBe('0x000000000000000000000000000000000000000000000000000000b730300000')

  expect(
    encodeCLPoolParameters({
      tickSpacing: 4771792,
    })
  ).toBe('0x00000000000000000000000000000000000000000000000000000048cfd00000')
  expect(
    encodeCLPoolParameters({
      tickSpacing: 10,
      hooksRegistration: {
        beforeSwap: true,
      },
    })
  ).toBe('0x00000000000000000000000000000000000000000000000000000000000a0040')
})

test('encode bin pool params', () => {
  expect(
    encodeBinPoolParameters({
      binStep: 65533,
    })
  ).toBe('0x00000000000000000000000000000000000000000000000000000000fffd0000')
})
