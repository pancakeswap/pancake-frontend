import { useTranslation } from '@pancakeswap/localization'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { FarmWithStakedValue } from '@pancakeswap/farms'
import { Flex, Text, Box, Farm as FarmUI } from '@pancakeswap/uikit'
import BoostedAction from 'views/Farms/components//YieldBooster/components/BoostedAction'
import { ActionContainer as ActionContainerSection, ActionContent, ActionTitles } from '../styles'

const { FarmV3HarvestAction, FarmV3StakeAndUnStake } = FarmUI.FarmV3Table

interface FarmV3TableActionProps {
  title: string
  farm: FarmWithStakedValue
}

const FarmV3TableAction: React.FunctionComponent<React.PropsWithChildren<FarmV3TableActionProps>> = ({
  title,
  farm,
}) => {
  const { t } = useTranslation()
  const { stakedBalance, tokenBalance, proxy } = farm.userData

  return (
    <Flex flexDirection="column" width="100%" mb="24px">
      <Text
        bold
        fontSize="12px"
        color="textSubtle"
        m={['0 0 8px 0', '0 0 8px 0', '0 0 8px 0', '0 0 8px 0', '0 0 8px 0', '0 0 8px 12px']}
      >
        {title}
      </Text>
      <Flex
        flexWrap="wrap"
        width="100%"
        maxHeight={['500px', '500px', '500px', '100%']}
        overflowY={['auto', 'auto', 'auto', 'initial']}
      >
        {[1, 2].map(() => (
          <Box width="100%">
            <ActionContainerSection>
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
                    userBalanceInFarm={
                      (stakedBalance.plus(tokenBalance).gt(0)
                        ? stakedBalance.plus(tokenBalance)
                        : proxy?.stakedBalance.plus(proxy?.tokenBalance)) ?? BIG_ZERO
                    }
                  />
                </ActionContent>
              )}
            </ActionContainerSection>
          </Box>
        ))}
      </Flex>
    </Flex>
  )
}

export default FarmV3TableAction

// import { YieldBoosterStateContext } from '../../YieldBooster/components/ProxyFarmContainer'
// import { HarvestAction, ProxyHarvestActionContainer } from './HarvestAction'
// import StakedAction, { ProxyStakedContainer, StakedContainer } from './StakedAction'

// {shouldUseProxyFarm ? (
//   <ProxyHarvestActionContainer {...proxyFarm} userDataReady={userDataReady}>
//     {(props) => <HarvestAction {...props} />}
//   </ProxyHarvestActionContainer>
// ) :  (
//   <HarvestActionContainer
//     earnings={earnings}
//     pid={pid}
//     vaultPid={vaultPid}
//     token={token}
//     quoteToken={quoteToken}
//     lpSymbol={lpSymbol}
//   >
//     {(props) => <HarvestAction {...props} />}
//   </HarvestActionContainer>
// )}
// {shouldUseProxyFarm ? (
//   <ProxyStakedContainer {...proxyFarm} userDataReady={userDataReady} lpLabel={lpLabel} displayApr={apr.value}>
//     {(props) => <StakedAction {...props} />}
//   </ProxyStakedContainer>
// ) : (
//   <StakedContainer {...farm} userDataReady={userDataReady} lpLabel={lpLabel} displayApr={apr.value}>
//     {(props) => <StakedAction {...props} />}
//   </StakedContainer>
// )}
