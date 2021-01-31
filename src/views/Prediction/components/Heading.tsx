import React from 'react'
import { Flex, Text, Button } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import CountDown from './CountDown'

const StyledButton = styled(Button)`
  color: ${(props) => props.theme.colors.card};
`
const SwitchBox = styled.div`
  display: flex;
  align-items: center;
  border-radius: 16px;
  border: 2px solid ${(props) => props.theme.colors.input};
`

const Heading: React.FC = () => {
  return (
    <Flex justifyContent="space-between">
      <Flex alignItems="center">
        <img src="images/tokens/BNB.png" alt="BNB" width={32} height={32} />
        <Text ml="2" mr="2" style={{ lineHeight: '26px' }} fontSize="24px" bold>
          BNB/USDT
        </Text>
        <Text ml="3" color="textSubtle">
          Pay with:{' '}
          <StyledButton size="sm" ml="2">
            BNB
          </StyledButton>
        </Text>
      </Flex>
      <SwitchBox>
        <StyledButton size="sm" mr="2">
          5m
        </StyledButton>
        <CountDown seconds={6000} style={{ width: '70px' }} />
      </SwitchBox>
    </Flex>
  )
}

export default Heading
