import { useMemo } from 'react'
import { Card, Flex, Text, Box } from '@pancakeswap/uikit'
import { LightGreyCard } from 'components/Card'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import BigNumber from 'bignumber.js'
import { usePriceCakeUSD } from 'state/farms/hooks'
import { formatNumber } from '@pancakeswap/utils/formatBalance'

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
  const cakePriceBusd = usePriceCakeUSD()

  const affiliateTotalCakeEarned = useMemo(
    () => new BigNumber(affiliateRewardFeeUSD).div(cakePriceBusd).toNumber(),
    [cakePriceBusd, affiliateRewardFeeUSD],
  )
  const userTotalCakeEarned = useMemo(
    () => new BigNumber(userRewardFeeUSD).div(cakePriceBusd).toNumber(),
    [cakePriceBusd, userRewardFeeUSD],
  )

  return (
    <Box>
      <Flex>
        <Card style={{ width: '100%' }}>
          <Flex flexDirection="column" padding={['24px']}>
            <Flex justifyContent="space-between" mb="16px">
              <Text
                style={{ alignSelf: 'center' }}
                color="secondary"
                bold
                fontSize={['12px']}
                textTransform="uppercase"
              >
                {t('claim your rewards')}
              </Text>
              {/* <Button display={['none', 'none', 'none', 'block']} scale="sm">
                Claim Reward
              </Button> */}
            </Flex>
            <CardContainer>
              {isAffiliate && (
                <LightGreyCard>
                  <Flex justifyContent="space-between" mb="7px">
                    <Text textTransform="uppercase" color="textSubtle" fontSize="14px">
                      {t('Affiliate Reward')}
                    </Text>
                    <Text bold fontSize="14px">
                      {`$ ${formatNumber(Number(affiliateRewardFeeUSD))}`}
                    </Text>
                  </Flex>
                  <Flex justifyContent="space-between">
                    <Text textTransform="uppercase" color="textSubtle" fontSize="14px">
                      {t('Affiliate CAKE Earned')}
                    </Text>
                    <Text bold fontSize="14px">
                      {`~ ${formatNumber(affiliateTotalCakeEarned)} CAKE`}
                    </Text>
                  </Flex>
                </LightGreyCard>
              )}
              <LightGreyCard>
                <Flex justifyContent="space-between" mb="7px">
                  <Text textTransform="uppercase" color="textSubtle" fontSize="14px">
                    {t('User Reward')}
                  </Text>
                  <Text bold fontSize="14px">
                    {`$ ${formatNumber(Number(userRewardFeeUSD))}`}
                  </Text>
                </Flex>
                <Flex justifyContent="space-between">
                  <Text textTransform="uppercase" color="textSubtle" fontSize="14px">
                    {t('User CAKE Earned')}
                  </Text>
                  <Text bold fontSize="14px">
                    {`~ ${formatNumber(userTotalCakeEarned)} CAKE`}
                  </Text>
                </Flex>
              </LightGreyCard>
            </CardContainer>
            {/* <Button display={['block', 'block', 'block', 'none']} variant="secondary" mt="18px" width="100%">
              Claim Reward
            </Button> */}
          </Flex>
        </Card>
      </Flex>
    </Box>
  )
}

export default ClaimReward
