import { useState, useMemo } from 'react'
import { Card, Flex, Box, Message, MessageText } from '@pancakeswap/uikit'
import { LightGreyCard } from 'components/Card'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { useTranslation } from '@pancakeswap/localization'
import TabMenu, { MenuType } from 'views/AffiliatesProgram/components/Dashboard/Reward/TabMenu'
import LatestReward from 'views/AffiliatesProgram/components/Dashboard/Reward/LatestReward'
import HistoricalReward from 'views/AffiliatesProgram/components/Dashboard/Reward/HistoricalReward'
import useUserClaimList from 'views/AffiliatesProgram/hooks/useUserClaimList'
import useAffiliateClaimList from 'views/AffiliatesProgram/hooks/useAffiliateClaimList'

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
}

const ClaimReward: React.FC<React.PropsWithChildren<ClaimRewardProps>> = ({
  isAffiliate,
  userRewardFeeUSD,
  affiliateRewardFeeUSD,
}) => {
  const { t } = useTranslation()
  const [menuType, setMenuType] = useState(MenuType.Latest)
  const { data: affiliateClaimData } = useAffiliateClaimList({ currentPage: 1 })
  const { data: userClaimData } = useUserClaimList({ currentPage: 1 })

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
    return new BigNumber(affiliateInCompletedData?.length).plus(userHasInCompletedData?.length).toNumber() ?? 0
  }, [userClaimData, affiliateClaimData])

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
