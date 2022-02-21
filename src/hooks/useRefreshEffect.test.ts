import { act, renderHook } from '@testing-library/react-hooks'
import { FAST_INTERVAL, SLOW_INTERVAL } from 'config/constants'
import { useState } from 'react'
import useSWR from 'swr'
import { useFastRefreshEffect, useSlowRefreshEffect } from './useRefreshEffect'

test('should refresh when deps changes', () => {
  const callback = jest.fn()
  let deps = [1, 2, () => 1]
  const { rerender } = renderHook(() => {
    useFastRefreshEffect(callback, deps)
  })

  expect(callback).toHaveBeenCalledTimes(1)
  rerender()
  // no changes
  expect(callback).toHaveBeenCalledTimes(1)

  deps = [1, 2, () => 2]
  rerender()
  expect(callback).toHaveBeenCalledTimes(2)
  rerender()
  // no changes
  expect(callback).toHaveBeenCalledTimes(2)
})

test('should refresh when block changes', async () => {
  const callback = jest.fn()
  const { result, rerender } = renderHook(() => {
    const { mutate, data } = useSWR([FAST_INTERVAL, 'blockNumber'])
    useFastRefreshEffect(callback, [callback])
    return { mutate, data }
  })

  expect(result.current.data).toBeUndefined()
  expect(callback).toHaveBeenCalledTimes(1)

  act(() => {
    result.current.mutate(1)
  })

  expect(callback).toHaveBeenCalledTimes(2)
  rerender()
  // no changes
  expect(callback).toHaveBeenCalledTimes(2)
})

test('should get latest block number when block changes', async () => {
  const { result, rerender } = renderHook(() => {
    const [callbackResult, setCallbackResult] = useState<number>()
    const { mutate, data } = useSWR([SLOW_INTERVAL, 'blockNumber'])
    useSlowRefreshEffect((b) => {
      setCallbackResult(b)
    }, [])
    return { mutate, data, callbackResult }
  })

  expect(result.current.data).toBeUndefined()
  expect(result.current.callbackResult).toBe(0)

  act(() => {
    result.current.mutate(1)
  })

  expect(result.current.callbackResult).toBe(1)
  rerender()
  // no changes
  expect(result.current.callbackResult).toBe(1)
})
