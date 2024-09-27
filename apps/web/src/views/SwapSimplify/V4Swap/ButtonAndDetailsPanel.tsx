import { styled } from 'styled-components'

export const PanelWrapper = styled.div`
  width: 100%;
  padding: 16px;
  border-radius: 24px;
  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
`
interface ButtonAndDetailsPanelProps {
  swapCommitButton: React.ReactNode
}

export const ButtonAndDetailsPanel: React.FC<ButtonAndDetailsPanelProps> = ({ swapCommitButton }) => {
  return <PanelWrapper>{swapCommitButton}</PanelWrapper>
}
