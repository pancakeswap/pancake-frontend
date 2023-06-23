import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { batch } from 'react-redux'
import {
  Field,
  typeInput,
  typeLeftRangeInput,
  typeRightRangeInput,
  typeStartPriceInput,
  setFullRange,
} from '../actions'
import { useV3FormDispatch } from '../reducer'

export function useV3MintActionHandlers(
  noLiquidity: boolean | undefined,
  routerReplace = true, // TODO: remove this when we have a better way to handle the router
): {
  onSetFullRange: () => void
  onFieldAInput: (typedValue: string | undefined) => void
  onFieldBInput: (typedValue: string) => void
  onLeftRangeInput: (typedValue: string) => void
  onRightRangeInput: (typedValue: string) => void
  onStartPriceInput: (typedValue: string) => void
  onBothRangeInput: ({ leftTypedValue, rightTypedValue }: { leftTypedValue: string; rightTypedValue: string }) => void
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

  const onBothRangeInput = useCallback(
    ({ leftTypedValue, rightTypedValue }: { leftTypedValue: string; rightTypedValue: string }) => {
      batch(() => {
        dispatch(typeLeftRangeInput({ typedValue: leftTypedValue }))
        dispatch(typeRightRangeInput({ typedValue: rightTypedValue }))
      })

      if (routerReplace) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { minPrice, maxPrice, ...rest } = router.query

        // remove minPrice or maxPrice if its' empty
        router.replace(
          {
            pathname: router.pathname,
            query: {
              ...rest,
              ...(leftTypedValue && { minPrice: leftTypedValue }),
              ...(rightTypedValue && { maxPrice: rightTypedValue }),
            },
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

  const onSetFullRange = useCallback(() => {
    dispatch(setFullRange())
  }, [dispatch])

  return {
    onBothRangeInput,
    onFieldAInput,
    onFieldBInput,
    onLeftRangeInput,
    onRightRangeInput,
    onStartPriceInput,
    onSetFullRange,
  }
}
