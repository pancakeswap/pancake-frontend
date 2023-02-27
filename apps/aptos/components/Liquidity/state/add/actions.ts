import { createAction } from '@reduxjs/toolkit'
import { Field } from 'components/Liquidity/type'

export const typeInput = createAction<{ field: Field; typedValue: string; noLiquidity: boolean }>('mint/typeInputMint')
export const resetMintState = createAction<void>('mint/resetMintState')
