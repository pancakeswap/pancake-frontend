import { Field } from 'components/Liquidity/type'
import { useAtomValue, useReducerAtom } from 'jotai/utils'
import { useCallback, useMemo } from 'react'
import { typeInput, resetMintState } from './actions'
import { MintState, mintStateAtom, reducer } from './reducers'

interface MintLiquidityHandlers {
  onFieldAInput: (typedValue: string) => void
  onFieldBInput: (typedValue: string) => void
  resetForm: () => void
}

let tuple: [MintState, MintLiquidityHandlers]

export const useLiquidityStateOnly = () => {
  return useAtomValue(mintStateAtom)
}

export const useMintLiquidityStateAndHandlers = (noLiquidity: boolean): typeof tuple => {
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

  const resetForm = useCallback(() => dispatch(resetMintState()), [dispatch])

  const handlers: MintLiquidityHandlers = useMemo(
    () => ({
      onFieldAInput,
      onFieldBInput,
      resetForm,
    }),
    [onFieldAInput, onFieldBInput, resetForm],
  )

  return useMemo(() => [mintState, handlers], [mintState, handlers])
}
