import type { PermitTransferFrom, PermitTransferFromData, Witness } from '@pancakeswap/permit2-sdk'
import type { Address, Hex } from 'viem'
import type { XSupportedChainId } from '../constants'

export const OrderInfoStruct =
  'struct OrderInfo {address reactor; address swapper; uint256 nonce; uint256 deadline; address additionalValidationContract; bytes additionalValidationData; }'

export type OrderInfo = {
  reactor: Address
  swapper: Address
  nonce: bigint
  deadline: bigint
  additionalValidationContract: Address
  additionalValidationData: Hex
}

export type TokenAmount = {
  readonly token: string
  readonly amount: bigint
}

export type SignedOrder = {
  order: Order
  signature: Hex
}

export interface ResolvedOrder {
  input: TokenAmount
  outputs: TokenAmount[]
  info: OrderInfo
  sig: Hex
  hash: Hex
}

export abstract class Order {
  // TODO: maybe add generic types for more order-type specific info
  abstract info: OrderInfo

  // expose the chainid
  abstract chainId: XSupportedChainId

  // TODO: maybe add generic order info getters, i.e.
  // affectedTokens, validTimes, max amounts?
  // not yet sure what is useful / generic here

  /**
   * Returns the abi encoded order
   * @return The abi encoded serialized order which can be submitted on-chain
   */
  abstract encode(): Hex

  /**
   * Returns the witness for permit2
   * @return The witness
   */
  abstract witness(): Witness
  // /**
  //  * Recovers the given signature, returning the address which created it
  //  *  * @param signature The signature to recover
  //  *  * @returns address The address which created the signature
  //  */
  // abstract getSigner(signature: SignatureLike): string;

  /**
   * Returns the json for permit2 transfer details
   * @return The json for permit2 transfer details
   */
  abstract toPermit(): PermitTransferFrom

  /**
   * Returns the data for generating the maker EIP-712 permit signature
   * @return The data for generating the maker EIP-712 permit signature
   */
  abstract permitData(): PermitTransferFromData

  /**
   * Returns the order hash
   * @return The order hash which is used as a key on-chain
   */
  abstract hash(): Hex

  // /**
  //  * Returns the resolved order with the given options
  //  * @return The resolved order
  //  */
  // abstract resolve(options: OrderResolutionOptions): ResolvedOrder;
  //
  // /**
  //  * Returns the parsed validation
  //  * @return The parsed validation data for the order
  //  */
  // get validation(): CustomOrderValidation {
  //     return parseValidation(this.info);
  // }
}
