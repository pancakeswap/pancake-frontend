import styled from 'styled-components'

const IfoCardLayout = styled.div`
  align-items: start;
  border-top: 2px solid ${({ theme }) => theme.colors.textSubtle};
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 32px;
  padding-bottom: 40px;
  padding-top: 40px;
`

export default IfoCardLayout
