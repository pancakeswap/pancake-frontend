import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/swap-sdk-core'
import { Box, Button, Flex, InjectedModalProps, Modal, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { TokenImage } from 'components/TokenImage'

interface WithdrawRewardModalProps extends InjectedModalProps {
  token: Token
  rewardAmount: number
}

export const WithdrawRewardModal: React.FC<React.PropsWithChildren<WithdrawRewardModalProps>> = ({
  token,
  rewardAmount,
  onDismiss,
}) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  return (
    <Modal title={isMobile ? t('Withdraw') : t('Withdraw the reward')} onDismiss={onDismiss}>
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width={['100%', '100%', '100%', '430px']}
      >
        <TokenImage token={token} width={64} height={64} />
        <Box m="8px 0 10px 0">
          <Text as="span" bold fontSize="24px" lineHeight="28px">
            {rewardAmount}
          </Text>
          <Text as="span" bold ml="4px" fontSize="20px" lineHeight="24px">
            {token.symbol}
          </Text>
        </Box>
        <Text textAlign="center" color="textSubtle">
          {t('Are you sure you want to withdraw the reward back to your wallet?')}
        </Text>
        <Button width="100%" mt="24px">
          {t('Continue')}
        </Button>
      </Flex>
    </Modal>
  )
}
