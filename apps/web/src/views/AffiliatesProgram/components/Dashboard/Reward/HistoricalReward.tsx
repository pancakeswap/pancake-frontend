import { useTranslation } from '@pancakeswap/localization'
import { Flex } from '@pancakeswap/uikit'
import SingleHistoricalReward from 'views/AffiliatesProgram/components/Dashboard/Reward/SingleHistoricalReward'

interface HistoricalRewardProps {
  isAffiliate: boolean
}

const HistoricalReward: React.FC<React.PropsWithChildren<HistoricalRewardProps>> = ({ isAffiliate }) => {
  const { t } = useTranslation()

  return (
    <Flex flexDirection="column" width="100%">
      {isAffiliate && (
        <SingleHistoricalReward title={t('Affiliate Reward')} tableFirstTitle={t('Affiliate Reward')} mb="24px" />
      )}
      <SingleHistoricalReward title={t('User Reward')} tableFirstTitle={t('User Reward')} />
    </Flex>
  )
}

export default HistoricalReward
