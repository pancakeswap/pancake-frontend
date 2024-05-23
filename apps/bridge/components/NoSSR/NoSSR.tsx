import { useIsMounted } from '@pancakeswap/hooks'
import type React from 'react'

interface NoSSRProps {
  children?: React.ReactNode
  loader?: React.ReactNode
}

const NoSSR: React.FC<NoSSRProps> = ({ children, loader }) => {
  const isMounted = useIsMounted()

  return <>{isMounted ? children : loader ?? null}</>
}

export default NoSSR
