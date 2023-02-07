import { ReactElement } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { Container, LinkExternal } from '@pancakeswap/uikit'
import IfoLayout, { IfoLayoutWrapper } from './IfoLayout'
import IfoPoolVaultCard from './IfoPoolVaultCard'

interface TypeProps {
  ifoSection: ReactElement
}

const IfoContainer: React.FC<React.PropsWithChildren<TypeProps>> = ({ ifoSection }) => {
  const { t } = useTranslation()

  return (
    <IfoLayout id="current-ifo" py={['24px', '24px', '40px']}>
      <Container>
        <IfoLayoutWrapper>
          <IfoPoolVaultCard />
          {ifoSection}
        </IfoLayoutWrapper>
      </Container>
      <Container>
        <LinkExternal href="https://docs.pancakeswap.finance/aptos-deployment" mx="auto" mt="16px">
          {t('Apply to run an IFO!')}
        </LinkExternal>
      </Container>
    </IfoLayout>
  )
}

export default IfoContainer
