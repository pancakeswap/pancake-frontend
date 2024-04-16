import dayjs from 'dayjs'
import {
  getContract,
  type Address,
  type GetContractReturnType,
  type MulticallReturnType,
  type PublicClient,
} from 'viem'
import { orderQuoterAbi } from '../abi/OrderQuoter'
import { ORDER_QUOTER_MAPPING, type XSupportedChainId } from '../constants'
import { KNOWN_ERRORS, MissingConfiguration, OrderValidation } from '../errors'
import type { ResolvedOrder, SignedOrder } from '../orders/Order'
import { NonceManager } from './NonceManager'

export type OrderQuote = {
  validation: OrderValidation
  // not specified if validation is not OK
  quote: ResolvedOrder | undefined
}

export class OrderQuoter {
  private contract: GetContractReturnType<typeof orderQuoterAbi, { public: PublicClient }>

  constructor(private client: PublicClient, private chainId: XSupportedChainId, orderQuoterAddress?: Address) {
    if (orderQuoterAddress) {
      this.contract = getContract({
        address: orderQuoterAddress,
        abi: orderQuoterAbi,
        client: {
          public: client,
        },
      })
    } else if (ORDER_QUOTER_MAPPING[chainId]) {
      this.contract = getContract({
        address: ORDER_QUOTER_MAPPING[chainId],
        abi: orderQuoterAbi,
        client: {
          public: client,
        },
      })
    } else {
      throw new MissingConfiguration('orderQuoter', chainId.toString())
    }
  }

  async quote(order: SignedOrder): Promise<OrderQuote> {
    return (await this.quoteBatch([order]))[0]
  }

  async quoteBatch(orders: SignedOrder[]): Promise<OrderQuote[]> {
    const calls = orders.map((order) => {
      return [order.order.encode(), order.signature] as const
    })

    const results = await this.client.multicall({
      contracts: calls.map(
        (call) =>
          ({
            abi: this.contract.abi,
            address: this.contract.address,
            functionName: 'quote',
            args: call,
          } as const),
      ),
      allowFailure: true,
    })

    const validations = await this.getValidations(orders, results)

    return results.map(({ status, result }, i) => {
      if (status === 'failure') {
        return {
          validation: validations[i],
          quote: undefined,
        }
      }

      return {
        validation: validations[i],
        quote: {
          input: result.input,
          outputs: [...result.outputs],
          sig: result.sig,
          hash: result.hash,
          info: result.info,
        },
      }
    })
  }

  private async getValidations(orders: SignedOrder[], results: MulticallReturnType): Promise<OrderValidation[]> {
    const validations = results.map((result) => {
      if (result.status === 'success') {
        return OrderValidation.OK
      }
      const error = result.error.message

      for (const key of Object.keys(KNOWN_ERRORS)) {
        if (error.includes(key)) {
          // if (key === "0a0b0d79") {
          //   const fillerValidation = parseExclusiveFillerData(
          //       orders[idx].order.info.additionalValidationData
          //   );
          //   if (
          //       fillerValidation.type === ValidationType.ExclusiveFiller &&
          //       fillerValidation.data.filler !== ethers.constants.AddressZero
          //   ) {
          //     return OrderValidation.ExclusivityPeriod;
          //   }
          //   return OrderValidation.ValidationFailed;
          // }
          return KNOWN_ERRORS[key]
        }
      }
      return OrderValidation.UnknownError
    })

    return this.checkNonceOrDateExpiry(orders, validations)
  }

  // The quoter contract has a quirk that make validations inaccurate:
  // - checks expiry before anything else, so old but already filled orders will return as expired
  // so this function takes orders in expired state and double checks them
  private async checkNonceOrDateExpiry(
    orders: SignedOrder[],
    validations: OrderValidation[],
  ): Promise<OrderValidation[]> {
    return Promise.all(
      validations.map(async (validation, i) => {
        const order = orders[i]
        if (validation === OrderValidation.Expired || dayjs().isAfter(dayjs.unix(Number(order.order.info.deadline)))) {
          const nonceManager = new NonceManager(this.client, this.chainId)
          const signer = await nonceManager.getSigner(order)
          const nonceUsed = await nonceManager.isUsed(signer, order.order.info.nonce)
          return nonceUsed ? OrderValidation.NonceUsed : OrderValidation.Expired
        }
        return validation
      }),
    )
  }
}
