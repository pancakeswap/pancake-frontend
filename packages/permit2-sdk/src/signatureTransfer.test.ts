import { describe, expect, it } from 'vitest'
import { MaxSigDeadline, MaxSignatureTransferAmount, MaxUnorderedNonce } from './constants'
import { SignatureTransfer } from './signatureTransfer'

describe('SignatureTransfer', () => {
  describe('Max values', () => {
    it('max values', () => {
      expect(() =>
        SignatureTransfer.hash(
          {
            permitted: {
              token: '0x0000000000000000000000000000000000000000',
              amount: MaxSignatureTransferAmount.toString(),
            },
            spender: '0x0000000000000000000000000000000000000000',
            nonce: MaxUnorderedNonce.toString(),
            deadline: MaxSigDeadline.toString(),
          },
          '0x0000000000000000000000000000000000000000',
          1,
        ),
      ).not.toThrow()
    })

    it('nonce out of range', () => {
      expect(() =>
        SignatureTransfer.hash(
          {
            permitted: {
              token: '0x0000000000000000000000000000000000000000',
              amount: '0',
            },
            spender: '0x0000000000000000000000000000000000000000',
            nonce: MaxUnorderedNonce + 1n,
            deadline: '0',
          },
          '0x0000000000000000000000000000000000000000',
          1,
        ),
      ).toThrow('NONCE_OUT_OF_RANGE')
    })

    it('amount out of range', () => {
      expect(() =>
        SignatureTransfer.hash(
          {
            permitted: {
              token: '0x0000000000000000000000000000000000000000',
              amount: MaxSignatureTransferAmount + 1n,
            },
            spender: '0x0000000000000000000000000000000000000000',
            nonce: '0',
            deadline: '0',
          },
          '0x0000000000000000000000000000000000000000',
          1,
        ),
      ).toThrow('AMOUNT_OUT_OF_RANGE')
    })

    it('deadline out of range', () => {
      expect(() =>
        SignatureTransfer.hash(
          {
            permitted: {
              token: '0x0000000000000000000000000000000000000000',
              amount: '0',
            },
            spender: '0x0000000000000000000000000000000000000000',
            nonce: '0',
            deadline: MaxSigDeadline + 1n,
          },
          '0x0000000000000000000000000000000000000000',
          1,
        ),
      ).toThrow('SIG_DEADLINE_OUT_OF_RANGE')
    })
  })

  it('non-batch, no witness', () => {
    expect(
      SignatureTransfer.hash(
        {
          permitted: {
            token: '0x0000000000000000000000000000000000000000',
            amount: '0',
          },
          spender: '0x0000000000000000000000000000000000000000',
          nonce: '0',
          deadline: '0',
        },
        '0x0000000000000000000000000000000000000000',
        1,
      ),
    ).toBe('0xb9bf9813799d7f0de28d2142b0bc80ec289d4a6a5b9f41834149df4188804dc5')
  })

  it('non-batch, witness', () => {
    expect(
      SignatureTransfer.hash(
        {
          permitted: {
            token: '0x0000000000000000000000000000000000000000',
            amount: '0',
          },
          spender: '0x0000000000000000000000000000000000000000',
          nonce: '0',
          deadline: '0',
        },
        '0x0000000000000000000000000000000000000000',
        1,
        {
          witnessTypeName: 'MockWitness',
          witnessType: { MockWitness: [{ name: 'mock', type: 'uint256' }] },
          witness: { mock: '0x0000000000000000000000000000000000000000000000000000000000000000' },
        },
      ),
    ).toBe('0x4236a4a7b3e8e65dbb4cc758ef10dc4887e2959853fb615140d0f5e0ae7be7c9')
  })

  it('batch, no witness', () => {
    expect(
      SignatureTransfer.hash(
        {
          permitted: [
            {
              token: '0x0000000000000000000000000000000000000000',
              amount: '0',
            },
          ],
          spender: '0x0000000000000000000000000000000000000000',
          nonce: '0',
          deadline: '0',
        },
        '0x0000000000000000000000000000000000000000',
        1,
      ),
    ).toBe('0x5ba40c5ba725fec181e4a862c717adf91682b012ad01ea99a978189106d66923')
  })

  it('batch, witness', () => {
    expect(
      SignatureTransfer.hash(
        {
          permitted: [
            {
              token: '0x0000000000000000000000000000000000000000',
              amount: '0',
            },
          ],
          spender: '0x0000000000000000000000000000000000000000',
          nonce: '0',
          deadline: '0',
        },
        '0x0000000000000000000000000000000000000000',
        1,
        {
          witnessTypeName: 'MockWitness',
          witnessType: { MockWitness: [{ name: 'mock', type: 'uint256' }] },
          witness: { mock: '0x0000000000000000000000000000000000000000000000000000000000000000' },
        },
      ),
    ).toBe('0xb45d605b0a4d4f16930a4f48294d94c78f34411278fd3133626cc190273e3ccf')
  })
})
