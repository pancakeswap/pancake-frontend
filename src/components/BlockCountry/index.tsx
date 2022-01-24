import React from 'react'
import {
  ModalContainer,
  ModalBody,
  Button,
  ModalHeader,
  ModalTitle,
  Heading,
  Box,
  useModal,
  InjectedModalProps,
} from '@pancakeswap/uikit'
import styled from 'styled-components'
import Cookies from 'js-cookie'
import { BLOCK_COUNTRIES_COOKIE_NAME } from 'config/constants/cookie-names'

const GradientModalHeader = styled(ModalHeader)`
  background: ${({ theme }) => theme.colors.gradients.bubblegum};
  padding-bottom: 24px;
  padding-top: 24px;
`

const BlockCountryWarning: React.FC<InjectedModalProps> = ({ onDismiss }) => {
  return (
    <ModalContainer title="Warning" minWidth="320px">
      <GradientModalHeader>
        <ModalTitle>
          <Heading scale="lg">Block warning</Heading>
        </ModalTitle>
      </GradientModalHeader>
      <ModalBody p="24px" maxWidth="400px">
        <Box maxHeight="300px" overflowY="auto">
          Block country here
        </Box>
        <Button id="prediction-disclaimer-continue" width="100%" onClick={onDismiss}>
          Got it
        </Button>
      </ModalBody>
    </ModalContainer>
  )
}

function BlockCountry() {
  const [onPresentRiskDisclaimer] = useModal(<BlockCountryWarning />, false)
  const onPresentRiskDisclaimerRef = React.useRef(onPresentRiskDisclaimer)

  React.useEffect(() => {
    const isBlockCountry = Cookies.get(BLOCK_COUNTRIES_COOKIE_NAME)

    if (isBlockCountry) {
      onPresentRiskDisclaimerRef.current()
    }
  }, [onPresentRiskDisclaimerRef])

  return null
}

export default BlockCountry
