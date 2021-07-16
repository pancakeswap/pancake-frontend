import styled from 'styled-components'

const Container = styled.div`
  background: ${({ theme }) => theme.colors.background};
  height: calc(100vh - 64px);
  min-height: calc(100vh - 64px);
  overflow: hidden;
  position: relative;
`

export default Container
