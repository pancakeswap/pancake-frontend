import { Flex, lightColors } from '@pancakeswap/uikit'
import styled, { keyframes } from 'styled-components'

const flyingAnim = () => keyframes`
  from {
    transform: translate(0,  0px);
  }
  50% {
    transform: translate(-5px, -5px);
  }
  to {
    transform: translate(0, 0px);
  }  
`

export const StyledEventDescriptionSectionContainer = styled(Flex)`
  background: ${({ theme }) => theme.colors.background};
`

export const StyledBodyTextList = styled('ul')`
  color: ${lightColors.textSubtle};
  margin-bottom: 24px;
`

export const StyledBodyTextElement = styled('li')`
  margin-left: 12px;
`

export const StyledBunnyAccessoriesContainer = styled(Flex)`
  position: absolute;
  animation: ${flyingAnim} 3.5s ease-in-out infinite;
  width: 100%;
  height: 100%;
`

export const StyledBunnyAccessory = styled.img`
  position: absolute;
  left: 0;
  top: 0;
  z-index: 5;
`
