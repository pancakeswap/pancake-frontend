import { useState } from 'react'
import { HelpIcon } from '@pancakeswap/uikit'

const BAD_SRCS: string[] = []

export interface LogoLoaderProps {
  alt: string
  src: string
}

/**
 * Renders an image by sequentially trying a list of URIs, and then eventually a fallback to HelpIcon
 */
const LogoLoader: React.FC<React.PropsWithChildren<LogoLoaderProps>> = ({ src, alt, ...rest }) => {
  const [, refresh] = useState(0)

  const srcFailedLoading = BAD_SRCS.includes(src)

  if (src && !srcFailedLoading) {
    return (
      <img
        {...rest}
        alt={alt}
        src={src}
        onError={() => {
          if (src) BAD_SRCS.push(src)
          refresh((i) => i + 1)
        }}
      />
    )
  }

  return <HelpIcon {...rest} />
}

export default LogoLoader
