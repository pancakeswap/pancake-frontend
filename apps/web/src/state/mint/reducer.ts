import { createContext, useContext } from 'react'
import { createReducer } from '@reduxjs/toolkit'
import { atomWithReducer } from 'jotai/utils'
import { useAtomValue, useSetAtom } from 'jotai'
import { CurrencyField as Field } from 'utils/types'
import { resetMintState, typeInput } from './actions'

export interface MintState {
  readonly independentField: Field
  readonly typedValue: string
  readonly otherTypedValue: string // for the case when there's no liquidity
}

const initialState: MintState = {
  independentField: Field.CURRENCY_A,
  typedValue: '',
  otherTypedValue: '',
}

export const reducer = createReducer<MintState>(initialState, (builder) =>
  builder
    .addCase(resetMintState, () => initialState)
    .addCase(typeInput, (state, { payload: { field, typedValue, noLiquidity } }) => {
      if (noLiquidity) {
        // they're typing into the field they've last typed in
        if (field === state.independentField) {
          return {
            ...state,
            independentField: field,
            typedValue,
          }
        }
        // they're typing into a new field, store the other value

        return {
          ...state,
          independentField: field,
          typedValue,
          otherTypedValue: state.typedValue,
        }
      }
      return {
        ...state,
        independentField: field,
        typedValue,
        otherTypedValue: '',
      }
    }),
)

export const createFormAtom = () => atomWithReducer(initialState, reducer)

const AddLiquidityV2AtomContext = createContext({
  formAtom: createFormAtom(),
})

export const AddLiquidityV2AtomProvider = AddLiquidityV2AtomContext.Provider

export function useAddLiquidityV2FormState() {
  const ctx = useContext(AddLiquidityV2AtomContext)
  return useAtomValue(ctx.formAtom)
}

export function useAddLiquidityV2FormDispatch() {
  const ctx = useContext(AddLiquidityV2AtomContext)
  return useSetAtom(ctx.formAtom)
}
