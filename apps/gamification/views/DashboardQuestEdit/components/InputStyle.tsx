import { ErrorFillIcon, Flex, Input, InputGroup, Text } from '@pancakeswap/uikit'
import { styled } from 'styled-components'

export const StyledInputGroup = styled(InputGroup)`
  padding-right: 8px;
`

export const StyledInput = styled(Input)`
  height: 32px;

  box-shadow: ${({ theme, isError }) => {
    if (isError) {
      return `0px 0px 0px 2px ${theme.colors.failure}`
    }

    return theme.shadows.inset
  }};

  &:focus:not(:disabled) {
    box-shadow: ${({ theme, isError }) => {
      if (isError) {
        return `0px 0px 0px 2px ${theme.colors.failure}`
      }

      return theme.shadows.focus
    }};
  }
`

export const InputErrorText = ({ errorText }: { errorText: string }) => {
  return (
    <Flex m="4px 0">
      <ErrorFillIcon color="failure" width={16} height={16} />
      <Text fontSize={14} ml="4px" color="failure">
        {errorText}
      </Text>
    </Flex>
  )
}
