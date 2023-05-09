import { Box, Text, Button, Link } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import Image from 'next/image'
import { useAccount } from 'wagmi'

const NoProfile = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()

  return (
    <>
      <Text bold mb="8px">
        {t('You have no CAKE profile.')}
      </Text>
      <Text mb="32px">{t('Create a Pancake Profile to start earning from trades')}</Text>
      <Box>
        <Image src="/images/trading-reward/create-profile.png" width={420} height={128} alt="create-profile" />
      </Box>
      <Link mt="32px" external href={`/profile/${account}`}>
        <Button>{t('Create Profile')}</Button>
      </Link>
    </>
  )
}

export default NoProfile
