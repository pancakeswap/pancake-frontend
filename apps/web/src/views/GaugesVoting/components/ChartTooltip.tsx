import { GAUGE_TYPE_NAMES, Gauge, GaugeType } from '@pancakeswap/gauges'
import { Percent } from '@pancakeswap/swap-sdk-core'
import { Flex, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import styled from 'styled-components'
import { feeTierPercent } from 'views/V3Info/utils'
import { TripleLogo } from './TripleLogo'

const Indicator = styled.div`
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%), #8051d6;
  border-radius: 30px 0px 0px 30px;
  border: 2px solid #8051d6;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.625em;
`

const Content = styled(Flex).attrs({ alignItems: 'center' })`
  border-radius: 0px 30px 30px 0px;
  border: 2px solid #8051d6;
  padding: 0.625em;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  gap: 0.25em;
  overflow: hidden;
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

export const OTHERS_GAUGES = '0xOTHERS'

export const ChartTooltip: React.FC<{
  color: string
  gauge?: Gauge
  total?: number
  sort: string
}> = ({ color, sort, gauge, total }) => {
  const { isDesktop } = useMatchBreakpoints()
  const percent = useMemo(() => {
    return new Percent(gauge?.weight ?? 0, total || 1).toFixed(2)
  }, [total, gauge?.weight])
  const name = useMemo(() => {
    return gauge?.hash === OTHERS_GAUGES ? 'Others' : gauge?.pairName
  }, [gauge?.pairName, gauge?.hash])

  const desc = useMemo(() => {
    if (!gauge) return ''
    return gauge?.hash === OTHERS_GAUGES ? gauge?.pairName.split('|')[1] : GAUGE_TYPE_NAMES[gauge.type]
  }, [gauge])

  if (!gauge) return null

  return (
    <Tooltip color={color}>
      <Indicator>
        <Text color="white" fontSize={12} lineHeight="1.4">
          # {sort}{' '}
        </Text>
        <Text color="white" fontSize={18} lineHeight="1.4" bold>
          {percent}%
        </Text>
      </Indicator>
      <Content flexShrink={isDesktop ? 0 : 1}>
        <TripleLogo gaugeConfig={gauge} chainId={Number(gauge?.chainId)} size={36} />
        <Flex flexDirection="column">
          <Text fontSize={18} bold lineHeight={1.2} color="text">
            {name}
          </Text>
          <Flex alignItems="center">
            {gauge?.type === GaugeType.V3 || gauge?.type === GaugeType.V2 ? (
              <>
                <Text fontSize={12} lineHeight={1.2} color="textSubtle">
                  {feeTierPercent(gauge.feeTier)}
                </Text>
                <Text color="textSubtle" mx="0.375em" style={{ opacity: 0.2 }}>
                  |
                </Text>
              </>
            ) : null}
            <Text fontSize={12} color="textSubtle" lineHeight={1.2}>
              {desc}
            </Text>
          </Flex>
        </Flex>
      </Content>
    </Tooltip>
  )
}
