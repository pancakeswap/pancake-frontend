import { styled } from 'styled-components'
import { Card, CardProps } from '@pancakeswap/uikit'

export const BodyWrapper = styled(Card)`
  border-radius: 12px;
  max-width: 436px;
  width: 100%;
  z-index: 1;
  border: 1px solid #747474;
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children, ...cardProps }: { children: React.ReactNode } & CardProps) {
  return <BodyWrapper {...cardProps}>{children}</BodyWrapper>
}
