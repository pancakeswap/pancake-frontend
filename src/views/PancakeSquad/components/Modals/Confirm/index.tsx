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
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useTheme from 'hooks/useTheme'
import React from 'react'
import { getBscScanLink } from 'utils'
import truncateHash from 'utils/truncateHash'

type ConfirmModalProps = {
  isLoading: boolean
  txHash?: string
  loadingText: string
  loadingButtonLabel: string
  successButtonLabel: string
  onConfirmClose: () => void
} & ModalProps

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  onDismiss,
  onConfirmClose,
  title,
  isLoading,
  headerBackground,
  txHash,
  loadingText,
  loadingButtonLabel,
  successButtonLabel,
}) => {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const { theme } = useTheme()

  const onCloseCallback = () => {
    onConfirmClose()
    onDismiss?.()
  }

  return (
    <ModalContainer minWidth="375px">
      <ModalHeader background={headerBackground}>
        <ModalTitle>
          <Heading>{title}</Heading>
        </ModalTitle>
        <IconButton variant="text" onClick={onCloseCallback}>
          <CloseIcon width="24px" color="text" />
        </IconButton>
      </ModalHeader>
      <ModalBody py="24px" maxWidth="375px" width="100%">
        <Flex flexDirection="column" alignItems="center">
          {isLoading || !txHash ? (
            <Box px="16px">
              <Flex mb="16px" alignItems="center">
                <Box mr="16px">
                  <Text fontSize="20px" bold color="secondary">
                    {title}
                  </Text>
                  <Text fontSize="14px" color="textSubtle">
                    {loadingText}
                  </Text>
                </Box>
                <Spinner size={50} />
              </Flex>
              <Button width="100%" variant="secondary" disabled>
                {loadingButtonLabel}
              </Button>
            </Box>
          ) : (
            <>
              <ArrowUpIcon width="60px" mb="30px" color="primary" />
              <Text mb="30px" bold>
                {t('Transaction Submitted')}
              </Text>
              <LinkExternal href={getBscScanLink(txHash, 'transaction', chainId)} mb="30px">
                {t('View on BscScan')}: {truncateHash(txHash, 8, 0)}
              </LinkExternal>
              <Flex
                justifyContent="center"
                width="100%"
                px="16px"
                pt="16px"
                borderTop={`1px solid ${theme.colors.cardBorder}`}
              >
                <Button width="100%" variant="secondary" onClick={onCloseCallback}>
                  {successButtonLabel}
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
