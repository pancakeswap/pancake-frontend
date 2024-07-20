import { useTranslation } from '@pancakeswap/localization'
import { EmptyRewardIcon, Flex, Text } from '@pancakeswap/uikit'
import { styled } from 'styled-components'

const EmptyRewardContainer = styled(Flex)`
  flex-direction: column;
  align-items: center;
  padding-bottom: 16px;
`

export const EmptyReward = () => {
  const { t } = useTranslation()
  return (
    <EmptyRewardContainer>
      <EmptyRewardIcon color="#E2E7E8" width={64} height={64} />
      <Text bold color="textDisabled" mt="16px">
        {t('Schedule to add a reward')}
      </Text>
    </EmptyRewardContainer>
  )
}
