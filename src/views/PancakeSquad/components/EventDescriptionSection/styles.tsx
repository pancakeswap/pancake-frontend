import { Flex, lightColors } from '@pancakeswap/uikit'
import styled from 'styled-components'

export const StyledEventDescriptionSectionContainer = styled(Flex)`
  background: ${({ theme }) => theme.colors.background};
`

export const StyledBodyTextList = styled('ul')`
  color: ${lightColors.textSubtle};
  margin-bottom: 24px;
`

export const StyledBodyTextElement = styled('li')`
  margin-left: 12px;
`
