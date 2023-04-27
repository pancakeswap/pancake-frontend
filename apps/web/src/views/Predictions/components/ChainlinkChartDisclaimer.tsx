import {
  ModalWrapper,
  ModalBody,
  Text,
  Button,
  InjectedModalProps,
  Flex,
  Image,
  Heading,
  Checkbox,
  Box,
} from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { useUserPredictionChainlinkChartDisclaimerShow } from 'state/user/hooks'

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
  const [showDisclaimer, setShowDisclaimer] = useUserPredictionChainlinkChartDisclaimerShow()
  const { t } = useTranslation()

  const handleConfirm = () => {
    onDismiss()
  }

  return (
    <ModalWrapper minWidth="320px">
      <ModalBody p="24px" maxWidth="400px">
        <Flex justifyContent="center" mb="32px">
          <Image src="/images/predictions/chartwarning2.svg" width={190} height={118} />
        </Flex>
        <Heading as="h3" size="sm">
          {t('Currently showing charts from Chainlink oracle')}
        </Heading>
        <Text color="textSubtle" fontSize="14px" my="24px">
          {t('The price you see come directly from the Chainlink oracle, which powers the Prediction game.')}
        </Text>
        <Ul>
          <li>{t('Oracle price refreshes every ~20 seconds.')}</li>
          <li>{t('When compared to TradingView chart. This chart refreshes slower and with fewer features.')}</li>
        </Ul>
        <Box>
          <Button width="100%" variant="primary" onClick={handleConfirm} my="16px">
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
