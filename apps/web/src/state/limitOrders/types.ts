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
