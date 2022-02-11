import React from 'react'
import {
  ModalContainer,
  ModalBody,
  Text,
  Button,
  InjectedModalProps,
  LinkExternal,
  Flex,
  Image,
  Heading,
  Checkbox,
  Box,
} from '@tovaswapui/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { useUserPredictionChartDisclaimerShow } from 'state/user/hooks'

const Ul = styled.ul`
  color: ${({ theme }) => theme.colors.textSubtle};
  list-style-position: outside;
  margin-left: 16px;

  & > li {
    font-size: 14px;
    line-height: 1.5;
  }
`

const ChartDisclaimer: React.FC<InjectedModalProps> = ({ onDismiss }) => {
  const [showDisclaimer, setShowDisclaimer] = useUserPredictionChartDisclaimerShow()
  const { t } = useTranslation()

  const handleConfirm = () => {
    onDismiss()
  }

  return (
    <ModalContainer minWidth="320px">
      <ModalBody p="24px" maxWidth="400px">
        <Flex justifyContent="center" mb="32px">
          <Image src="/images/chartwarning.svg" width={190} height={118} />
        </Flex>
        <Heading as="h3" size="sm">
          {t('Warning')}:
        </Heading>
        <Heading as="h4" size="sm" mb="24px">
          {t('Prices shown on cards and charts are different')}:
        </Heading>
        <Text as="p" fontSize="14px" color="textSubtle">
          {t('The price you see come from difference places')}:
        </Text>
        <Ul>
          <li>{t('Prices on cards come from Chainlink’s verifiable price oracle.')}</li>
          <li>{t("Prices on charts come from Binance.com. Chart's are provided for your reference only.")}</li>
        </Ul>
        <Text as="p" mb="16px" fontSize="14px" color="textSubtle">
          {t("Only the price from Chainlink (shown on the cards) determines the round's result.")}
        </Text>
        <LinkExternal
          href="https://docs.pancakeswap.finance/products/prediction/prediction-faq#what-are-you-using-for-your-price-feed"
          external
          mb="24px"
        >
          {t('Learn More')}
        </LinkExternal>
        <Box>
          <Button width="100%" onClick={handleConfirm} mb="16px">
            {t('I understand')}
          </Button>
        </Box>
        <label htmlFor="checkbox" style={{ display: 'block', cursor: 'pointer', marginBottom: '24px' }}>
          <Flex alignItems="center">
            <div style={{ flex: 'none' }}>
              <Checkbox
                id="checkbox"
                scale="sm"
                checked={!showDisclaimer}
                onChange={() => setShowDisclaimer(!showDisclaimer)}
              />
            </div>
            <Text ml="8px">{t("Don't show this again")}</Text>
          </Flex>
        </label>
      </ModalBody>
    </ModalContainer>
  )
}

export default ChartDisclaimer
