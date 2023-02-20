import { useExpertModeManager } from 'state/user/hooks'

import { useIsWrapping } from './useIsWrapping'

export function useAllowRecipient() {
  const [isExpertMode] = useExpertModeManager()
  const isWrapping = useIsWrapping()
  return isExpertMode && !isWrapping
}
