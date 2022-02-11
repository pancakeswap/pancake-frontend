import * as React from 'react'
import {
  ModalContainer,
  ModalBody,
  Button,
  ModalHeader,
  ModalTitle,
  Heading,
  InjectedModalProps,
  Flex,
  Checkbox,
  Text,
} from '@tovaswapui/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'

const GradientModalHeader = styled(ModalHeader)`
  background: ${({ theme }) => theme.colors.gradients.bubblegum};
  padding-bottom: 24px;
  padding-top: 24px;
`

const BlockCountryModal: React.FC<InjectedModalProps> = ({ onDismiss }) => {
  const { t } = useTranslation()
  const [checked, setCheck] = React.useState(false)

  return (
    <ModalContainer title={t('Warning')} minWidth="320px">
      <GradientModalHeader>
        <ModalTitle>
          <Heading scale="lg">{t('Warning')}</Heading>
        </ModalTitle>
      </GradientModalHeader>
      <ModalBody p="24px" maxWidth="400px">
        <Text as="p" color="textSubtle" mb="24px">
          {t(
            'Please note that by UTC 00:00 9th March 2022, access will not be available to users with IP address from the following countries:',
          )}
          <br />
          <br />
          {t(
            'Belarus, Cuba, Democratic Republic of Congo, Iran, Iraq, North Korea, Sudan, Syria, Zimbabwe and Crimea.',
          )}
        </Text>
        <label htmlFor="block-checkbox" style={{ display: 'block', cursor: 'pointer', marginBottom: '24px' }}>
          <Flex alignItems="center">
            <div style={{ flex: 'none' }}>
              <Checkbox
                id="block-checkbox"
                scale="sm"
                checked={checked}
                onChange={() => setCheck((prevState) => !prevState)}
              />
            </div>
            <Text ml="8px">{t('I understand')}</Text>
          </Flex>
        </label>
        <Button disabled={!checked} id="prediction-disclaimer-continue" width="100%" onClick={onDismiss}>
          {t('Continue')}
        </Button>
      </ModalBody>
    </ModalContainer>
  )
}

export default BlockCountryModal
