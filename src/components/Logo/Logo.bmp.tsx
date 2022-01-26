import React, { useState } from 'react'
import styled from 'styled-components'
import { Image as MpImage, ImageProps } from '@binance/mp-components'
import { HelpIcon } from '@pancakeswap/uikit'

const BAD_SRCS: { [tokenAddress: string]: true } = {}

export interface LogoProps extends ImageProps {
  srcs: string[]
}

const Image = styled(MpImage, { isStyled: false })<LogoProps>``

/**
 * Renders an image by sequentially trying a list of URIs, and then eventually a fallback triangle alert
 */
const Logo: React.FC<LogoProps> = ({ srcs, alt, ...rest }) => {
  const [, refresh] = useState<number>(0)

  const src: string | undefined = srcs.find((s) => !BAD_SRCS[s])

  if (src) {
    return (
      <Image
        {...rest}
        src={src}
        onError={() => {
          if (src) BAD_SRCS[src] = true
          refresh((i) => i + 1)
        }}
      />
    )
  }

  return <HelpIcon {...rest} />
}

export default Logo
