import { Flex, Text, Button, Link } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { BACKGROUND_COLOR } from 'views/TradingReward/components/YourTradingReward/index'

const ViewEligiblePairs = () => {
  const { t } = useTranslation()
  return (
    <Flex
      width="100%"
      borderRadius={32}
      padding={['60px 0']}
      flexDirection="column"
      alignItems={['center']}
      style={{ background: BACKGROUND_COLOR }}
    >
      <Text bold fontSize={['20px']} mb="24px">
        {t('Start trading eligible pairs to earn trading rewards!')}
      </Text>
      <Link href="#rewards-breakdown">
        <Button>{t('View Eligible Pairs')}</Button>
      </Link>
    </Flex>
  )
}

export default ViewEligiblePairs
