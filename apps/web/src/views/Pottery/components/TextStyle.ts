import { styled } from 'styled-components'
import { Text } from '@pancakeswap/uikit'

export const OutlineText = styled(Text)<{ defaultType?: boolean }>`
  padding: 0 2px;
  color: ${({ theme, defaultType }) => (defaultType ? '#ffffff' : theme.colors.secondary)};
  background: ${({ theme, defaultType }) => (defaultType ? theme.colors.secondary : '#ffffff')};
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-stroke: 4px transparent;
  text-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2), 0px 4px 12px rgba(14, 14, 44, 0.1);
`

export const DarkTextStyle = styled(Text)`
  color: #280d5f;
`
