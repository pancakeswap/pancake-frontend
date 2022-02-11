import { Flex, lightColors } from '@tovaswapui/uikit'
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
  width: 100%;
  height: 100%;

  & :nth-child(1) {
    animation: ${flyingAnim} 3.5s ease-in-out infinite;
    animation-delay: 1s;
  }

  & :nth-child(2) {
    animation: ${flyingAnim} 3.5s ease-in-out infinite;
    animation-delay: 0.66s;
  }

  & :nth-child(3) {
    animation: ${flyingAnim} 3.5s ease-in-out infinite;
    animation-delay: 0.33s;
  }

  & :nth-child(4) {
    animation: ${flyingAnim} 3.5s ease-in-out infinite;
    animation-delay: 0s;
  }
`

export const StyledBunnyAccessory = styled.img`
  position: absolute;
  left: 0;
  top: 0;
  z-index: 5;
`
