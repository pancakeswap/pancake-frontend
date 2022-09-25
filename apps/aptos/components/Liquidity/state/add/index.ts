import { useAtomValue, useReducerAtom } from 'jotai/utils'
import { useCallback, useMemo } from 'react'
import { Field, typeInput } from './actions'
import { MintState, mintStateAtom, reducer } from './reducers'

interface MintLiquidityHandlers {
  onFieldAInput: (typedValue: string) => void
  onFieldBInput: (typedValue: string) => void
}

let tuple: [MintState, MintLiquidityHandlers]

export const useLiquidityStatee = () => {
  return useAtomValue(mintStateAtom)
}

export const useMintLiquidityState = (noLiquidity): typeof tuple => {
  const [mintState, dispatch] = useReducerAtom(mintStateAtom, reducer)

  const onFieldAInput = useCallback(
    (typedValue: string) => {
      dispatch(typeInput({ field: Field.CURRENCY_A, typedValue, noLiquidity: Boolean(noLiquidity) }))
    },
    [dispatch, noLiquidity],
  )
  const onFieldBInput = useCallback(
    (typedValue: string) => {
      dispatch(typeInput({ field: Field.CURRENCY_B, typedValue, noLiquidity: Boolean(noLiquidity) }))
    },
    [dispatch, noLiquidity],
  )

  const handlers: MintLiquidityHandlers = useMemo(
    () => ({
      onFieldAInput,
      onFieldBInput,
    }),
    [onFieldAInput, onFieldBInput],
  )

  return useMemo(() => [mintState, handlers], [mintState, handlers])
}
