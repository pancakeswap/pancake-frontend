import { FC, PropsWithChildren } from 'react'
import { createPortal } from 'react-dom'
import { useIsMounted } from '@pancakeswap/hooks'

interface PortalProps {
  container?: () => HTMLElement
}

const Portal: FC<PropsWithChildren<PortalProps>> = ({ container = () => document.body, children }) => {
  const isMounted = useIsMounted()

  return isMounted ? createPortal(children, container()) : null
}

export default Portal
