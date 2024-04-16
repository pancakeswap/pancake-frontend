import { SignatureTransfer, Permit2ABI as permit2Abi } from '@pancakeswap/permit2-sdk'
import {
  getContract,
  recoverAddress,
  type Address,
  type GetContractReturnType,
  type Hex,
  type PublicClient,
} from 'viem'
import { PERMIT2_MAPPING, type XSupportedChainId } from '../constants'
import { MissingConfiguration } from '../errors'
import type { SignedOrder } from '../orders/Order'

type SplitNonce = {
  word: bigint
  bitPos: bigint
}
export class NonceManager {
  private contract: GetContractReturnType<typeof permit2Abi, { public: PublicClient }>

  constructor(client: PublicClient, private chainId: XSupportedChainId, permit2Address?: Address) {
    if (permit2Address) {
      this.contract = getContract({
        address: permit2Address,
        abi: permit2Abi,
        client: {
          public: client,
        },
      })
    } else if (PERMIT2_MAPPING[chainId]) {
      this.contract = getContract({
        address: PERMIT2_MAPPING[chainId]!,
        abi: permit2Abi,
        client: {
          public: client,
        },
      })
    } else {
      throw new MissingConfiguration('permit2', chainId.toString())
    }
  }

  async getSigner(order: SignedOrder): Promise<Address> {
    return recoverAddress({
      signature: order.signature,
      hash: SignatureTransfer.hash(
        order.order.toPermit(),
        this.contract.address,
        this.chainId,
        order.order.witness(),
      ) as Hex,
    })
  }

  async isUsed(address: Address, nonce: bigint): Promise<boolean> {
    const { word, bitPos } = NonceManager.splitNonce(nonce)
    const bitmap = await this.contract.read.nonceBitmap([address, word])
    return (bitmap / (2n * bitPos)) % 2n === 1n
  }

  static splitNonce(nonce: bigint): SplitNonce {
    const word = nonce / 256n
    const bitPos = nonce % 256n
    return { word, bitPos }
  }
}
