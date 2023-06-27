import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import updateQueryFromRouter from '@pancakeswap/utils/updateQueryFromRouter'

const useQueryState = <T>(initialState: T, objectKey: string): [T, (newValue: T) => void] => {
  const router = useRouter()
  const [value, setter] = useState(initialState)

  const queriedSetter = useCallback(
    (newValue: T) => {
      updateQueryFromRouter(router, objectKey, newValue)
      setter(newValue)
    },
    [objectKey, router],
  )

  return [value, queriedSetter]
}

export default useQueryState
