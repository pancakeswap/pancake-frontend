import { useCallback, useContext } from 'react'
import { Context } from './TooltipContext'

const useTooltip = (tooltip: React.ReactNode): [() => void, () => void] => {
  const { onPresent, onDismiss } = useContext(Context)
  const onPresentCallback = useCallback(() => {
    onPresent(tooltip)
  }, [tooltip, onPresent])

  return [onPresentCallback, onDismiss]
}

export default useTooltip
