import { styled } from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { Flex, Message, MessageText } from '@pancakeswap/uikit'
import { Views } from 'views/AffiliatesProgram/components/OnBoardingModal/index'
import useShowWarningMessage from 'views/AffiliatesProgram/hooks/useShowWarningMessage'
import WelcomePage from './WelcomePage'
import Congratulations from './Congratulations'
import StepIntro from './StepIntro'

interface MobileViewProps {
  currentView: Views
  isLoading: boolean
  onDismiss: () => void
  handleStartNow: () => void
}

const Container = styled(Flex)`
  position: absolute;
  bottom: 0;
  width: 100%;
  border-radius: ${({ theme }) => `${theme.radii.card} ${theme.radii.card} 0 0`};
  background: ${({ theme }) => theme.colors.gradientCardHeader};
  z-index: 20;
  flex-direction: column;
`

const WhiteBackground = styled('div')`
  background: ${({ theme }) => theme.card.background};
  border-radius: ${({ theme }) => `${theme.radii.card} ${theme.radii.card} 0 0`};
  border-bottom: ${({ theme }) => `solid 1px ${theme.colors.inputSecondary}`};
`

const MobileView: React.FC<React.PropsWithChildren<MobileViewProps>> = ({
  currentView,
  isLoading,
  onDismiss,
  handleStartNow,
}) => {
  const { t } = useTranslation()
  const showWarningMessage = useShowWarningMessage()
  return (
    <Container>
      <WhiteBackground>
        {showWarningMessage && (
          <Message variant="warning" m="16px 16px 0 16px">
            <MessageText>
              {t(
                'Affiliate program registration is paused at the moment. Please check back after subgraph status is restored',
              )}
            </MessageText>
          </Message>
        )}
        {currentView === Views.STEP1 ? (
          <WelcomePage isLoading={isLoading} handleStartNow={handleStartNow} onDismiss={onDismiss} />
        ) : (
          <Congratulations />
        )}
      </WhiteBackground>
      <StepIntro />
    </Container>
  )
}

export default MobileView
