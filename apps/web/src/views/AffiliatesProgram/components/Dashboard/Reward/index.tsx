import { useState } from 'react'
import { Card, Flex, Box, Message, MessageText } from '@pancakeswap/uikit'
import { LightGreyCard } from 'components/Card'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import TabMenu, { MenuType } from 'views/AffiliatesProgram/components/Dashboard/Reward/TabMenu'
import LatestReward from 'views/AffiliatesProgram/components/Dashboard/Reward/LatestReward'
import HistoricalReward from 'views/AffiliatesProgram/components/Dashboard/Reward/HistoricalReward'

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

  const handleTypeChange = (newMenuType: MenuType) => {
    setMenuType(newMenuType)
  }

  return (
    <Box padding="16px">
      <Flex flexDirection="column">
        <Message variant="warning" mb="24px">
          <MessageText>{t('You have %number% incompleted request in Historical Claim.', { number: 2 })}</MessageText>
        </Message>
        <Card style={{ width: '100%' }}>
          <Flex flexDirection="column" padding={['24px']}>
            <TabMenu menuType={menuType} onTypeChange={handleTypeChange} />
            <CardContainer>
              {menuType === MenuType.Latest ? (
                <LatestReward
                  isAffiliate={isAffiliate}
                  userRewardFeeUSD={userRewardFeeUSD}
                  affiliateRewardFeeUSD={affiliateRewardFeeUSD}
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
