import { useEffect, useCallback, useMemo } from 'react'
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

  const showConfettiEffect = useMemo(
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

  const initialize = useCallback(() => {
    if (selector) {
      document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
        element.addEventListener('click', showConfettiEffect)
      })
    } else {
      document.addEventListener('click', showConfettiEffect)
    }
  }, [selector, showConfettiEffect])

  const teardown = useCallback(() => {
    if (selector) {
      document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
        element.removeEventListener('click', showConfettiEffect)
      })
    } else {
      document.removeEventListener('click', showConfettiEffect)
    }
  }, [selector, showConfettiEffect])

  useEffect(() => {
    initialize()
    return () => teardown()
  }, [initialize, teardown])

  return { initialize, teardown }
}

export const isEventEnded = (): boolean => {
  const now = Date.now()
  const endDay = 1697212799000 // 13 Oct 2023, 23:59:59
  return endDay < now
}

export const useAnniversaryEffect = () => {
  const { pathname } = useRouter()
  const { initialize, teardown } = useConfetti({
    disableWhen: isEventEnded,
    debounceDuration: 1000,
  })

  useEffect(() => {
    initialize()

    return () => teardown()
  }, [pathname, initialize, teardown])
}
