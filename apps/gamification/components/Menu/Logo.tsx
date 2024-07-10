import NextLink from 'next/link'
import { LogoText } from './LogoText'

export const Logo = () => {
  return (
    <NextLink href="/" passHref style={{ display: 'block', margin: 'auto' }}>
      <LogoText width="91px" height="24px" />
    </NextLink>
  )
}
