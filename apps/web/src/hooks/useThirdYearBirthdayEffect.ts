import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import confetti from 'canvas-confetti'
import debounce from 'lodash/debounce'

const defaultOptions = {
  debounceDuration: 200,
}

type Options = {
  selector?: string
  debounceDuration?: number
  disableWhen?: () => boolean
}

const useConfetti = (options: Options): { initialize: () => void; teardown: () => void } => {
  const { selector, debounceDuration, disableWhen } = {
    ...defaultOptions,
    ...options,
  }

  const makeListener = useCallback(
    () =>
      debounce(
        () => {
          const isDisabled = disableWhen && disableWhen()

          if (!isDisabled) {
            confetti({
              particleCount: 100,
              startVelocity: 30,
              spread: 360,
              origin: {
                x: Math.random(),
                y: Math.random() - 0.2,
              },
            })
          }
        },
        debounceDuration,
        { leading: true },
      ),
    [debounceDuration, disableWhen],
  )
  const listener = makeListener()

  const initialize = useCallback(() => {
    if (selector) {
      document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
        element.addEventListener('click', listener)
      })
    } else {
      document.addEventListener('click', listener)
    }
  }, [selector, listener])

  const teardown = useCallback(() => {
    if (selector) {
      document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
        element.removeEventListener('click', listener)
      })
    } else {
      document.removeEventListener('click', listener)
    }
  }, [selector, listener])

  useEffect(() => {
    initialize()
    return () => teardown()
  }, [initialize, teardown])

  return { initialize, teardown }
}

export const disableWhenEvenEnd = () => {
  const now = Date.now()
  const endDay = 1697212800000 // 14 Oct 2023
  return endDay < now
}

const useThirdYearBirthdayEffect = () => {
  const { pathname } = useRouter()
  const { initialize, teardown } = useConfetti({
    disableWhen: disableWhenEvenEnd,
    debounceDuration: 1000,
  })

  useEffect(() => {
    initialize()

    return () => teardown()
  }, [pathname, initialize, teardown])
}

export default useThirdYearBirthdayEffect
