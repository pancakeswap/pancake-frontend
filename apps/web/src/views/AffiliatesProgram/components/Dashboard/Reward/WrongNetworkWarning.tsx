import { useTranslation } from '@pancakeswap/localization'
import { Text, Message, MessageText } from '@pancakeswap/uikit'
import { ChainId } from '@pancakeswap/sdk'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'

const WrongNetworkWarning = () => {
  const { t } = useTranslation()
  const { switchNetworkAsync, canSwitch } = useSwitchNetwork()

  const handleSwitchNetwork = async (): Promise<void> => {
    await switchNetworkAsync(ChainId.BSC)
  }

  return (
    <Message variant="warning" mb="20px">
      <MessageText>
        <Text as="span" color="warning">
          {t('Claiming of Affiliate Rewards is only available on Binance Smart Chain.')}
        </Text>
        {canSwitch ? (
          <Text onClick={handleSwitchNetwork} style={{ cursor: 'pointer' }} as="span" bold m="0 4px" color="warning">
            {t('Switch network')}
          </Text>
        ) : (
          <Text as="span" bold m="0 4px" color="warning">
            {t('Unable to switch network. Please try it on your wallet')}
          </Text>
        )}
        <Text as="span" color="warning">
          {t('to claim rewards')}
        </Text>
      </MessageText>
    </Message>
  )
}

export default WrongNetworkWarning
