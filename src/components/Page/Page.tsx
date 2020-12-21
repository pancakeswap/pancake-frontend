import React from 'react'
import styled from 'styled-components'

const Page: React.FC = ({ children }) => <StyledMain>{children}</StyledMain>

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
