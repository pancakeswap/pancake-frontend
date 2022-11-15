import type { Currency, Token } from '@pancakeswap/sdk'

import { BasePair } from './pair'

export interface BaseRoute<TInput extends Currency, TOutput extends Currency, TPair extends BasePair> {
  pairs: TPair[]
  input: TInput
  output: TOutput
  path: Token[]
}
