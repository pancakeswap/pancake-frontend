import React from 'react'
import styled from 'styled-components'

export interface FarmProps {
  label: string
  pid: number
}

const Label = styled.span`
  white-space: nowrap;
  color: ${(props) => props.theme.colors.text};
`

const Farm: React.FunctionComponent<FarmProps> = ({ label }) => {
  return (
    <>
      <Label>{label}</Label>
    </>
  )
}

export default Farm
