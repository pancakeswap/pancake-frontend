import { ReactElement } from 'react'
import styled from 'styled-components'
import { Box } from '@pancakeswap/uikit'

import Container from 'components/Layout/Container'

import IfoLayout, { IfoLayoutWrapper } from './IfoLayout'
import IfoPoolVaultCard from './IfoPoolVaultCard'
import IfoQuestions from './IfoQuestions'

const IfoStepBackground = styled(Box)`
  background: ${({ theme }) => theme.colors.gradients.bubblegum};
`

interface TypeProps {
  ifoSection: ReactElement
  ifoSteps: ReactElement
}

const IfoContainer: React.FC<TypeProps> = ({ ifoSection, ifoSteps }) => (
  <IfoLayout id="current-ifo" py={['24px', '24px', '40px']}>
    <Container>
      <IfoLayoutWrapper>
        <IfoPoolVaultCard />
        {ifoSection}
      </IfoLayoutWrapper>
    </Container>
    <IfoStepBackground>
      <Container>{ifoSteps}</Container>
    </IfoStepBackground>
    <Container>
      <IfoQuestions />
    </Container>
  </IfoLayout>
)

export default IfoContainer
