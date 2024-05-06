import { Flex, InfoFilledIcon, Input, InputGroup, Text } from '@pancakeswap/uikit'
import { styled } from 'styled-components'

export const StyledInputGroup = styled(InputGroup)`
  padding-right: 8px;
`

export const StyledInput = styled(Input)`
  height: 32px;
`

export const ErrorIcon = styled(InfoFilledIcon)`
  transform: rotate(180deg);
  fill: ${({ theme }) => theme.colors.failure};
`

export const InputErrorText = ({ errorText }: { errorText: string }) => {
  return (
    <Flex m="4px 0">
      <ErrorIcon width={16} height={16} />
      <Text fontSize={14} ml="4px" color="failure">
        {errorText}
      </Text>
    </Flex>
  )
}
