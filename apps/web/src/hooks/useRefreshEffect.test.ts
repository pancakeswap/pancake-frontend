import { useQuery, useQueryClient } from '@tanstack/react-query'
import { waitFor } from '@testing-library/react'
import { act, renderHook } from '@testing-library/react-hooks'
import { FAST_INTERVAL, SLOW_INTERVAL } from 'config/constants'
import { useState } from 'react'
import { createWagmiWrapper } from 'testUtils'
import { describe, expect, test, vi } from 'vitest'
import { useFastRefreshEffect, useSlowRefreshEffect } from './useRefreshEffect'

describe('useRefreshEffect', () => {
  test('should refresh when deps changes', () => {
    const callback = vi.fn()
    let deps = [1, 2, () => 1]
    const { rerender } = renderHook(
      () => {
        useFastRefreshEffect(callback, deps)
      },
      {
        wrapper: createWagmiWrapper(),
      },
    )

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
    const callback = vi.fn()
    const { result, rerender } = renderHook(
      () => {
        const queryClient = useQueryClient()
        const { data, isSuccess } = useQuery({
          queryKey: [FAST_INTERVAL, 'blockNumber', 56],
          enabled: false,
        })
        useFastRefreshEffect(callback, [callback])
        return { refetch: queryClient, data, isSuccess }
      },
      {
        wrapper: createWagmiWrapper(),
      },
    )

    expect(result.current.data).toBeUndefined()
    expect(callback).toHaveBeenCalledTimes(1)

    act(() => {
      result.current.refetch.setQueryData([FAST_INTERVAL, 'blockNumber', 56], 1)
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    rerender()
    expect(callback).toHaveBeenCalledTimes(2)

    rerender()
    // no changes
    expect(callback).toHaveBeenCalledTimes(2)
  })

  test('should get latest block number when block changes', async () => {
    const { result, rerender } = renderHook(
      () => {
        const queryClient = useQueryClient()
        const [callbackResult, setCallbackResult] = useState<number>()
        const { data, isSuccess } = useQuery({
          queryKey: [SLOW_INTERVAL, 'blockNumber', 56],
        })
        useSlowRefreshEffect((b) => {
          setCallbackResult(b)
        }, [])
        return { refetch: queryClient, data, isSuccess, callbackResult }
      },
      {
        wrapper: createWagmiWrapper(),
      },
    )

    expect(result.current.data).toBeUndefined()
    expect(result.current.callbackResult).toBe(0)

    act(() => {
      result.current.refetch.setQueryData([SLOW_INTERVAL, 'blockNumber', 56], 1)
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    rerender()
    expect(result.current.callbackResult).toBe(1)

    rerender()
    // no changes
    expect(result.current.callbackResult).toBe(1)
  })
})
