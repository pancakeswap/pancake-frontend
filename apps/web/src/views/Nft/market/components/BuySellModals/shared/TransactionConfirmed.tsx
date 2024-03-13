import { useTranslation } from '@pancakeswap/localization'
import { ArrowUpIcon, Button, Flex, ScanLink, Text } from '@pancakeswap/uikit'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { getBlockExploreLink } from 'utils'
import { Divider } from './styles'

interface TransactionConfirmedProps {
  txHash: string
  onDismiss?: () => void
}

const TransactionConfirmed: React.FC<React.PropsWithChildren<TransactionConfirmedProps>> = ({ txHash, onDismiss }) => {
  const { chainId } = useActiveChainId()
  const { t } = useTranslation()
  return (
    <>
      <Flex p="16px" flexDirection="column" alignItems="center" justifyContent="space-between" height="150px">
        <ArrowUpIcon width="64px" height="64px" color="primary" />
        <Text bold>{t('Transaction Confirmed')}</Text>
        <ScanLink href={getBlockExploreLink(txHash, 'transaction', chainId)}>{t('View on BscScan')}</ScanLink>
      </Flex>
      <Divider />
      <Flex px="16px" pb="16px" justifyContent="center">
        <Button onClick={onDismiss} variant="secondary" width="100%">
          {t('Close')}
        </Button>
      </Flex>
    </>
  )
}

export default TransactionConfirmed
