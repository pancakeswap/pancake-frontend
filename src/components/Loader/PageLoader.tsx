import React from 'react'
import styled from 'styled-components'
import Page from '../Layout/Page'

const Wrapper = styled(Page)`
  display: flex;
  justify-content: center;
  align-items: center;
`

const PageLoader: React.FC = () => {
  return (
    <Wrapper>
      <img src={`${process.env.PUBLIC_URL}/images/loader.gif`} alt='loader'/>
    </Wrapper>
  )
}

export default PageLoader
