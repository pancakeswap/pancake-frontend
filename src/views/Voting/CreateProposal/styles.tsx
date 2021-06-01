import styled from 'styled-components'

const BaseLabel = styled.label`
  color: ${({ theme }) => theme.colors.text};
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
`

export const Label = styled(BaseLabel)`
  font-size: 20px;
`

export const SecondaryLabel = styled(BaseLabel)`
  font-size: 12px;
  text-transform: uppercase;
`
