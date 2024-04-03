import { Suspense, lazy } from 'react'

import { useFeatureFlags } from 'hooks/useExperimentalFeatureEnabled'
import { useShouldInjectVercelToolbar, useVercelToolbarEnabled } from 'hooks/useVercelToolbar'

const VercelToolbarComp = lazy(() =>
  import('@vercel/toolbar/next').then((module) => ({ default: module.VercelToolbar })),
)
const FlagValues = lazy(() => import('@vercel/flags/react').then((module) => ({ default: module.FlagValues })))

export function VercelToolbar() {
  const flags = useFeatureFlags()
  const enabled = useVercelToolbarEnabled()
  const shouldInject = useShouldInjectVercelToolbar()

  return enabled ? (
    <Suspense>
      {shouldInject ? (
        <Suspense>
          <VercelToolbarComp />
        </Suspense>
      ) : null}
      <FlagValues values={flags} />
    </Suspense>
  ) : null
}
