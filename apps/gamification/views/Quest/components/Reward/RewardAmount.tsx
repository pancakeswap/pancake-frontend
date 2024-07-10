import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, LogoRoundIcon, Text } from '@pancakeswap/uikit'
import { styled } from 'styled-components'

const RewardAmountContainer = styled(Box)`
  padding-bottom: 24px;
  border-bottom: solid 1px ${({ theme }) => theme.colors.cardBorder};

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-bottom: 40px;
  }
`

export const RewardAmount = () => {
  const { t } = useTranslation()

  return (
    <RewardAmountContainer>
      <Flex width="fit-content" margin="auto">
        <LogoRoundIcon width={64} height={64} />
        <Box ml={['16px']}>
          <Text fontSize={['40px']} bold as="span">
            999
          </Text>
          <Text textTransform="uppercase" fontSize={['24px']} bold as="span" ml="4px">
            {t('token')}
          </Text>
        </Box>
      </Flex>
    </RewardAmountContainer>
  )
}
