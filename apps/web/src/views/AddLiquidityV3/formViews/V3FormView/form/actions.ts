import { createAction } from '@reduxjs/toolkit'
import { Price, Token } from '@pancakeswap/swap-sdk-core'

export enum Field {
  CURRENCY_A = 'CURRENCY_A',
  CURRENCY_B = 'CURRENCY_B',
}

export const typeInput = createAction<{ field: Field; typedValue: string | undefined; noLiquidity: boolean }>(
  'mintV3/typeInputMint',
)
export const typeStartPriceInput = createAction<{ typedValue: string }>('mintV3/typeStartPriceInput')
export const typeLeftRangeInput = createAction<{ typedValue: Price<Token, Token> | undefined }>(
  'mintV3/typeLeftRangeInput',
)
export const typeRightRangeInput = createAction<{ typedValue: Price<Token, Token> | undefined }>(
  'mintV3/typeRightRangeInput',
)
export const resetMintState = createAction<void>('mintV3/resetMintState')
export const setFullRange = createAction<void>('mintV3/setFullRange')
