import React from 'react'
import styled from 'styled-components'
import Footer from '../Footer'

const Page: React.FC = ({ children }) => (
  <StyledPage>
    <StyledMain>{children}</StyledMain>
    <Footer />
  </StyledPage>
)

const StyledPage = styled.div`

`

const StyledMain = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 145px);
  @media (max-width: 500px) {
    width: 100vw;
  }
`

export default Page
