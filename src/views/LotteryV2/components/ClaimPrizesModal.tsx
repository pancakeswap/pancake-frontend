import React from 'react'
import styled from 'styled-components'
import { Modal } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import { LotteryTicketClaimData } from 'config/constants/types'
import ClaimPrizesInner from './ClaimPrizesInner'

const StyledModal = styled(Modal)`
  min-width: 280px;
  /* max-width: 320px; */

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 380px;
  }
`

interface ClaimPrizesModalModalProps {
  roundsToClaim: LotteryTicketClaimData[]
  onDismiss?: () => void
}

const ClaimPrizesModal: React.FC<ClaimPrizesModalModalProps> = ({ onDismiss, roundsToClaim }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  return (
    <StyledModal
      title={`${t('Collect winnings')}`}
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradients.cardHeader}
    >
      <ClaimPrizesInner
        onSuccess={() => {
          onDismiss()
        }}
        roundsToClaim={roundsToClaim}
      />
    </StyledModal>
  )
}

export default ClaimPrizesModal
