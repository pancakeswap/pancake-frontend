import { useTranslation } from '@pancakeswap/localization'
import { Flex } from '@pancakeswap/uikit'
import { useState } from 'react'
import useAffiliateClaimList from 'views/AffiliatesProgram/hooks/useAffiliateClaimList'
import useUserClaimList from 'views/AffiliatesProgram/hooks/useUserClaimList'
import SingleHistoricalReward from 'views/AffiliatesProgram/components/Dashboard/Reward/SingleHistoricalReward'

interface HistoricalRewardProps {
  isAffiliate: boolean
}

const HistoricalReward: React.FC<React.PropsWithChildren<HistoricalRewardProps>> = ({ isAffiliate }) => {
  const { t } = useTranslation()
  const [affiliateDataCurrentPage, setAffiliateDataCurrentPage] = useState(1)
  const [userDataCurrentPage, setUserDataCurrentPage] = useState(1)
  const { data: affiliateClaimData } = useAffiliateClaimList({ currentPage: affiliateDataCurrentPage })
  const { data: userClaimData } = useUserClaimList({ currentPage: userDataCurrentPage })

  return (
    <Flex flexDirection="column" width="100%">
      {isAffiliate && (
        <SingleHistoricalReward
          mb="24px"
          title={t('Affiliate Reward')}
          tableFirstTitle={t('Affiliate Reward')}
          dataList={affiliateClaimData}
          currentPage={affiliateDataCurrentPage}
          setCurrentPage={setAffiliateDataCurrentPage}
        />
      )}
      <SingleHistoricalReward
        title={t('User Reward')}
        tableFirstTitle={t('User Reward')}
        dataList={userClaimData}
        currentPage={userDataCurrentPage}
        setCurrentPage={setUserDataCurrentPage}
      />
    </Flex>
  )
}

export default HistoricalReward
