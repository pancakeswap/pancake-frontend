import styled from 'styled-components'

const Layout = styled.div`
  align-items: start;
  display: grid;
  grid-gap: 32px;
  grid-template-columns: 1fr;

  ${({ theme }) => theme.mediaQueries.lg} {
    grid-template-columns: 1fr minmax(auto, 332px);
  }
`

export default Layout
