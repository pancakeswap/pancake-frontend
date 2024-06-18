import {
  SignatureTransfer,
  type PermitTransferFrom,
  type PermitTransferFromData,
  type Witness,
} from '@pancakeswap/permit2-sdk'
import { decodeAbiParameters, encodeAbiParameters, parseAbiParameters, type Address, type Hex } from 'viem'
import { PERMIT2_MAPPING, type XSupportedChainId } from '../constants'
import { MissingConfiguration } from '../errors'
import { hashStruct } from '../utils/hashStruct'
import { Order, type OrderInfo } from './Order'

export type DutchOutput = {
  readonly token: Address
  readonly startAmount: bigint
  readonly endAmount: bigint
  readonly recipient: Address
}

export type DutchInput = {
  readonly token: Address
  readonly startAmount: bigint
  readonly endAmount: bigint
}

export type ExclusiveDutchOrderInfo = OrderInfo & {
  decayStartTime: bigint
  decayEndTime: bigint
  exclusiveFiller: Address
  exclusivityOverrideBps: bigint
  input: DutchInput
  outputs: DutchOutput[]
}

type ChangeBigIntToString<T extends object> = {
  [key in keyof T]: T[key] extends bigint ? string : T[key]
}

export type ExclusiveDutchOrderInfoJSON = ChangeBigIntToString<ExclusiveDutchOrderInfo>

export type WitnessInfo = {
  info: OrderInfo
  decayStartTime: bigint
  decayEndTime: bigint
  exclusiveFiller: Address
  exclusivityOverrideBps: bigint
  inputToken: Address
  inputStartAmount: bigint
  inputEndAmount: bigint
  outputs: DutchOutput[]
}

const EXCLUSIVE_DUTCH_ORDER_TYPES = {
  ExclusiveDutchOrder: [
    { name: 'info', type: 'OrderInfo' },
    { name: 'decayStartTime', type: 'uint256' },
    { name: 'decayEndTime', type: 'uint256' },
    { name: 'exclusiveFiller', type: 'address' },
    { name: 'exclusivityOverrideBps', type: 'uint256' },
    { name: 'inputToken', type: 'address' },
    { name: 'inputStartAmount', type: 'uint256' },
    { name: 'inputEndAmount', type: 'uint256' },
    { name: 'outputs', type: 'DutchOutput[]' },
  ],
  OrderInfo: [
    { name: 'reactor', type: 'address' },
    { name: 'swapper', type: 'address' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' },
    { name: 'additionalValidationContract', type: 'address' },
    { name: 'additionalValidationData', type: 'bytes' },
  ],
  DutchOutput: [
    { name: 'token', type: 'address' },
    { name: 'startAmount', type: 'uint256' },
    { name: 'endAmount', type: 'uint256' },
    { name: 'recipient', type: 'address' },
  ],
}

const EXCLUSIVE_DUTCH_ORDER_ABI = parseAbiParameters([
  '((address,address,uint256,uint256,address,bytes),uint256,uint256,address,uint256,(address,uint256,uint256),(address,uint256,uint256,address)[])',
])

export class ExclusiveDutchOrder extends Order {
  public permit2Address: Address | undefined

  constructor(
    public readonly info: ExclusiveDutchOrderInfo,
    public readonly chainId: XSupportedChainId,
    readonly _permit2Address?: Address,
  ) {
    super()
    if (_permit2Address) {
      this.permit2Address = _permit2Address
    } else if (PERMIT2_MAPPING[chainId]) {
      this.permit2Address = PERMIT2_MAPPING[chainId]
    } else {
      throw new MissingConfiguration('permit2', chainId.toString())
    }
  }

  static fromJSON(info: ExclusiveDutchOrderInfoJSON, chainId: number, _permit2Address?: Address): ExclusiveDutchOrder {
    return new ExclusiveDutchOrder(
      {
        ...info,
        nonce: BigInt(info.nonce),
        deadline: BigInt(info.deadline),
        decayStartTime: BigInt(info.decayStartTime),
        decayEndTime: BigInt(info.decayEndTime),
        exclusivityOverrideBps: BigInt(info.exclusivityOverrideBps),
      },
      chainId,
      _permit2Address,
    )
  }

  static parse(encoded: Hex, chainId: number): ExclusiveDutchOrder {
    const decoded = decodeAbiParameters(EXCLUSIVE_DUTCH_ORDER_ABI, encoded)
    const [
      [
        [reactor, swapper, nonce, deadline, additionalValidationContract, additionalValidationData],
        decayStartTime,
        decayEndTime,
        exclusiveFiller,
        exclusivityOverrideBps,
        [inputToken, inputStartAmount, inputEndAmount],
        outputs,
      ],
    ] = decoded
    return new ExclusiveDutchOrder(
      {
        reactor,
        swapper,
        nonce,
        deadline,
        additionalValidationContract,
        additionalValidationData,
        decayStartTime,
        decayEndTime,
        exclusiveFiller,
        exclusivityOverrideBps,
        input: {
          token: inputToken,
          startAmount: inputStartAmount,
          endAmount: inputEndAmount,
        },
        outputs: outputs.map(([token, startAmount, endAmount, recipient]) => {
          return {
            token,
            startAmount,
            endAmount,
            recipient,
          }
        }),
      },
      chainId,
    )
  }

  /**
   * @inheritdoc order
   */
  encode(): Hex {
    return encodeAbiParameters(EXCLUSIVE_DUTCH_ORDER_ABI, [
      [
        [
          this.info.reactor,
          this.info.swapper,
          this.info.nonce,
          this.info.deadline,
          this.info.additionalValidationContract,
          this.info.additionalValidationData,
        ],
        this.info.decayStartTime,
        this.info.decayEndTime,
        this.info.exclusiveFiller,
        this.info.exclusivityOverrideBps,
        [this.info.input.token, this.info.input.startAmount, this.info.input.endAmount],
        this.info.outputs.map(
          (output) => [output.token, output.startAmount, output.endAmount, output.recipient] as const,
        ),
      ],
    ])
  }

  hash(): Hex {
    return hashStruct({
      data: this.witnessInfo(),
      types: EXCLUSIVE_DUTCH_ORDER_TYPES,
      primaryType: 'ExclusiveDutchOrder',
    })
  }

  /**
   * @inheritdoc Order
   */
  permitData(): PermitTransferFromData {
    return SignatureTransfer.getPermitData(
      this.toPermit(),
      this.permit2Address,
      this.chainId,
      this.witness(),
    ) as PermitTransferFromData
  }

  toPermit(): PermitTransferFrom {
    return {
      permitted: {
        token: this.info.input.token,
        amount: this.info.input.endAmount,
      },
      spender: this.info.reactor,
      nonce: this.info.nonce,
      deadline: this.info.deadline,
    }
  }

  witnessInfo(): WitnessInfo {
    return {
      info: {
        reactor: this.info.reactor,
        swapper: this.info.swapper,
        nonce: this.info.nonce,
        deadline: this.info.deadline,
        additionalValidationContract: this.info.additionalValidationContract,
        additionalValidationData: this.info.additionalValidationData,
      },
      decayStartTime: this.info.decayStartTime,
      decayEndTime: this.info.decayEndTime,
      exclusiveFiller: this.info.exclusiveFiller,
      exclusivityOverrideBps: this.info.exclusivityOverrideBps,
      inputToken: this.info.input.token,
      inputStartAmount: this.info.input.startAmount,
      inputEndAmount: this.info.input.endAmount,
      outputs: this.info.outputs,
    }
  }

  witness(): Omit<Witness, 'witness'> & { witness: WitnessInfo } {
    return {
      witness: this.witnessInfo(),
      witnessTypeName: 'ExclusiveDutchOrder',
      witnessType: EXCLUSIVE_DUTCH_ORDER_TYPES,
    }
  }

  decayInput(timestamp: bigint): DutchInput & { currentAmount: bigint } {
    return {
      ...this.info.input,
      currentAmount: this.decay(this.info.input.startAmount, this.info.input.endAmount, timestamp),
    }
  }

  decayOutputs(timestamp: bigint): (DutchOutput & { currentAmount: bigint })[] {
    return this.info.outputs.map((output) => {
      return {
        ...output,
        currentAmount: this.decay(output.startAmount, output.endAmount, timestamp),
      }
    })
  }

  private decay(startAmount: bigint, endAmount: bigint, compareTime: bigint): bigint {
    switch (true) {
      case this.info.decayEndTime < compareTime:
        return endAmount
      case this.info.decayStartTime > compareTime:
        return startAmount
      default: {
        const elapsed = compareTime - this.info.decayStartTime
        const duration = this.info.decayEndTime - this.info.decayStartTime
        if (endAmount < startAmount) {
          return startAmount - ((startAmount - endAmount) * elapsed) / duration
        }
        return startAmount + ((endAmount - startAmount) * elapsed) / duration
      }
    }
  }
}
