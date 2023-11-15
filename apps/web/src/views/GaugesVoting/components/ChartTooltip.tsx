import { ChainId } from '@pancakeswap/chains'
import { Percent } from '@pancakeswap/swap-sdk-core'
import { USDC } from '@pancakeswap/tokens'
import { Flex, Text } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import styled from 'styled-components'
import { zeroAddress } from 'viem'
import { TripleLogo } from './TripleLogo'
import { GaugeVoting } from '../hooks/useGaugesVoting'

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

  ${Indicator} {
    transition: all 0.25s ease-in-out;
    border-color: ${({ color }) => color || '#8051d6'};
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%),
      ${({ color }) => color || '#8051d6'};
  }

  ${Content} {
    transition: border-color 0.25s ease-in-out;
    border-color: ${({ color }) => color || '#8051d6'};
  }
`

export const ChartTooltip: React.FC<{
  color: string
  visible: boolean
  gauge?: GaugeVoting
  total?: number
  allGauges?: GaugeVoting[]
}> = ({ color, allGauges, gauge, visible, total }) => {
  const sortedGauges = useMemo(() => {
    return allGauges?.sort((a, b) => (a.weight > b.weight ? 1 : -1))
  }, [allGauges])
  const sort = useMemo(() => {
    if (!gauge?.weight) return '0'
    const index = sortedGauges?.findIndex((g) => g.hash === gauge.hash) ?? 0
    if (index < 10) return `0${index + 1}`
    return index
  }, [gauge?.hash, gauge?.weight, sortedGauges])
  const percent = useMemo(() => {
    return new Percent(gauge?.weight ?? 0, total || 1).toFixed(2)
  }, [total, gauge?.weight])

  if (!visible) return null

  return (
    <Tooltip color={color}>
      <Indicator>
        <Text color="white" mb="4px">
          #{sort}{' '}
        </Text>
        <Text color="white" fontSize={18} bold>
          {percent}%
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
