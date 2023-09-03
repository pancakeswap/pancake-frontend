import fs from 'fs'
import { hexToDecimalString } from '../utils/hexToDecimalString'
import { MethodParameters } from '@uniswap/v3-sdk'

const INTEROP_FILE = './test/forge/interop.json'

// updates the interop file with a new fixture
export function registerFixture(key: string, data: MethodParameters) {
  let interop: { [key: string]: any } = fs.existsSync(INTEROP_FILE)
    ? JSON.parse(fs.readFileSync(INTEROP_FILE).toString())
    : {}

  interop[key] = {
    calldata: data.calldata,
    value: hexToDecimalString(data.value),
  }
  fs.writeFileSync(INTEROP_FILE, JSON.stringify(interop, null, 2))
}
