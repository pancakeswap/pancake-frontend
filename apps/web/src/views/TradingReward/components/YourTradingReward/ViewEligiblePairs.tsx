import { Text, Button } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

const ViewEligiblePairs = () => {
  const { t } = useTranslation()
  return (
    <>
      <Text bold fontSize={['20px']} mb="24px" textAlign="center">
        {t('Start trading eligible pairs to earn trading rewards!')}
      </Text>
      <Button>{t('View Eligible Pairs')}</Button>
    </>
  )
}

export default ViewEligiblePairs
