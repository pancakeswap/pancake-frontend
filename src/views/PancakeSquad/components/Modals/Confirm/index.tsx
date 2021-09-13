/* eslint-disable react/no-array-index-key */
import {
  Box,
  Button,
  CloseIcon,
  Flex,
  Heading,
  IconButton,
  Link,
  LinkExternal,
  ModalBody,
  ModalContainer,
  ModalHeader,
  ModalProps,
  ModalTitle,
  Spinner,
  Text,
} from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import React, { useEffect, useState } from 'react'

const ConfirmModal: React.FC<ModalProps> = ({ onDismiss, title, headerBackground }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [isConfirmationLoading, setIsConfirmationLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setIsConfirmationLoading(false), 4000)
  }, [])

  return (
    <ModalContainer minWidth="375px">
      <ModalHeader background={headerBackground}>
        <ModalTitle>
          <Heading>{title}</Heading>
        </ModalTitle>
        <IconButton variant="text" onClick={onDismiss}>
          <CloseIcon width="24px" color="text" />
        </IconButton>
      </ModalHeader>
      <ModalBody py="24px" maxWidth="375px" width="100%">
        <Flex flexDirection="column" alignItems="center">
          {isConfirmationLoading ? (
            <>
              <Spinner />
              <Text mt="24px" bold>
                {t('Confirm transaction in your wallet')}
              </Text>
            </>
          ) : (
            <>
              <Text mb="30px" bold>
                {t('Transaction Submitted')}
              </Text>
              <LinkExternal mb="30px">{t('View on BscScan')}</LinkExternal>
              <Flex
                justifyContent="center"
                width="100%"
                px="16px"
                pt="16px"
                borderTop={`1px solid ${theme.colors.cardBorder}`}
              >
                <Button width="100%" variant="secondary">
                  {t('Mint More')}
                </Button>
              </Flex>
            </>
          )}
        </Flex>
      </ModalBody>
    </ModalContainer>
  )
}

export default ConfirmModal
