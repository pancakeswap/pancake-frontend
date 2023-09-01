import { Flex } from '@pancakeswap/uikit'
import styled from 'styled-components'

const ProgressBar = (props) => {
  const { completed } = props

  const StyledContainer = styled(Flex)`
    height: 20px;
    width: '100%';
    background-color: #94949480;
    border-radius: 50px;
    overflow: hidden;
    margin: 5;
  `

  const StyledFiller = styled(Flex)`
    height: '100%';
    width: ${completed}%;
    background: linear-gradient(90deg, rgba(251, 53, 255, 1) 0%, rgba(69, 210, 255, 1) 100%);
    border-radius: 'inherit';
    border-radius: 50px;
    textalign: 'right';
  `

  return (
    <StyledContainer>
      <StyledFiller />
    </StyledContainer>
  )
}

export default ProgressBar
