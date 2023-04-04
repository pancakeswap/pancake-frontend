import { useCallback, useMemo } from 'react'
import { useTranslation } from '@pancakeswap/localization'

export const useChartCallbacks = (setHoverValue, setHoverDate) => {
  const {
    currentLanguage: { locale },
  } = useTranslation()

  const onMouseLeave = useCallback(() => {
    setHoverDate(undefined)
    setHoverValue(undefined)
  }, [setHoverDate, setHoverValue])

  const onMouseMove = useCallback(
    (state) => {
      if (state.isTooltipActive) {
        setHoverValue(state.activePayload[0].payload.value)
        setHoverDate(
          state.activePayload[0].payload.time.toLocaleString(locale, {
            year: 'numeric',
            day: 'numeric',
            month: 'short',
          }),
        )
      }
    },
    [locale, setHoverDate, setHoverValue],
  )

  return useMemo(() => ({ onMouseLeave, onMouseMove }), [onMouseLeave, onMouseMove])
}
