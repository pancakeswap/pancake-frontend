import React from 'react'
import { Flex, Text, Button, ArrowUpIcon, LinkExternal, ChevronLeftIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { Divider } from './styles'

interface TransactionSubmittedProps {
  tx: string
}

const TransactionSubmitted: React.FC<TransactionSubmittedProps> = ({ tx }) => {
  const { t } = useTranslation()
  console.debug('TX', tx)
  return (
    <>
      <Flex p="16px" flexDirection="column" alignItems="center" justifyContent="space-between" height="150px">
        <ArrowUpIcon width="64px" height="64px" color="primary" />
        <Text bold>{t('Transaction Submitted')}</Text>
        <LinkExternal href="https://google.com">View on BscScan</LinkExternal>
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

export default TransactionSubmitted
