import React from 'react'
import styled from 'styled-components'

export interface FarmProps {
  label: string
  pid: number
  image: string
}

const Label = styled.span`
  color: ${(props) => props.theme.colors.text};
  font-weight: 600;
`

const IconImage = styled.img`
  margin-right: 8px;
  min-width: 24px;
  height: 24px;

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 40px;
    height: 40px;
  }
`

const Container = styled.div`
  padding-left: 16px;
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-left: 32px;
  }
`

const Farm: React.FunctionComponent<FarmProps> = ({ image, label }) => {
  return (
    <Container>
      <IconImage src={`/images/farms/${image}.svg`} alt="icon" />
      <Label>{label}</Label>
    </Container>
  )
}

export default Farm
