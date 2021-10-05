/* eslint-disable react/no-array-index-key */
import { BigNumber } from 'ethers'
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
import { formatBigNumber } from 'utils/formatBalance'
import { SaleStatusEnum } from 'views/PancakeSquad/types'

interface BuyTicketsModalProps extends ModalProps {
  buyTicketCallBack: ({ ticketsNumber }: { ticketsNumber: number }) => void
  saleStatus: SaleStatusEnum
  cakeBalance: BigNumber
  pricePerTicket: BigNumber
  maxPerAddress: number
  maxPerTransaction: number
  numberTicketsOfUser: number
  numberTicketsForGen0: number
  numberTicketsUsedForGen0: number
}

const DEFAULT_MAX_PER_TX = 5

const BuyTicketsModal: React.FC<BuyTicketsModalProps> = ({
  onDismiss,
  buyTicketCallBack,
  title,
  headerBackground,
  saleStatus,
  cakeBalance,
  pricePerTicket,
  maxPerAddress,
  maxPerTransaction,
  numberTicketsForGen0,
  numberTicketsOfUser,
  numberTicketsUsedForGen0,
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [ticketsNumber, setTicketsNumber] = useState<number | null>(0)
  const isPreSale = saleStatus === SaleStatusEnum.Presale
  const remainingTickets = isPreSale
    ? numberTicketsForGen0
    : maxPerAddress - (numberTicketsOfUser - numberTicketsUsedForGen0)

  const maxBuyTickets = Math.min(cakeBalance.div(pricePerTicket).toNumber(), remainingTickets)
  const totalCost = pricePerTicket.mul(BigNumber.from(ticketsNumber))
  const maxBuyButtons =
    saleStatus === SaleStatusEnum.Presale
      ? Math.min(numberTicketsForGen0, DEFAULT_MAX_PER_TX)
      : Math.min(maxPerTransaction, DEFAULT_MAX_PER_TX)
  const buyButtons = new Array(maxBuyButtons).fill('')

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
                  variant={index + 1 === ticketsNumber ? 'primary' : 'tertiary'}
                  onClick={() => setTicketsNumber(index + 1)}
                  disabled={index + 1 > maxBuyTickets}
                >
                  {index + 1}
                </Button>
              ))}
            </Flex>
            <Flex mb="8px" justifyContent="space-between">
              <Text font-size="14px" color="textSubtle">
                {t('Cost per Ticket')}
              </Text>
              <Text font-size="14px">{formatBigNumber(pricePerTicket, 0)} CAKE</Text>
            </Flex>
            <Flex mb="8px" justifyContent="space-between">
              <Text font-size="14px" color="textSubtle">
                {t('Your CAKE Balance')}
              </Text>
              <Text font-size="14px">{formatBigNumber(cakeBalance, 3)} CAKE</Text>
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
              <Text font-size="14px">{`${remainingTickets} ${t('Tickets')}`}</Text>
            </Flex>
            <Flex mb="25px" justifyContent="space-between">
              <Text font-size="14px" color="textSubtle">
                {t('Total Cost')}
              </Text>
              <Text font-size="14px" bold>
                {formatBigNumber(totalCost, 0)} CAKE
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
            </Text>
            <Text font-size="12px" color="textSubtle">
              {t(`Max. Tickets per transaction: ${maxPerTransaction || DEFAULT_MAX_PER_TX}`)}
            </Text>
            {maxPerAddress > 0 && (
              <Text font-size="12px" color="textSubtle">
                {t(`Max. Tickets per wallet: ${maxPerAddress}`)}
              </Text>
            )}
          </Flex>
          <Box px="16px">
            <Button onClick={() => buyTicketCallBack({ ticketsNumber })} width="100%">
              {t('Confirm')}
            </Button>
          </Box>
        </Flex>
      </ModalBody>
    </ModalContainer>
  )
}

export default BuyTicketsModal
