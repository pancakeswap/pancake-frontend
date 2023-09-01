import { Button, Flex, Input } from '@pancakeswap/uikit'
import styled from 'styled-components'

const ClameReward = (props) => {
  const { amount } = props

  const StyledInputContainer = styled.div`
    height: 56px;
    width: 100%;
    background-color: transparent;
    border-radius: 50px;
    border: 1px solid #949494;
    position: relative;
    padding-right: 125px;
  `

  const StyledButton = styled(Button)`
    height: 55px;
    background: linear-gradient(90deg, rgba(251, 53, 255, 1) 0%, rgba(69, 210, 255, 1) 100%);
    border-radius: 'inherit';
    border-radius: 50px;
    textalign: 'right';
    padding: 0 30px;
    box-sizing: content-box;
    position: absolute;
    right: 0;
  `

  return (
    <StyledInputContainer>
      <StyledButton>Claimed</StyledButton>
    </StyledInputContainer>
  )
}

export default ClameReward
