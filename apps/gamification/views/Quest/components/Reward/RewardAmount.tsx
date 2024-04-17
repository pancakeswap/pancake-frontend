import { useTranslation } from '@pancakeswap/localization'
import { Box, Card, Flex, LogoRoundIcon, Text, useMatchBreakpoints } from '@pancakeswap/uikit'

export const RewardAmount = () => {
  const { t } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()

  return (
    <Card style={{ width: '100%' }} marginBottom={['16px']}>
      <Flex padding="24px 29.5px" width={isDesktop ? '100%' : 'fit-content'} margin="auto">
        <LogoRoundIcon width={64} height={64} />
        <Box ml={['16px', '16px', '16px', '16px', 'auto']}>
          <Text fontSize={['40px']} bold as="span">
            999
          </Text>
          <Text textTransform="uppercase" fontSize={['24px']} bold as="span" ml="4px">
            {t('token')}
          </Text>
        </Box>
      </Flex>
    </Card>
  )
}
