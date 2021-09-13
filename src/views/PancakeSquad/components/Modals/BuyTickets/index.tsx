/* eslint-disable react/no-array-index-key */
import {
  Box,
  Button,
  CloseIcon,
  Flex,
  Heading,
  IconButton,
  InfoIcon,
  ModalBody,
  ModalContainer,
  ModalHeader,
  ModalProps,
  ModalTitle,
  Text,
} from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import React, { useState } from 'react'

const MAX_TICKETS_BUY = 5

interface BuyTicketsModalProps extends ModalProps {
  onSuccess: () => void
}

const BuyTicketsModal: React.FC<BuyTicketsModalProps> = ({ onDismiss, onSuccess, title, headerBackground }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const buyButtons = new Array(MAX_TICKETS_BUY).fill('')
  const [ticketsNumber, setTicketsNumber] = useState<number | null>(null)

  const onConfirm = () => {
    onSuccess()
  }

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
        <Flex flexDirection="column">
          <Box px="16px">
            <Text fontSize="12px" fontWeight="600" textTransform="uppercase" color="secondary" mb="16px">
              {t('Buy how many?')}
            </Text>
            <Flex justifyContent="space-between" mb="24px">
              {buyButtons.map((_, index) => (
                <Button
                  key={index}
                  variant={index === ticketsNumber ? 'primary' : 'tertiary'}
                  onClick={() => setTicketsNumber(index)}
                >
                  {index + 1}
                </Button>
              ))}
            </Flex>
            <Flex mb="8px" justifyContent="space-between">
              <Text font-size="14px" color="textSubtle">
                {t('Cost per Ticket')}
              </Text>
              <Text font-size="14px">5 CAKE</Text>
            </Flex>
            <Flex mb="8px" justifyContent="space-between">
              <Text font-size="14px" color="textSubtle">
                {t('Your CAKE Balance')}
              </Text>
              <Text font-size="14px">100 CAKE</Text>
            </Flex>
            <Flex
              mb="8px"
              pb="8px"
              justifyContent="space-between"
              font-size="14px"
              color="textSubtle"
              borderBottom={`1px solid ${theme.colors.cardBorder}`}
            >
              <Text font-size="14px" color="textSubtle">
                {t('Your remaining limit')}
              </Text>
              <Text font-size="14px">20 {t('Tickets')}</Text>
            </Flex>
            <Flex mb="25px" justifyContent="space-between">
              <Text font-size="14px" color="textSubtle">
                {t('Total Cost')}
              </Text>
              <Text font-size="14px" bold>
                15 CAKE
              </Text>
            </Flex>
          </Box>
          <Flex
            px="16px"
            py="24px"
            mb="16px"
            background={theme.colors.background}
            borderBottom={`1px solid ${theme.colors.cardBorder}`}
            borderTop={`1px solid ${theme.colors.cardBorder}`}
            alignItems="start"
          >
            <Box>
              <InfoIcon width="20px" mt="4px" mr="10px" color="textSubtle" />
            </Box>
            <Text font-size="12px" color="textSubtle">
              {t('The network may become busy during the sale period. Consider setting a high gas fee (GWEI).')}
              <br />
              <br />
              {t('Max. Tickets per transaction: 5')}s
              <br />
              {t('Max. Tickets per wallet: 20')}
              <br />
            </Text>
          </Flex>
          <Box px="16px">
            <Button onClick={onConfirm} width="100%">
              {t('Confirm')}
            </Button>
          </Box>
        </Flex>
      </ModalBody>
    </ModalContainer>
  )
}

export default BuyTicketsModal
