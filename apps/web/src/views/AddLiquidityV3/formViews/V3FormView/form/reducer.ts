import { createReducer } from '@reduxjs/toolkit'
import { useAtomValue, useSetAtom } from 'jotai'
import { atomWithReducer } from 'jotai/utils'
import { createContext, useContext } from 'react'
import { Price, Token } from '@pancakeswap/swap-sdk-core'

import { CurrencyField as Field } from 'utils/types'
import {
  resetMintState,
  setFullRange,
  typeInput,
  typeLeftRangeInput,
  typeRightRangeInput,
  typeStartPriceInput,
} from './actions'

type FullRange = true

export interface MintState {
  readonly independentField: Field
  readonly typedValue: string | undefined
  readonly startPriceTypedValue: string // for the case when there's no liquidity
  readonly leftRangeTypedValue: Price<Token, Token> | FullRange | undefined
  readonly rightRangeTypedValue: Price<Token, Token> | FullRange | undefined
}

export const initialState: MintState = {
  independentField: Field.CURRENCY_A,
  typedValue: '',
  startPriceTypedValue: '',
  leftRangeTypedValue: undefined,
  rightRangeTypedValue: undefined,
}

const reducer = createReducer<MintState>(initialState, (builder) =>
  builder
    .addCase(resetMintState, () => initialState)
    .addCase(setFullRange, (state) => {
      return {
        ...state,
        leftRangeTypedValue: true,
        rightRangeTypedValue: true,
      }
    })
    .addCase(typeStartPriceInput, (state, { payload: { typedValue } }) => {
      return {
        ...state,
        startPriceTypedValue: typedValue,
      }
    })
    .addCase(typeLeftRangeInput, (state, { payload: { typedValue } }) => {
      return {
        ...state,
        leftRangeTypedValue: typedValue,
      }
    })
    .addCase(typeRightRangeInput, (state, { payload: { typedValue } }) => {
      return {
        ...state,
        rightRangeTypedValue: typedValue,
      }
    })
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
        }
      }
      return {
        ...state,
        independentField: field,
        typedValue,
      }
    }),
)

export const createFormAtom = () => atomWithReducer(initialState, reducer)

const LiquidityAtomContext = createContext({
  formAtom: createFormAtom(),
  onAddLiquidityCallback: (_hash: `0x${string}`) => {
    //
  },
})

export function useV3FormAddLiquidityCallback() {
  const ctx = useContext(LiquidityAtomContext)
  return ctx.onAddLiquidityCallback
}

export const LiquidityAtomProvider = LiquidityAtomContext.Provider

export function useV3FormState() {
  const ctx = useContext(LiquidityAtomContext)
  return useAtomValue(ctx.formAtom)
}

export function useV3FormDispatch() {
  const ctx = useContext(LiquidityAtomContext)
  return useSetAtom(ctx.formAtom)
}
