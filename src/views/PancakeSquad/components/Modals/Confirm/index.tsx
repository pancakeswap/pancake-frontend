/* eslint-disable react/no-array-index-key */
import {
  ArrowUpIcon,
  Box,
  Button,
  CloseIcon,
  Flex,
  Heading,
  IconButton,
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
import React from 'react'

const ConfirmModal: React.FC<ModalProps & { isLoading: boolean; transactionId: string }> = ({
  onDismiss,
  title,
  isLoading,
  headerBackground,
  transactionId,
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()

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
          {isLoading ? (
            <Box px="16px">
              <Flex mb="16px" alignItems="center">
                <Box mr="16px">
                  <Text fontSize="20px" bold color="secondary">
                    {t('Enable')}
                  </Text>
                  <Text fontSize="14px" color="textSubtle">
                    {t('Please enable WBNB spending in your wallet')}
                  </Text>
                </Box>
                <Spinner size={50} />
              </Flex>
              <Button width="100%" variant="secondary" disabled>
                {t('Confirming...')}
              </Button>
            </Box>
          ) : (
            <>
              <ArrowUpIcon width="60px" mb="30px" color="primary" />
              <Text mb="30px" bold>
                {t('Transaction Submitted')}
              </Text>
              <LinkExternal mb="30px">
                {t('View on BscScan')}
                {` id: ${transactionId}`}
              </LinkExternal>
              <Flex
                justifyContent="center"
                width="100%"
                px="16px"
                pt="16px"
                borderTop={`1px solid ${theme.colors.cardBorder}`}
              >
                <Button width="100%" variant="secondary" onClick={onDismiss}>
                  {t('Mint more')}
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
