import { Hex, toBytes, toHex } from 'viem'

export function splitSignature(signature: Hex) {
  const bytes = toBytes(signature)
  if (bytes.length !== 65) {
    throw new Error('Invalid signature length')
  }
  let v = bytes[64]
  if (v < 27) {
    if (v === 0 || v === 1) {
      v += 27
    } else {
      throw new Error('Invalid signature v value')
    }
  }
  return {
    r: toHex(bytes.slice(0, 32)),
    s: toHex(bytes.slice(32, 64)),
    v,
  }
}
