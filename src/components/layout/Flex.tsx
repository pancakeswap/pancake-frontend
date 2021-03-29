import styled from 'styled-components'

const FlexLayout = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  & > * {
    min-width: 280px;
    width: 100%;
    margin: 0 16px;
    margin-bottom: 32px;

    ${({ theme }) => theme.mediaQueries.sm} {
      max-width: calc(33.3% - 32px);
    }
  }
`

export default FlexLayout
