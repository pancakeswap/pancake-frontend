import { styled } from 'styled-components'
import { Box, Text, lightColors, useMatchBreakpoints, BoxProps } from '@pancakeswap/uikit'
import CountUp from 'react-countup'
import useTheme from 'hooks/useTheme'

export const Divider = styled.div`
  height: 45px;
  width: 1px;
  background-color: ${lightColors.inputSecondary};
`

interface MetricsCardProps extends BoxProps {
  title: string
  value: number
  description: string
  prefix?: string
}

export const MetricsCard: React.FC<MetricsCardProps> = ({ title, value, description, prefix, ...rest }) => {
  const { theme } = useTheme()
  const { isMobile } = useMatchBreakpoints()
  return (
    <Box {...rest}>
      <Text fontSize={isMobile ? '16px' : '20px'} textAlign="center" fontWeight={600} lineHeight="120%">
        {title}
      </Text>
      <Text
        lineHeight="110%"
        textAlign="center"
        fontWeight={600}
        fontSize={isMobile ? '32px' : '40px'}
        color={theme.colors.secondary}
      >
        <CountUp
          start={0}
          preserveValue
          delay={0}
          end={value}
          decimalPlaces={3}
          decimals={0}
          duration={1}
          prefix={prefix ?? ''}
          separator=","
        >
          {({ countUpRef }) => <span ref={countUpRef} />}
        </CountUp>
      </Text>
      <Text
        fontSize={isMobile ? '14px' : '16px'}
        textAlign="center"
        fontWeight={600}
        lineHeight="120%"
        color={theme.colors.textSubtle}
      >
        {description}
      </Text>
    </Box>
  )
}
