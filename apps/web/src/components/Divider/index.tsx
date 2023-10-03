import { styled } from 'styled-components'

const Divider = styled.hr`
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  width: 100%;
`

export default Divider
