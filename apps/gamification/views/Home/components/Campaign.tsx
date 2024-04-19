import { useTranslation } from '@pancakeswap/localization'
import { CalenderIcon, Card, Flex, Text } from '@pancakeswap/uikit'

export const Campaign = () => {
  const { t } = useTranslation()

  return (
    <Card style={{ width: 'calc(33.33% - 11px)' }}>
      <Flex flexDirection="column" padding="16px">
        <Flex m="16px 0">
          <CalenderIcon color="textSubtle" mr="8px" />
          <Text color="textSubtle" fontSize={['14px']}>
            Apr 10 - Apr 21
          </Text>
        </Flex>
        <Text bold fontSize={['20px']}>
          Swap and Share $10,000 on Ethereum PancakeSwap
        </Text>
      </Flex>
    </Card>
  )
}
