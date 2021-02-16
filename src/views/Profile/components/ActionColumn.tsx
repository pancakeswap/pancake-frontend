import styled from 'styled-components'

const ActionColumn = styled.div`
  flex: none;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.sm} {
    max-width: 160px;

    & > button {
      width: 100%;
    }
  }
`

export default ActionColumn
