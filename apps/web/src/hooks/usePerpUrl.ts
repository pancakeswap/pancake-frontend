import { useMemo } from 'react'

import { getPerpetualUrl, GetPerpetualUrlProps } from 'utils/getPerpetualUrl'

export function usePerpUrl({ chainId, isDark, languageCode }: GetPerpetualUrlProps) {
  return useMemo(() => getPerpetualUrl({ chainId, isDark, languageCode }), [chainId, isDark, languageCode])
}
