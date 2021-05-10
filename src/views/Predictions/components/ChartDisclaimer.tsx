import React from 'react'
import { ModalContainer, ModalBody, Text, Button, InjectedModalProps, LinkExternal, Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

interface ChartDisclaimerProps extends InjectedModalProps {
  onSuccess: () => void
}

const ChartDisclaimer: React.FC<ChartDisclaimerProps> = ({ onSuccess, onDismiss }) => {
  const { t } = useTranslation()

  const handleConfirm = () => {
    onSuccess()
    onDismiss()
  }

  return (
    <ModalContainer title={t('Welcome!')} minWidth="320px">
      <ModalBody p="24px" maxWidth="400px">
        <Text as="p" mb="16px">
          {t('Charts are provided for reference only, and do not reflect rounds’ final outcome.')}
        </Text>
        <Text as="p" mb="16px">
          {t('Please refer to the prices shown on the cards for the final outcome.')}
        </Text>
        <Button width="100%" onClick={handleConfirm} mb="16px">
          {t('I understand')}
        </Button>
        <Flex justifyContent="center" alignItems="center">
          <LinkExternal
            href="https://docs.pancakeswap.finance/products/prediction/prediction-faq#what-are-you-using-for-your-price-feed"
            external
          >
            {t('Learn More')}
          </LinkExternal>
        </Flex>
      </ModalBody>
    </ModalContainer>
  )
}

export default ChartDisclaimer
