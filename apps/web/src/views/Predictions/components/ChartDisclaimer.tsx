import { useTranslation } from '@pancakeswap/localization'
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Image,
  InjectedModalProps,
  LinkExternal,
  ModalBody,
  ModalWrapper,
  Text,
} from '@pancakeswap/uikit'
import { useUserPredictionChartDisclaimerShow } from 'state/user/hooks'
import { styled } from 'styled-components'
import { useConfig } from '../context/ConfigProvider'

const Ul = styled.ul`
  color: ${({ theme }) => theme.colors.textSubtle};
  list-style-position: outside;
  margin-left: 16px;

  & > li {
    font-size: 14px;
    line-height: 1.5;
  }
`

const ChartDisclaimer: React.FC<React.PropsWithChildren<InjectedModalProps>> = ({ onDismiss }) => {
  const [showDisclaimer, setShowDisclaimer] = useUserPredictionChartDisclaimerShow()

  const config = useConfig()
  const { t } = useTranslation()

  const handleConfirm = () => {
    onDismiss?.()
  }

  return (
    <ModalWrapper minWidth="320px">
      <ModalBody p="24px" maxWidth="400px">
        <Flex justifyContent="center" mb="32px">
          <Image src="/images/predictions/chartwarning.svg" width={190} height={118} />
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
          {config?.chainlinkOracleAddress && (
            <li>{t('Prices on cards come from Chainlink’s verifiable price oracle.')}</li>
          )}
          <li>{t("Prices on charts come from Binance.com. Chart's are provided for your reference only.")}</li>
        </Ul>
        <Text as="p" mb="16px" fontSize="14px" color="textSubtle">
          {t("Only the price shown on the cards determines the round's result.")}
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
    </ModalWrapper>
  )
}

export default ChartDisclaimer
