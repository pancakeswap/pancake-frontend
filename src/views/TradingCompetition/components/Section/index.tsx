import React from 'react'
import styled from 'styled-components'
import { Flex } from '@pancakeswap-libs/uikit'
import { TopIntersect, BottomIntersect } from './StyledIntersect'

interface SectionProps {
  backgroundStyle?: string
  svgFill?: string
  index?: number
  intersectComponent?: React.ReactNode
}

const BackgroundColorWrapper = styled(Flex)<SectionProps>`
  z-index: -${({ index }) => index};
  padding-top: 48px;
  position: relative;
  background: ${({ backgroundStyle }) => backgroundStyle};
  flex-direction: column;

  margin: -34px -16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin: -42px -24px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    /* margin: -34px -100%;
    overflow: hidden; */
  }
`

const IntersectWrapper = styled.div<SectionProps>`
  position: relative;
  display: flex;
  align-items: center;
  z-index: -${({ index }) => index};
  svg {
    fill: ${({ svgFill }) => svgFill};
    z-index: -${({ index }) => index};
  }
  margin: 33px -24px 0;
  width: calc(100% + 48px);

  ${({ theme }) => theme.mediaQueries.sm} {
    margin: 41px -24px 0;
  }
`

const IntersectComponentWrapper = styled.div`
  width: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 5;
  transform: translate(-50%, -50%);
`

const Section: React.FC<SectionProps> = ({
  children,
  backgroundStyle = '#faf9fa',
  svgFill = '#faf9fa',
  index = 1,
  intersectComponent = null,
}) => {
  return (
    <>
      <BackgroundColorWrapper backgroundStyle={backgroundStyle} index={index}>
        {children}
      </BackgroundColorWrapper>
      <IntersectWrapper svgFill={svgFill} index={index}>
        {intersectComponent && <IntersectComponentWrapper>{intersectComponent}</IntersectComponentWrapper>}
        <BottomIntersect width="100%" />
      </IntersectWrapper>
    </>
  )
}

export default Section
