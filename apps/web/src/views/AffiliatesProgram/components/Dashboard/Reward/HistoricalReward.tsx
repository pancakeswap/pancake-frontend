import { useTranslation } from '@pancakeswap/localization'
import { Flex } from '@pancakeswap/uikit'
import SingleHistoricalReward from 'views/AffiliatesProgram/components/Dashboard/Reward/SingleHistoricalReward'

const HistoricalReward = () => {
  const { t } = useTranslation()

  return (
    <Flex flexDirection="column" width="100%">
      <SingleHistoricalReward title={t('Affiliate Reward')} tableFirstTitle={t('Affiliate Reward')} />
      <SingleHistoricalReward title={t('User Reward')} tableFirstTitle={t('User Reward')} mt="24px" />
    </Flex>
  )
}

export default HistoricalReward
