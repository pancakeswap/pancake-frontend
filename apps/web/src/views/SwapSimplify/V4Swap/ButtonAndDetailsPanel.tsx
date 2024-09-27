import { styled } from 'styled-components'

export const PanelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  padding: 16px;
  border-radius: 24px;
  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
`
interface ButtonAndDetailsPanelProps {
  swapCommitButton: React.ReactNode
  tradeDetails: React.ReactNode
}

export const ButtonAndDetailsPanel: React.FC<ButtonAndDetailsPanelProps> = ({ swapCommitButton, tradeDetails }) => {
  return (
    <PanelWrapper>
      {swapCommitButton}
      {tradeDetails}
    </PanelWrapper>
  )
}
