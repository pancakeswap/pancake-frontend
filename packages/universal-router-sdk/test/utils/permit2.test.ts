import { expect } from 'chai'
import { BigNumber, utils, Wallet } from 'ethers'
import { PermitSingle } from '@uniswap/permit2-sdk'
import { defaultAbiCoder } from 'ethers/lib/utils'
import { encodePermit } from '../../src/utils/inputTokens'
import { RoutePlanner } from '../../src/utils/routerCommands'
import { USDC } from './uniswapData'
import { generatePermitSignature, makePermit } from './permit2'

const PERMIT_STRUCT =
  '((address token,uint160 amount,uint48 expiration,uint48 nonce) details, address spender, uint256 sigDeadline)'

// note: these tests aren't testing much but registering calldata to interop file
// for use in forge fork tests
describe('Permit2', () => {
  const wallet = new Wallet(utils.zeroPad('0x1234', 32))

  describe('v2', () => {
    it('does not sanitize a normal permit', async () => {
      const inputUSDC = utils.parseUnits('1000', 6).toString()
      const permit = makePermit(USDC.address, inputUSDC)
      const signature = await generatePermitSignature(permit, wallet, 1)
      const sanitized = getSanitizedSignature(permit, signature)
      expect(sanitized).to.equal(signature)
    })

    it('does not sanitize a triple length permit', async () => {
      const inputUSDC = utils.parseUnits('1000', 6).toString()
      const permit = makePermit(USDC.address, inputUSDC)
      const signature = await generatePermitSignature(permit, wallet, 1)
      const multisigSignature = signature + signature.slice(2) + signature.slice(2)
      const sanitized = getSanitizedSignature(permit, multisigSignature)
      expect(sanitized).to.equal(multisigSignature)
    })

    it('does not sanitize a short permit', async () => {
      const inputUSDC = utils.parseUnits('1000', 6).toString()
      const permit = makePermit(USDC.address, inputUSDC)
      const tinySignature = '0x12341234132412341344'
      const sanitized = getSanitizedSignature(permit, tinySignature)
      expect(sanitized).to.equal(tinySignature)
    })

    it('sanitizes a malformed permit', async () => {
      const inputUSDC = utils.parseUnits('1000', 6).toString()
      const permit = makePermit(USDC.address, inputUSDC)
      const originalSignature = await generatePermitSignature(permit, wallet, 1)

      const { recoveryParam } = utils.splitSignature(originalSignature)
      // slice off current v
      let signature = originalSignature.substring(0, originalSignature.length - 2)
      // append recoveryParam as v
      signature += BigNumber.from(recoveryParam).toHexString().slice(2)
      const sanitized = getSanitizedSignature(permit, signature)
      expect(sanitized).to.equal(originalSignature)
    })
  })

  function getSanitizedSignature(permit: PermitSingle, signature: string): string {
    const planner = new RoutePlanner()
    encodePermit(planner, Object.assign({}, permit, { signature: signature }))
    const decoded = defaultAbiCoder.decode([PERMIT_STRUCT, 'bytes'], planner.inputs[0])
    return decoded[1]
  }
})
