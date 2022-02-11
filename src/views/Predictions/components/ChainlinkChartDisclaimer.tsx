import React from 'react'
import {
  ModalContainer,
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
import { useTranslation } from 'contexts/Localization'
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

const ChartDisclaimer: React.FC<InjectedModalProps> = ({ onDismiss }) => {
  const [showDisclaimer, setShowDisclaimer] = useUserPredictionChainlinkChartDisclaimerShow()
  const { t } = useTranslation()

  const handleConfirm = () => {
    onDismiss()
  }

  return (
    <ModalContainer minWidth="320px">
      <ModalBody p="24px" maxWidth="400px">
        <Flex justifyContent="center" mb="32px">
          <Image src="/images/predictions/chartwarning2.svg" width={190} height={118} />
        </Flex>
        <Heading as="h3" size="sm">
          {t('Important Information')}:
        </Heading>
        <Heading as="h4" size="sm" mb="24px">
          {t('Currently showing charts from Chainlink.')}:
        </Heading>
        <Ul>
          <li>{t('Prices chart is in relatively low fidelity.')}</li>
          <li>{t('Prices on charts is in relatively slower to respond.')}</li>
        </Ul>
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
