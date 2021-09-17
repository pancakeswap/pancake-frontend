import React from 'react'
import { Flex, Text, Button, ArrowUpIcon, LinkExternal, ChevronLeftIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { getBscScanLink } from 'utils'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Divider } from './styles'

interface TransactionConfirmedProps {
  txHash: string
}

const TransactionConfirmed: React.FC<TransactionConfirmedProps> = ({ txHash }) => {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  return (
    <>
      <Flex p="16px" flexDirection="column" alignItems="center" justifyContent="space-between" height="150px">
        <ArrowUpIcon width="64px" height="64px" color="primary" />
        <Text bold>{t('Transaction Confirmed')}</Text>
        <LinkExternal href={getBscScanLink(txHash, 'transaction', chainId)}>{t('View on BscScan')}</LinkExternal>
      </Flex>
      <Divider />
      <Flex px="16px" pb="16px" justifyContent="center">
        <Button startIcon={<ChevronLeftIcon color="primary" />} onClick={() => null} variant="secondary" width="100%">
          {t('Your NFTs')}
        </Button>
      </Flex>
    </>
  )
}

export default TransactionConfirmed
