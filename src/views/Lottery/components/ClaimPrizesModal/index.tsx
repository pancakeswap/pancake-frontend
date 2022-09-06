import { useEffect } from 'react'
import styled from 'styled-components'
import { Heading, ModalContainer, ModalHeader, ModalTitle, ModalBody, ModalCloseButton } from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useTranslation } from '@pancakeswap/localization'
import delay from 'lodash/delay'
import confetti from 'canvas-confetti'
import { LotteryTicketClaimData } from 'config/constants/types'
import { useAppDispatch } from 'state'
import { useLottery } from 'state/lottery/hooks'
import { fetchUserLotteries } from 'state/lottery'
import ClaimPrizesInner from './ClaimPrizesInner'

const StyledModal = styled(ModalContainer)`
  position: relative;
  overflow: visible;

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 380px;
  }
`

const StyledModalHeader = styled(ModalHeader)`
  background: ${({ theme }) => theme.colors.gradientCardHeader};
  border-top-right-radius: 32px;
  border-top-left-radius: 32px;
`

const BunnyDecoration = styled.div`
  position: absolute;
  top: -116px; // line up bunny at the top of the modal
  left: 0px;
  text-align: center;
  width: 100%;
`

const showConfetti = () => {
  confetti({
    particleCount: 200,
    startVelocity: 30,
    gravity: 0.5,
    spread: 350,
    origin: {
      x: 0.5,
      y: 0.3,
    },
  })
}

interface ClaimPrizesModalModalProps {
  roundsToClaim: LotteryTicketClaimData[]
  onDismiss?: () => void
}

const ClaimPrizesModal: React.FC<React.PropsWithChildren<ClaimPrizesModalModalProps>> = ({
  onDismiss,
  roundsToClaim,
}) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { currentLotteryId } = useLottery()
  const dispatch = useAppDispatch()

  useEffect(() => {
    delay(showConfetti, 100)
  }, [])

  return (
    <StyledModal $minWidth="280px">
      <BunnyDecoration>
        <img src="/images/decorations/prize-bunny.png" alt="bunny decoration" height="124px" width="168px" />
      </BunnyDecoration>
      <StyledModalHeader>
        <ModalTitle>
          <Heading>{t('Collect Winnings')}</Heading>
        </ModalTitle>
        <ModalCloseButton onDismiss={onDismiss} />
      </StyledModalHeader>
      <ModalBody p="24px">
        <ClaimPrizesInner
          onSuccess={() => {
            dispatch(fetchUserLotteries({ account, currentLotteryId }))
            onDismiss?.()
          }}
          roundsToClaim={roundsToClaim}
        />
      </ModalBody>
    </StyledModal>
  )
}

export default ClaimPrizesModal
