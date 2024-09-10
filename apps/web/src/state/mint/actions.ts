import { createAction } from '@reduxjs/toolkit'
import { CurrencyField } from 'utils/types'

export const typeInput = createAction<{ field: CurrencyField; typedValue: string; noLiquidity: boolean }>(
  'mint/typeInputMint',
)
export const resetMintState = createAction<void>('mint/resetMintState')
