import { HexString } from 'aptos'

export default function convertStructTagToAddress(structTag: string): string {
  try {
    // Type args are not supported in string literal
    if (structTag.includes('<')) {
      throw new Error('Not implemented')
    }

    const parts = structTag.split('::')
    if (parts.length !== 3) {
      throw new Error('Invalid struct tag string literal.')
    }

    return new HexString(parts[0]).hex()
  } catch (err) {
    return structTag
  }
}
