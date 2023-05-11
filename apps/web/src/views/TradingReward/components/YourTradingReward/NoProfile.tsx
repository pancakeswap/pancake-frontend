import { Box, Text, Button, Link, Message, MessageText } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import Image from 'next/image'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { ChainId } from '@pancakeswap/sdk'

const NoProfile = () => {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const { chainId } = useActiveChainId()

  return (
    <>
      <Text bold mb="8px">
        {t('You have no active Pancake Profile.')}
      </Text>
      <Text mb="32px">{t('Create a Pancake Profile to start earning from trades')}</Text>
      <Box>
        <Image src="/images/trading-reward/create-profile.png" width={420} height={128} alt="create-profile" />
      </Box>
      {chainId !== ChainId.BSC && (
        <Box maxWidth={365} mt="24px">
          <Message variant="primary">
            <MessageText>
              {t('To create Pancake Profile, you will need to switch your network to BNB Chain.')}
            </MessageText>
          </Message>
        </Box>
      )}
      <Link mt="32px" external href={`/profile/${account}`}>
        <Button>{t('Activate Profile')}</Button>
      </Link>
    </>
  )
}

export default NoProfile
