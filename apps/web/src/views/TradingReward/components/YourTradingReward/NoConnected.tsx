import { Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import ConnectWalletButton from 'components/ConnectWalletButton'

const NoConnected = () => {
  const { t } = useTranslation()
  return (
    <>
      <Text color="black" bold fontSize={['20px']} mb="24px" textAlign="center">
        {t('Connect wallet to view your trading volume and rewards')}
      </Text>
      <ConnectWalletButton />
    </>
  )
}

export default NoConnected
