import {
  AllowanceTransfer,
  PermitSingle,
  MaxAllowanceExpiration,
  MaxAllowanceTransferAmount,
} from '@pancakeswap/permit2-sdk'
import { Hex, type Address, type WalletClient, hexToSignature, toBytes, concat, toHex } from 'viem'

const TEST_DEADLINE = MaxAllowanceExpiration

export const makePermit = (
  token: Address,
  // as spender
  routerAddress: Address,
  amount: string = MaxAllowanceTransferAmount.toString(),
  nonce = 0,
): PermitSingle => {
  return {
    details: {
      token,
      amount,
      expiration: TEST_DEADLINE,
      nonce,
    },
    spender: routerAddress,
    sigDeadline: TEST_DEADLINE,
  }
}

export const signPermit = async (permit: PermitSingle, wallet: WalletClient, permit2Address: Address): Promise<Hex> => {
  const chainId = wallet.chain?.id

  if (!chainId) throw Error('no chainId found')

  const { domain, types, values } = AllowanceTransfer.getPermitData(permit, permit2Address, chainId)

  return wallet.signTypedData({
    account: wallet.account!,
    domain,
    types,
    primaryType: 'PermitSingle',
    message: values,
  })
}

export const signEIP2098Permit = async (permit: PermitSingle, wallet: WalletClient, permit2Address: Address) => {
  const chainId = wallet.chain?.id

  if (!chainId) throw Error('no chainId found')

  const sig = await signPermit(permit, wallet, permit2Address)
  const signature = hexToSignature(sig)
  const yParity = BigInt(signature.v) === 27n ? 0 : 1
  const yParityAndS = toBytes(signature.s)
  // eslint-disable-next-line no-bitwise
  if (yParity) yParityAndS[0] |= 0x80
  return concat([signature.r, toHex(yParityAndS)])
}
