import React from 'react'
import styled from 'styled-components'
import { Card } from '@pancakeswap/uikit'

export const BodyWrapper = styled(Card)<{ $fitContent?: boolean; $maxWidth?: string }>`
  border-radius: 24px;
  max-width: ${({ $maxWidth }) => $maxWidth || '436px'};
  width: 100%;
  z-index: 1;
  ${({ $fitContent }) => ($fitContent ? 'height: fit-content;' : '')}
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({
  children,
  fitContent = false,
  maxWidth,
}: {
  children: React.ReactNode
  fitContent?: boolean
  maxWidth?: string
}) {
  return (
    <BodyWrapper $fitContent={fitContent} $maxWidth={maxWidth}>
      {children}
    </BodyWrapper>
  )
}
