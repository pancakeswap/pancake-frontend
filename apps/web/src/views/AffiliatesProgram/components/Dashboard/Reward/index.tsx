import { useTranslation } from '@pancakeswap/localization'
import { Box, Card, Flex, Message, MessageText } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { LightGreyCard } from 'components/Card'
import { useMemo, useState } from 'react'
import { styled } from 'styled-components'
import HistoricalReward from 'views/AffiliatesProgram/components/Dashboard/Reward/HistoricalReward'
import LatestReward from 'views/AffiliatesProgram/components/Dashboard/Reward/LatestReward'
import TabMenu, { MenuType } from 'views/AffiliatesProgram/components/Dashboard/Reward/TabMenu'
import useAffiliateClaimList from 'views/AffiliatesProgram/hooks/useAffiliateClaimList'
import useUserClaimList from 'views/AffiliatesProgram/hooks/useUserClaimList'

const CardContainer = styled(Flex)`
  flex-direction: column;

  ${LightGreyCard} {
    margin: 0 0 16px 0;
    &:last-child {
      margin: 0;
    }
  }

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;

    ${LightGreyCard} {
      margin: 0 16px 0 0;
      &:last-child {
        margin: 0;
      }
    }
  }
`

interface ClaimRewardProps {
  isAffiliate: boolean
  userRewardFeeUSD: string
  affiliateRewardFeeUSD: string
  refreshAuthAffiliate: () => void
}

const ClaimReward: React.FC<React.PropsWithChildren<ClaimRewardProps>> = ({
  isAffiliate,
  userRewardFeeUSD,
  affiliateRewardFeeUSD,
  refreshAuthAffiliate,
}) => {
  const { t } = useTranslation()
  const [menuType, setMenuType] = useState(MenuType.Latest)
  const { data: affiliateClaimData, mutate: refreshAffiliateClaimData } = useAffiliateClaimList({ currentPage: 1 })
  const { data: userClaimData, mutate: refreshUserClaimData } = useUserClaimList({ currentPage: 1 })

  const handleTypeChange = (newMenuType: MenuType) => {
    setMenuType(newMenuType)
  }

  const inCompletedNumber = useMemo(() => {
    const userHasInCompletedData = userClaimData?.claimRequests?.filter(
      (i) => i.approveStatus === 'APPROVED' && !i.process,
    )
    const affiliateInCompletedData = affiliateClaimData?.claimRequests?.filter(
      (i) => i.approveStatus === 'APPROVED' && !i.process,
    )
    const affiliateInCompleteNumber = isAffiliate ? affiliateInCompletedData?.length ?? 0 : 0

    return new BigNumber(affiliateInCompleteNumber).plus(userHasInCompletedData?.length ?? 0).toNumber() ?? 0
  }, [userClaimData?.claimRequests, affiliateClaimData?.claimRequests, isAffiliate])

  return (
    <Box padding="16px">
      <Flex flexDirection="column">
        {inCompletedNumber > 0 && (
          <Message variant="warning" mb="24px">
            <MessageText>
              {t('You have %number% incompleted request in Historical Claim.', { number: inCompletedNumber })}
            </MessageText>
          </Message>
        )}
        <Card style={{ width: '100%' }}>
          <Flex flexDirection="column" padding={['24px']}>
            <TabMenu menuType={menuType} inCompletedNumber={inCompletedNumber} onTypeChange={handleTypeChange} />
            <CardContainer>
              {menuType === MenuType.Latest ? (
                <LatestReward
                  isAffiliate={isAffiliate}
                  userRewardFeeUSD={userRewardFeeUSD}
                  affiliateRewardFeeUSD={affiliateRewardFeeUSD}
                  userClaimData={userClaimData}
                  affiliateClaimData={affiliateClaimData}
                  refreshAffiliateClaimData={refreshAffiliateClaimData}
                  refreshUserClaimData={refreshUserClaimData}
                  refreshAuthAffiliate={refreshAuthAffiliate}
                />
              ) : (
                <HistoricalReward isAffiliate={isAffiliate} />
              )}
            </CardContainer>
          </Flex>
        </Card>
      </Flex>
    </Box>
  )
}

export default ClaimReward
