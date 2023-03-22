import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { Field, typeInput, typeLeftRangeInput, typeRightRangeInput, typeStartPriceInput } from '../actions'
import { useV3FormDispatch } from '../reducer'

export function useV3MintActionHandlers(
  noLiquidity: boolean | undefined,
  routerReplace = true, // TODO: remove this when we have a better way to handle the router
): {
  onFieldAInput: (typedValue: string) => void
  onFieldBInput: (typedValue: string) => void
  onLeftRangeInput: (typedValue: string) => void
  onRightRangeInput: (typedValue: string) => void
  onStartPriceInput: (typedValue: string) => void
} {
  const router = useRouter()

  const dispatch = useV3FormDispatch()

  const onFieldAInput = useCallback(
    (typedValue: string) => {
      dispatch(typeInput({ field: Field.CURRENCY_A, typedValue, noLiquidity: noLiquidity === true }))
    },
    [dispatch, noLiquidity],
  )

  const onFieldBInput = useCallback(
    (typedValue: string) => {
      dispatch(typeInput({ field: Field.CURRENCY_B, typedValue, noLiquidity: noLiquidity === true }))
    },
    [dispatch, noLiquidity],
  )

  const onLeftRangeInput = useCallback(
    (typedValue: string) => {
      dispatch(typeLeftRangeInput({ typedValue }))
      if (routerReplace) {
        router.replace(
          {
            pathname: router.pathname,
            query: { ...router.query, minPrice: typedValue },
          },
          undefined,
          {
            shallow: true,
          },
        )
      }
    },
    [dispatch, router, routerReplace],
  )

  const onRightRangeInput = useCallback(
    (typedValue: string) => {
      dispatch(typeRightRangeInput({ typedValue }))
      if (routerReplace) {
        router.replace(
          {
            pathname: router.pathname,
            query: { ...router.query, maxPrice: typedValue },
          },
          undefined,
          {
            shallow: true,
          },
        )
      }
    },
    [dispatch, router, routerReplace],
  )

  const onStartPriceInput = useCallback(
    (typedValue: string) => {
      dispatch(typeStartPriceInput({ typedValue }))
    },
    [dispatch],
  )

  return {
    onFieldAInput,
    onFieldBInput,
    onLeftRangeInput,
    onRightRangeInput,
    onStartPriceInput,
  }
}
