import React from 'react'
import styled from 'styled-components'
import { Modal } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import { LotteryTicketClaimData } from 'config/constants/types'
import { useAppDispatch } from 'state'
import { fetchUserLotteries } from 'state/lottery'
import ClaimPrizesInner from './ClaimPrizesInner'

const StyledModal = styled(Modal)`
  min-width: 280px;

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
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()

  return (
    <StyledModal
      title={`${t('Collect winnings')}`}
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradients.cardHeader}
    >
      <ClaimPrizesInner
        onSuccess={() => {
          dispatch(fetchUserLotteries({ account }))
          onDismiss()
        }}
        roundsToClaim={roundsToClaim}
      />
    </StyledModal>
  )
}

export default ClaimPrizesModal
