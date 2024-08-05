import { useMatchBreakpoints } from '@pancakeswap/uikit'
import NextLink from 'next/link'
import { LogoText } from './LogoText'

export const Logo = () => {
  const { isMobile } = useMatchBreakpoints()

  return (
    <NextLink href="/" passHref style={{ display: 'block', margin: 'auto' }}>
      <LogoText width={isMobile ? '95px' : '119px'} height="25px" />
    </NextLink>
  )
}
