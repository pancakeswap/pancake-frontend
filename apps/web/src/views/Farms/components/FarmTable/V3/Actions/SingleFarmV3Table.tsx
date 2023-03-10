import { useTranslation } from '@pancakeswap/localization'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { Text, Box, Farm as FarmUI } from '@pancakeswap/uikit'
import FarmV3StakeAndUnStake from 'views/Farms/components/FarmCard/V3/FarmV3StakeAndUnStake'
import BoostedAction from 'views/Farms/components//YieldBooster/components/BoostedAction'
import { ActionContainer as ActionContainerSection, ActionContent, ActionTitles } from './styles'

const { FarmV3HarvestAction } = FarmUI.FarmV3Table

interface SingleFarmV3TableProps {
  farm: any
}

const SingleFarmV3Table: React.FunctionComponent<React.PropsWithChildren<SingleFarmV3TableProps>> = ({ farm }) => {
  const { t } = useTranslation()

  return (
    <Box width="100%">
      <ActionContainerSection>
        <ActionContent width="100%" flexDirection="column">
          <FarmV3StakeAndUnStake title={`${farm.lpSymbol} (#0123456)`} />
        </ActionContent>
        <ActionContent width="100%" flexDirection="column">
          {/* TODO: v3 farms earning */}
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
      </ActionContainerSection>
    </Box>
  )
}

export default SingleFarmV3Table
