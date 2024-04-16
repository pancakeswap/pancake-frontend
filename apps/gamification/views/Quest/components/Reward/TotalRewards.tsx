import { useTranslation } from '@pancakeswap/localization'
import { Card, Flex, InfoIcon, Text } from '@pancakeswap/uikit'
import { AssetSet } from 'views/Quest/components/Reward/AssetSet'

export const TotalRewards = () => {
  const { t } = useTranslation()
  return (
    <Card style={{ width: '100%' }} marginBottom={['8px']}>
      <Flex padding="16px">
        <AssetSet size={28} />
        <Flex m="auto">
          <Text bold mr="4px">
            999 rewards
          </Text>
          <InfoIcon color="textSubtle" style={{ alignSelf: 'center' }} />
        </Flex>
      </Flex>
    </Card>
  )
}
