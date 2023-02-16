import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { Field, typeInput, typeLeftRangeInput, typeRightRangeInput, typeStartPriceInput } from './actions'

export const replaceURLParam = (search: string, param: string, newValue: string) => {
  const searchParams = new URLSearchParams(search)
  searchParams.set(param, newValue)
  return searchParams.toString()
}

export function useV3MintActionHandlers(noLiquidity: boolean | undefined): {
  onFieldAInput: (typedValue: string) => void
  onFieldBInput: (typedValue: string) => void
  onLeftRangeInput: (typedValue: string) => void
  onRightRangeInput: (typedValue: string) => void
  onStartPriceInput: (typedValue: string) => void
} {
  const router = useRouter()

  const dispatch = useLocalDispatch()

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
    },
    [dispatch, router],
  )

  const onRightRangeInput = useCallback(
    (typedValue: string) => {
      dispatch(typeRightRangeInput({ typedValue }))
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
    },
    [dispatch, router],
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
