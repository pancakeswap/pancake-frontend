import styled from 'styled-components'
import { Box, Text, lightColors } from '@pancakeswap/uikit'
import CountUp from 'react-countup'
import useTheme from 'hooks/useTheme'

export const Divider = styled.div`
  height: 45px;
  width: 1px;
  background-color: ${lightColors.inputSecondary};
`

export const MetricsCard: React.FC<{ title: string; value: number; description: string }> = ({
  title,
  value,
  description,
}) => {
  const { theme } = useTheme()
  return (
    <Box>
      <Text fontSize={16} lineHeight="120%">
        {title}
      </Text>
      <Text lineHeight="110%" fontSize="24px" color={theme.colors.secondary}>
        <CountUp
          start={0}
          preserveValue
          delay={0}
          end={value}
          decimalPlaces={3}
          prefix="$"
          decimals={0}
          duration={1}
          separator=","
        >
          {({ countUpRef }) => <span ref={countUpRef} />}
        </CountUp>
      </Text>
      <Text fontSize={16} lineHeight="120%" color={theme.colors.textSubtle}>
        {description}
      </Text>
    </Box>
  )
}
