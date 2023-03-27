import { Flex, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { BACKGROUND_COLOR } from 'views/TradingReward/components/YourTradingReward/index'

const NoConnected = () => {
  const { t } = useTranslation()
  return (
    <Flex
      width="100%"
      borderRadius={32}
      padding={['60px 0']}
      flexDirection="column"
      alignItems={['center']}
      style={{ background: BACKGROUND_COLOR }}
    >
      <Text bold fontSize={['20px']} mb="24px">
        {t('Connect wallet to view your trading volume and rewards')}
      </Text>
      <ConnectWalletButton />
    </Flex>
  )
}

export default NoConnected
