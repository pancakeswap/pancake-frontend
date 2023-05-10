export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
  PRICE = 'PRICE',
}

export enum Rate {
  MUL = 'MUL',
  DIV = 'DIV',
}

export interface OrderState {
  readonly independentField: Field
  readonly basisField: Field
  readonly typedValue: string
  readonly inputValue?: string
  readonly outputValue?: string
  readonly [Field.INPUT]: {
    readonly currencyId: string | undefined
  }
  readonly [Field.OUTPUT]: {
    readonly currencyId: string | undefined
  }

  readonly rateType: Rate
}

export interface LimitOrder {
  id: string
  owner: string
  inputToken: string
  outputToken: string
  minReturn: string
  maxReturn?: string
  adjustedMinReturn: string
  module: string
  witness: string
  secret: string
  inputAmount: string
  vault: string
  bought: string | null
  auxData: string | null
  status: string
  createdTxHash: string
  executedTxHash: string | null
  cancelledTxHash: string | null
  blockNumber: string
  createdAt: string
  updatedAt: string
  updatedAtBlock: string
  updatedAtBlockHash: string
  data: string
  inputData: string
  handler: string | null
  isExpired: boolean
}
