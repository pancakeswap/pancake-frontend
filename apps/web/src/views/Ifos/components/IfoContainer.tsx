import { useTranslation } from '@pancakeswap/localization'
import { Container, LinkExternal } from '@pancakeswap/uikit'
import { ReactNode } from 'react'
import { Address } from 'viem'

import IfoLayout, { IfoLayoutWrapper } from './IfoLayout'
import IfoPoolVaultCard from './IfoPoolVaultCard'
import { SectionBackground } from './SectionBackground'

interface TypeProps {
  ifoSection: ReactNode
  ifoSteps: ReactNode
  faq?: ReactNode
  ifoBasicSaleType?: number
  ifoAddress?: Address
}

const IfoContainer: React.FC<React.PropsWithChildren<TypeProps>> = ({
  ifoSection,
  ifoSteps,
  faq,
  ifoBasicSaleType,
  ifoAddress,
}) => {
  const { t } = useTranslation()

  return (
    <IfoLayout id="current-ifo" py={['24px', '24px', '40px']}>
      <Container>
        <IfoLayoutWrapper>
          <IfoPoolVaultCard ifoBasicSaleType={ifoBasicSaleType} ifoAddress={ifoAddress} />
          {ifoSection}
        </IfoLayoutWrapper>
      </Container>
      <SectionBackground>
        <Container>{ifoSteps}</Container>
      </SectionBackground>
      {faq}
      <LinkExternal
        href="https://docs.pancakeswap.finance/ecosystem-and-partnerships/business-partnerships/initial-farm-offerings-ifos"
        mx="auto"
        mt="16px"
      >
        {t('Apply to run an IFO!')}
      </LinkExternal>
    </IfoLayout>
  )
}

export default IfoContainer
