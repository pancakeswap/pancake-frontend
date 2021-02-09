import React from 'react'
import styled from 'styled-components'

const Label = styled.div`
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.textSubtle};
  text-align: left;
`

const ContentContainer = styled.div`
  min-height: 1.5rem;
  display: flex;
  align-items: center;
`

interface CellLayoutProps {
  label: string
}

const CellLayout: React.FunctionComponent<CellLayoutProps> = ({ label, children }) => {
  return (
    <div>
      <Label>
        {label}
      </Label>
      <ContentContainer>
        {children}
      </ContentContainer>
    </div>
  )
}

export default CellLayout