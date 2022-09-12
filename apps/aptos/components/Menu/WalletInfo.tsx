import { useAccount, useBalance } from '@pancakeswap/aptos'
import { useTranslation } from '@pancakeswap/localization'
import {
  Box,
  Button,
  CopyAddress,
  Flex,
  InjectedModalProps,
  LinkExternal,
  Message,
  Skeleton,
  Text,
} from '@pancakeswap/uikit'
import { useAuth } from 'hooks/useAuth'

import { APT } from 'config/coins'
import { useActiveNetwork } from 'hooks/useNetwork'
import { getBlockExploreLink } from 'utils'

interface WalletInfoProps {
  hasLowNativeBalance: boolean
  onDismiss: InjectedModalProps['onDismiss']
}

const WalletInfo: React.FC<WalletInfoProps> = ({ hasLowNativeBalance, onDismiss }) => {
  const { t } = useTranslation()
  const { account } = useAccount()
  const network = useActiveNetwork()
  const { data, isFetched } = useBalance({ address: account?.address })

  const { logout } = useAuth()

  const handleLogout = () => {
    onDismiss?.()
    logout()
  }

  return (
    <>
      <Text color="secondary" fontSize="12px" textTransform="uppercase" fontWeight="bold" mb="8px">
        {t('Your Address')}
      </Text>
      {account && <CopyAddress tooltipMessage={t('Copied')} account={account.address} mb="24px" />}
      {hasLowNativeBalance && (
        <Message variant="warning" mb="24px">
          <Box>
            <Text fontWeight="bold">
              {t('%currency% Balance Low', {
                currency: APT.symbol,
              })}
            </Text>
            <Text as="p">
              {t('You need %currency% for transaction fees.', {
                currency: APT.symbol,
              })}
            </Text>
          </Box>
        </Message>
      )}
      <Flex alignItems="center" justifyContent="space-between">
        <Flex>
          <Text color="textSubtle">
            {APT.symbol} {t('Balance')}
          </Text>
        </Flex>
        {!isFetched ? <Skeleton height="22px" width="60px" /> : <Text>{data?.formatted}</Text>}
      </Flex>
      {account && (
        <Flex alignItems="center" justifyContent="end" mb="24px">
          <LinkExternal href={getBlockExploreLink(account.address, 'address', network)}>
            {t('View on %site%', {
              site: t('Explorer'),
            })}
          </LinkExternal>
        </Flex>
      )}
      <Button variant="secondary" width="100%" onClick={handleLogout}>
        {t('Disconnect Wallet')}
      </Button>
    </>
  )
}

export default WalletInfo
