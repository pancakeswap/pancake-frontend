import React from 'react'
import styled from 'styled-components'

const Image = styled.img`
  margin-right: 16px;
  width: 56px;
`

const Content = styled.div`
  flex: 1;
`

const StyledCardContent = styled.div`
  align-items: start;
  display: flex;
`

const CardContent = ({ imgSrc, children }) => {
  return (
    <StyledCardContent>
      <Image src={imgSrc} alt="card icon" />
      <Content>{children}</Content>
    </StyledCardContent>
  )
}

export default CardContent
