import { useTranslation } from '@pancakeswap/localization'
import { Flex, Link, Text, TwitterIcon, BunnyPlaceholderIcon } from '@pancakeswap/uikit'

const ComingSoon = () => {
  const { t } = useTranslation()

  return (
    <Flex flexDirection="column">
      <BunnyPlaceholderIcon width={80} height={80} />
      <Text mt="16px" bold textAlign="center">
        {t('Coming Soon!')}
      </Text>
      <Text textAlign="center" fontSize="14px" color="textSubtle" mt="8px">
        {t('Currently there is no active trading reward campaign. Check back later or follow our social channels.')}
      </Text>
      <Flex pt="20px" justifyContent="center">
        <Link href="https://twitter.com/pancakeswap" external>
          <TwitterIcon color="primary" mr="5px" />
          <Text bold color="primary" textAlign="center">
            {t('+Follow For New Updates')}
          </Text>
        </Link>
      </Flex>
    </Flex>
  )
}

export default ComingSoon
