import { Text, Button, Link } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

const ViewEligiblePairs = () => {
  const { t } = useTranslation()
  return (
    <>
      <Text bold fontSize={['20px']} mb="24px" textAlign="center">
        {t('Start trading eligible pairs to earn trading rewards!')}
      </Text>
      <Link href="#rewards-breakdown">
        <Button>{t('View Eligible Pairs')}</Button>
      </Link>
    </>
  )
}

export default ViewEligiblePairs
