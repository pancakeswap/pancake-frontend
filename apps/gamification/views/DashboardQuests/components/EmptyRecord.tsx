import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Image, Text } from '@pancakeswap/uikit'
import { ASSET_CDN } from 'config/constants/endpoints'

export const EmptyRecord = () => {
  const { t } = useTranslation()
  return (
    <Flex padding="20px 0 30px 0" flexDirection="column" width="100%">
      <Box margin="auto" width={116} height={91}>
        <Image
          width={116}
          height={91}
          alt="empty-quest-icon"
          src={`${ASSET_CDN}/gamification/images/empty-quest-icon.png`}
        />
      </Box>
      <Text m="8px 0" textAlign="center" bold fontSize={['16px', '16px', '20px']}>
        {t('There is nothing here')}
      </Text>
    </Flex>
  )
}
