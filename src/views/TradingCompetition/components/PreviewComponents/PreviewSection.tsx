import React from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap/uikit'
import { SectionProps } from '../../types'

const BackgroundColorWrapper = styled(Flex)<SectionProps>`
  min-height: calc(100vh - 64px);
  position: relative;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  background: ${({ backgroundStyle }) => backgroundStyle};
  margin: auto;
`

const ChildrenWrapper = styled(Flex)`
  align-items: center;
  justify-content: center;
`

const Section: React.FC<SectionProps> = ({ children, backgroundStyle = '#faf9fa' }) => {
  return (
    <BackgroundColorWrapper backgroundStyle={backgroundStyle}>
      <ChildrenWrapper>{children}</ChildrenWrapper>
    </BackgroundColorWrapper>
  )
}

export default Section
