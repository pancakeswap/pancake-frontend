import React from 'react'
import styled from 'styled-components'

interface LabelProps {
  text?: string
  isFinished?: boolean
}

const Label: React.FC<LabelProps> = ({ text, isFinished = false }) => (
  <StyledLabel isFinished={isFinished}>{text}</StyledLabel>
)

const StyledLabel = styled.div<{ isFinished: boolean }>`
  color: ${({ isFinished, theme }) => theme.colors[isFinished ? 'textDisabled' : 'primary']};
  font-size: 14px;
`

export default Label
