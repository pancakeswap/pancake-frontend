import React from 'react'
import styled from 'styled-components'

export interface FarmProps {
  label: string
}

const Label = styled.span`
  white-space: nowrap;
  color: ${(props) => props.theme.colors.text};
  font-weight: 600;
`

const Farm: React.FunctionComponent<FarmProps> = ({ label }) => {
  return (
    <>
      <Label>{label}</Label>
    </>
  )
}

export default Farm
