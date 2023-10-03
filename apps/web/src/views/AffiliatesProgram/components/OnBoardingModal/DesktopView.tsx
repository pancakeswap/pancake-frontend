import { styled } from 'styled-components'
import { Flex, Card, Message, MessageText } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { Views } from 'views/AffiliatesProgram/components/OnBoardingModal/index'
import useShowWarningMessage from 'views/AffiliatesProgram/hooks/useShowWarningMessage'
import WelcomePage from './WelcomePage'
import Congratulations from './Congratulations'
import StepIntro from './StepIntro'

const Container = styled(Flex)`
  width: 792px;
  padding: 24px;
  border-radius: ${({ theme }) => theme.radii.card};
  background: ${({ theme }) => theme.colors.gradientCardHeader};
  z-index: 20;
`

interface DesktopViewProps {
  currentView: Views
  isLoading: boolean
  onDismiss: () => void
  handleStartNow: () => void
}

const DesktopView: React.FC<React.PropsWithChildren<DesktopViewProps>> = ({
  currentView,
  isLoading,
  onDismiss,
  handleStartNow,
}) => {
  const { t } = useTranslation()
  const showWarningMessage = useShowWarningMessage()
  return (
    <Container flexDirection="column">
      {showWarningMessage && (
        <Message variant="warning" mb="16px">
          <MessageText>
            {t(
              'Affiliate program registration is paused at the moment. Please check back after subgraph status is restored',
            )}
          </MessageText>
        </Message>
      )}
      <Flex width="100%">
        <Flex width="50%" pr="12px">
          <Card style={{ width: '100%' }}>
            {currentView === Views.STEP1 ? (
              <WelcomePage isLoading={isLoading} handleStartNow={handleStartNow} onDismiss={onDismiss} />
            ) : (
              <Congratulations />
            )}
          </Card>
        </Flex>
        <Flex width="50%" pl="12px">
          <StepIntro />
        </Flex>
      </Flex>
    </Container>
  )
}

export default DesktopView
