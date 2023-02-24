import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { Flex, Text, Box, Link, ChevronRightIcon, Balance, Button, Farm as FarmUI } from '@pancakeswap/uikit'
import BoostedAction from 'views/Farms/components//YieldBooster/components/BoostedAction'
import { ActionContainer as ActionContainerSection, ActionContent, ActionTitles } from '../styles'

const { FarmV3HarvestAction } = FarmUI.FarmV3Table

const StyledLink = styled(Link)`
  &:hover {
    text-decoration: initial;
  }
`

interface FarmV3TableActionProps {
  title: string
}

const FarmV3TableAction: React.FunctionComponent<React.PropsWithChildren<FarmV3TableActionProps>> = ({ title }) => {
  const { t } = useTranslation()

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
        {[1, 2].map((i) => (
          <Box width="100%">
            <ActionContainerSection>
              <ActionContent width="100%" flexDirection="column">
                <StyledLink href="/">
                  <Text bold color="secondary">
                    CAKE-BNB LP (#0123456)
                  </Text>
                  <ChevronRightIcon color="secondary" fontSize="12px" />
                </StyledLink>
                <Flex justifyContent="space-between">
                  <Box>
                    <Text bold fontSize={['12px', '12px', '12px', '14px']}>
                      Min 0.123 / Max 0.234 BNB per CAKE
                    </Text>
                    <Box>
                      <Balance fontSize="12px" color="textSubtle" decimals={2} value={852} unit=" USD" prefix="~" />
                      <Flex style={{ gap: '4px' }}>
                        <Balance fontSize="12px" color="textSubtle" decimals={2} value={30} unit={` CAKE`} />
                        <Balance fontSize="12px" color="textSubtle" decimals={2} value={1.23} unit={` BNB`} />
                      </Flex>
                    </Box>
                  </Box>
                  <Button width={['120px']} style={{ alignSelf: 'center' }}>
                    {t('Stake')}
                  </Button>
                  {/* <Button variant="secondary" width={['120px']} style={{ alignSelf: 'center' }}>{t('Unstake')}</Button> */}
                </Flex>
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
                  farmPid={0}
                  lpTokenStakedAmount={BIG_ZERO}
                  userBalanceInFarm={BIG_ZERO}
                />
              </ActionContent>
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
