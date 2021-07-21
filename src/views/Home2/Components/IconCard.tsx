import React from 'react'
import styled from 'styled-components'
import { Card, CardBody, ChartIcon, Box } from '@pancakeswap/uikit'

const StyledCard = styled(Card)<{ background: string; borderColor: string; rotation?: string }>`
  background: ${({ background }) => background};
  border: 2px solid ${({ borderColor }) => borderColor};
  box-sizing: border-box;
  box-shadow: 0px 4px 0px ${({ borderColor }) => borderColor};
  ${({ rotation }) => (rotation ? `transform: rotate(${rotation});` : '')}
`

const IconWrapper = styled(Box)<{ rotation?: string }>`
  position: absolute;
  top: 24px;
  right: 24px;
  ${({ rotation }) => (rotation ? `transform: rotate(${rotation});` : '')}
`

const IconCard = () => {
  const icon = <ChartIcon />
  const background = 'linear-gradient(180deg, #ffb237 0%, #ffcd51 51.17%, #ffe76a 100%);'
  const borderColor = '#ffb237'
  const rotation = '-2.36deg'

  return (
    <StyledCard background={background} borderColor={borderColor} rotation={rotation}>
      <CardBody>
        <IconWrapper rotation={rotation}>{icon}</IconWrapper>
      </CardBody>
    </StyledCard>
  )
}

export default IconCard
