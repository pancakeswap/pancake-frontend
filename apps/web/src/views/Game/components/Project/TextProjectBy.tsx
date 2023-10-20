import { styled } from 'styled-components'
import { Flex, Text } from '@pancakeswap/uikit'

const StyledProjectBy = styled(Flex)`
  display: none;

  ${({ theme }) => theme.mediaQueries.md} {
    display: flex;
    position: absolute;
    top: 0px;
    right: 0;
  }
`

export const TextProjectBy = () => {
  return (
    <StyledProjectBy px="24px">
      <Text fontSize="14px" color="textSubtle">
        GAME NAME
      </Text>
      <Text fontSize="14px" m="0 4px" color="textSubtle">
        By
      </Text>
      <Text fontSize="14px" color="primary">
        Dev
      </Text>
    </StyledProjectBy>
  )
}
