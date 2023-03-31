import styled from 'styled-components'
import { Flex } from '@pancakeswap/uikit'
import { Views } from 'views/AffiliatesProgram/components/OnBoardingModal/index'
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
  return (
    <Container>
      <WhiteBackground>
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
