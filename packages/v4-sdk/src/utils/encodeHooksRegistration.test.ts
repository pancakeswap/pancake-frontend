import { expect, test } from 'vitest'
import { encodeHooksRegistration } from './encodeHooksRegistration'

test('encode hooks registration', () => {
  expect(encodeHooksRegistration()).toBe('0x0000')

  expect(
    encodeHooksRegistration({
      beforeInitialize: true,
    })
  ).toBe('0x0001')

  expect(
    encodeHooksRegistration({
      afterInitialize: true,
    })
  ).toBe('0x0002')

  expect(
    encodeHooksRegistration({
      beforeAddLiquidity: true,
    })
  ).toBe('0x0004')

  expect(
    encodeHooksRegistration({
      afterAddLiquidity: true,
    })
  ).toBe('0x0008')

  expect(
    encodeHooksRegistration({
      beforeRemoveLiquidity: true,
    })
  ).toBe('0x0010')

  expect(
    encodeHooksRegistration({
      afterRemoveLiquidity: true,
    })
  ).toBe('0x0020')

  expect(
    encodeHooksRegistration({
      beforeSwap: true,
    })
  ).toBe('0x0040')

  expect(
    encodeHooksRegistration({
      afterSwap: true,
    })
  ).toBe('0x0080')

  expect(
    encodeHooksRegistration({
      beforeDonate: true,
    })
  ).toBe('0x0100')

  expect(
    encodeHooksRegistration({
      afterDonate: true,
    })
  ).toBe('0x0200')
})
