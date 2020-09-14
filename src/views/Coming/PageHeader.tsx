import React from 'react'
import styled from 'styled-components'

import Container from '../../components/Container'

interface PageHeaderProps {
  icon: React.ReactNode
  subtitle?: string
  title?: string
}

const PageHeader: React.FC<PageHeaderProps> = ({ icon, subtitle, title }) => {
  return (
    <Container size="sm">
      <StyledPageHeader>
        <StyledIcon>{icon}</StyledIcon>
        <StyledTitle>{title}</StyledTitle>
        <StyledSubtitle>{subtitle}</StyledSubtitle>
      </StyledPageHeader>
    </Container>
  )
}

const StyledPageHeader = styled.div`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding-bottom: ${(props) => props.theme.spacing[6]}px;
  padding-top: ${(props) => props.theme.spacing[6]}px;
  margin: 20px auto;
`

const StyledIcon = styled.div`
  font-size: 190px;
  height: 190px;
  line-height: 190px;
  text-align: center;
  width: 190px;
  img {
    width: 100%;
    height: 100%;
  }
`

const StyledTitle = styled.h1`
  font-family: 'monospace', sans-serif;
  color: ${(props) => props.theme.color.blue[100]};
  font-size: 36px;
  font-weight: 700;
  margin: 0;
  margin-top: 10px;
  padding: 0;
`

const StyledSubtitle = styled.h3`
  color: ${(props) => props.theme.color.grey[400]};
  font-size: 18px;
  font-weight: 400;
  margin: 0;
  padding: 0;
  text-align: center;
`

export default PageHeader
