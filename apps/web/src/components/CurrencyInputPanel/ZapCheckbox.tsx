import { Checkbox } from '@pancakeswap/uikit'
import styled from 'styled-components'

const ZapCheckBoxWrapper = styled.label`
  display: grid;
  place-content: center;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 8px 0px 0px 0px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-right: none;
  width: 40px;
`

export const ZapCheckbox = (props) => {
  return (
    <ZapCheckBoxWrapper>
      <Checkbox scale="sm" {...props} />
    </ZapCheckBoxWrapper>
  )
}
