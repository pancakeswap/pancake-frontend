import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { Card, CardBody, Box, CardProps } from '@pancakeswap/uikit'

const StyledCard = styled(Card)<{ background: string; borderColor: string; rotation?: string }>`
  height: fit-content;
  background: ${({ background }) => background};
  border: 2px solid ${({ borderColor }) => borderColor};
  box-sizing: border-box;
  box-shadow: 0px 4px 0px ${({ borderColor }) => borderColor};

  ${({ theme }) => theme.mediaQueries.md} {
    ${({ rotation }) => (rotation ? `transform: rotate(${rotation});` : '')}
  }
`

const IconWrapper = styled(Box)<{ rotation?: string }>`
  position: absolute;
  top: 24px;
  right: 24px;

  ${({ theme }) => theme.mediaQueries.md} {
    ${({ rotation }) => (rotation ? `transform: rotate(${rotation});` : '')}
  }
`

interface IconCardProps extends IconCardData, CardProps {
  children: ReactNode
}

export interface IconCardData {
  icon: ReactNode
  background: string
  borderColor: string
  rotation?: string
}

const IconCard: React.FC<IconCardProps> = ({ icon, background, borderColor, rotation, children, ...props }) => {
  return (
    <StyledCard background={background} borderColor={borderColor} rotation={rotation} {...props}>
      <CardBody>
        <IconWrapper rotation={rotation}>{icon}</IconWrapper>
        {children}
      </CardBody>
    </StyledCard>
  )
}

export default IconCard
