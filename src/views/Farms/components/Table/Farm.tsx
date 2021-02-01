import React from 'react'
import styled from 'styled-components'

export interface FarmProps {
  image: string
  label: string
}

const Icon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 0.5rem;
`

const Label = styled.span`
  white-space: nowrap;
  color: ${(props) => props.theme.colors.text};
`

const Farm: React.FunctionComponent<FarmProps> = ({ image, label }) => {
  return (
    <>
      <Icon src={`/images/farms/${image}.svg`} alt="icon" />
      <Label>{label}</Label>
    </>
  )
}

export default Farm
