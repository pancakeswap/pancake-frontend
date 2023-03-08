import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { Flex, Text, Box, Farm as FarmUI } from '@pancakeswap/uikit'
import BoostedAction from 'views/Farms/components//YieldBooster/components/BoostedAction'
import { ActionContent, ActionTitles } from 'views/Farms/components/FarmTable/V3/Actions/styles'

const { FarmV3HarvestAction, FarmV3StakeAndUnStake } = FarmUI.FarmV3Table

const ActionContainer = styled(Flex)`
  width: 100%;
  padding: 0 16px;
  border: 2px solid ${({ theme }) => theme.colors.input};
  border-radius: 16px;
  flex-grow: 1;
  flex-basis: 0;
  margin-bottom: 8px;
  background-color: ${({ theme }) => theme.colors.dropdown};
  flex-direction: column;

  > ${ActionTitles}, > ${ActionContent} {
    padding: 16px 0;

    &:first-child {
      padding-left: 0;
    }

    &:last-child {
      padding-right: 0;
    }
  }

  ${ActionContent} {
    border-bottom: 2px solid ${({ theme }) => theme.colors.input};

    &:last-child {
      border: 0;
    }
  }
`

interface SingleFarmV3CardProps {
  farm: any
}

const SingleFarmV3Card: React.FunctionComponent<React.PropsWithChildren<SingleFarmV3CardProps>> = ({ farm }) => {
  const { t } = useTranslation()

  return (
    <Box width="100%">
      <ActionContainer>
        <ActionContent width="100%" flexDirection="column">
          <FarmV3StakeAndUnStake title={`${farm.lpSymbol} (#0123456)`} />
        </ActionContent>
        <ActionContent width="100%" flexDirection="column">
          <FarmV3HarvestAction
            earnings={BIG_ZERO}
            earningsBusd={323}
            displayBalance="123"
            pendingTx={false}
            userDataReady={false}
            proxyCakeBalance={0}
            handleHarvest={() => 123}
          />
        </ActionContent>
        {farm?.boosted && (
          <ActionContent width="100%" flexDirection="column">
            <BoostedAction
              title={(status) => (
                <ActionTitles>
                  <Text mr="3px" bold textTransform="uppercase" color="textSubtle" fontSize="12px">
                    {t('Yield Booster')}
                  </Text>
                  <Text bold textTransform="uppercase" color="secondary" fontSize="12px">
                    {status}
                  </Text>
                </ActionTitles>
              )}
              desc={(actionBtn) => <ActionContent>{actionBtn}</ActionContent>}
              farmPid={farm.pid}
              lpTokenStakedAmount={farm.lpTokenStakedAmount}
              userBalanceInFarm={BIG_ZERO}
              // userBalanceInFarm={
              //   (stakedBalance.plus(tokenBalance).gt(0)
              //     ? stakedBalance.plus(tokenBalance)
              //     : proxy?.stakedBalance.plus(proxy?.tokenBalance)) ?? BIG_ZERO
              // }
            />
          </ActionContent>
        )}
      </ActionContainer>
    </Box>
  )
}

export default SingleFarmV3Card
