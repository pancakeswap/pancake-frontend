import { useTranslation } from '@pancakeswap/localization'
import { Modal } from '@pancakeswap/uikit'
import { LotteryStatus } from 'config/constants/types'
import useTheme from 'hooks/useTheme'
import { useLottery } from 'state/lottery/hooks'
import { styled } from 'styled-components'
import CurrentRoundTicketsInner from './CurrentRoundTicketsInner'
import PreviousRoundTicketsInner from './PreviousRoundTicketsInner'

const StyledModal = styled(Modal)`
  ${({ theme }) => theme.mediaQueries.md} {
    width: 280px;
  }
`

interface ViewTicketsModalProps {
  roundId: string | null
  roundStatus?: LotteryStatus
  onDismiss?: () => void
}

const ViewTicketsModal: React.FC<React.PropsWithChildren<ViewTicketsModalProps>> = ({
  onDismiss,
  roundId,
  roundStatus,
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { currentLotteryId } = useLottery()
  const isPreviousRound = roundStatus?.toLowerCase() === LotteryStatus.CLAIMABLE || roundId !== currentLotteryId

  return (
    <StyledModal
      title={`${t('Round')} ${roundId}`}
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradientCardHeader}
    >
      {isPreviousRound ? <PreviousRoundTicketsInner roundId={roundId} /> : <CurrentRoundTicketsInner />}
    </StyledModal>
  )
}

export default ViewTicketsModal
