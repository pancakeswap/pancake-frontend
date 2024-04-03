import { VercelToolbar as VercelToolbarComp } from '@vercel/toolbar/next'
import { FlagValues } from '@vercel/flags/react'

import { useFeatureFlags } from 'hooks/useExperimentalFeatureEnabled'
import { useShouldInjectVercelToolbar, useVercelToolbarEnabled } from 'hooks/useVercelToolbar'

export function VercelToolbar() {
  const flags = useFeatureFlags()
  const enabled = useVercelToolbarEnabled()
  const shouldInject = useShouldInjectVercelToolbar()

  return enabled ? (
    <>
      {shouldInject ? <VercelToolbarComp /> : null}
      <FlagValues values={flags} />
    </>
  ) : null
}
