import { ChainId } from '@pancakeswap/chains'
import { USDC } from '@pancakeswap/tokens'
import { Flex, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { zeroAddress } from 'viem'
import { TripleLogo } from './TripleLogo'

const Indicator = styled.div`
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%), #8051d6;
  border-radius: 30px 0px 0px 30px;
  border: 2px solid #8051d6;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px;
`

const Content = styled.div`
  border-radius: 0px 30px 30px 0px;
  border: 2px solid #8051d6;
  padding: 12px;
  background: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
`

const Tooltip = styled.div.withConfig({ shouldForwardProp: (prop) => prop !== 'string' })<{ color?: string }>`
  display: inline-flex;
  pointer-events: none;

  ${Indicator} {
    border-color: ${({ color }) => color || '#8051d6'};
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%),
      ${({ color }) => color || '#8051d6'};
  }

  ${Content} {
    border-color: ${({ color }) => color || '#8051d6'};
  }
`

export const ChartTooltip: React.FC<{
  color: string
}> = ({ color }) => {
  return (
    <Tooltip color={color}>
      <Indicator>
        <Text color="white" mb="4px">
          {' '}
          #01{' '}
        </Text>
        <Text color="white" fontSize={18} bold>
          8.54%
        </Text>
      </Indicator>
      <Content>
        <TripleLogo address0={zeroAddress} address1={USDC[ChainId.ZKSYNC].address} chainId={ChainId.ZKSYNC} />
        <Flex flexDirection="column">
          <Text fontSize={18} bold>
            ETH-USDC
          </Text>
          <Flex alignItems="center">
            <Text fontSize={12} color="textSubtle">
              0.25%
            </Text>
            <Text color="rgba(40, 13, 95, 0.20)" mx="6px">
              |
            </Text>
            <Text fontSize={12} color="textSubtle">
              V3
            </Text>
          </Flex>
        </Flex>
      </Content>
    </Tooltip>
  )
}
