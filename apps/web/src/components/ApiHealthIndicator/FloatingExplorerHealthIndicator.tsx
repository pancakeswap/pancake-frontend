import { createPortal } from 'react-dom'

import { getPortalRoot } from '@pancakeswap/uikit'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { ExplorerHealthIndicator, ExplorerHealthIndicatorProps } from 'components/ApiHealthIndicator/HealthIndicator'

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export function FloatingExplorerHealthIndicator(
  props: PartialBy<ExplorerHealthIndicatorProps, 'chainId'> & { protocol: 'v2' | 'v3' | 'stable' },
) {
  const { chainId: activeChainId } = useActiveChainId()

  const portalRoot = getPortalRoot()

  return portalRoot
    ? createPortal(<ExplorerHealthIndicator chainId={props.chainId ?? activeChainId} {...props} />, portalRoot)
    : null
}
