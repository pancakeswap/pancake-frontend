import { createAction } from '@reduxjs/toolkit'

export enum Field {
  CURRENCY_A = 'currencyA',
  CURRENCY_B = 'currencyB',
}

// Philip TODO: remove noLiquidity payload
export const typeInput = createAction<{ field: Field; typedValue: string; noLiquidity: boolean }>('mint/typeInputMint')
export const resetMintState = createAction<void>('mint/resetMintState')
