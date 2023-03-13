import { useMemo } from 'react'
import styled from 'styled-components'
import { Box, Card, Flex, Text, Balance } from '@pancakeswap/uikit'
import PieChartContainer from './PieChartContainer'

const StyledFlex = styled(Flex)`
  flex: 1;
  flex-direction: column;
`

const CardInner = styled(Flex)`
  width: 100%;
  height: 100%;
  justify-content: space-between;

  ${StyledFlex} {
    &:first-child {
      height: 66px;
      border-right: ${({ theme }) => `solid 1px ${theme.colors.inputSecondary}`};
    }
  }
`

const StyledCircle = styled(Flex)`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${({ theme }) => `${theme.colors.primary}`};
`

const CommissionInfo = () => {
  const arrow = useMemo(() => {
    // eslint-disable-next-line no-constant-condition
    const directionArrow = true ? '↑' : '↓'
    return directionArrow
  }, [])

  return (
    <Box width={['100%', '100%', '100%', '100%', '100%', '387px']}>
      <Card>
        <Box padding={['24px']}>
          <CardInner mb="28px">
            <StyledFlex>
              <Text color="secondary" bold fontSize={['12px']} textTransform="uppercase">
                active friends
              </Text>
              <Text fontSize={['32px']} bold>
                123
              </Text>
              <Text fontSize="12px" color="success">{`${arrow} 31.53%`}</Text>
            </StyledFlex>
            <StyledFlex pl="10%">
              <Text color="secondary" bold fontSize={['12px']} textTransform="uppercase">
                total cake earned
              </Text>
              <Balance fontSize={['32px']} bold value={1234} decimals={0} />
              <Balance color="textSubtle" prefix="$ " unit=" USD" fontSize="14px" decimals={0} value={1234} />
              <Text fontSize="12px" color="success">{`${arrow} 31.53%`}</Text>
            </StyledFlex>
          </CardInner>
          <Box mb="24px">
            <Text mb="16px" color="secondary" bold fontSize={['12px']} textTransform="uppercase">
              rewards breakdown
            </Text>
            <PieChartContainer />
          </Box>
          <Flex>
            <Flex width="100%" justifyContent="space-between" mb="16px">
              <Flex>
                <StyledCircle />
                <Text ellipsis ml="8px" fontSize={['14px']}>
                  v2/v3 Swaps & StableSwap
                </Text>
              </Flex>
              <Box ml="10px">
                <Text bold fontSize={['16px']}>
                  40.1%
                </Text>
                <Text color="textSubtle" fontSize={['14px']}>
                  (494 CAKE)
                </Text>
              </Box>
            </Flex>
          </Flex>
        </Box>
      </Card>
    </Box>
  )
}

export default CommissionInfo
