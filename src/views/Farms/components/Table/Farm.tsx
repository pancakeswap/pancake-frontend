import React from 'react'
import styled from 'styled-components'

export interface FarmProps {
  label: string
  pid: number
  image: string
}

const Label = styled.span`
  white-space: nowrap;
  color: ${(props) => props.theme.colors.text};
  font-weight: 600;
`

const IconImage = styled.img`
  min-width: 40px;
  height: 40px;
  margin-right: 8px;
`

const Container = styled.div`
  padding-left: 32px;
  display: flex;
  align-items: center;
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
