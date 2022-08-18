import { useContext } from 'react'
import { Flex, Text } from '@pancakeswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'
import { fetchFarmUserDataAsync } from 'state/farms'
import { useAppDispatch } from 'state'
import { FarmWithStakedValue } from '../types'
import HarvestAction from './HarvestAction'
import StakeAction from './StakeAction'
import BoostedAction from '../YieldBooster/components/BoostedAction'
import { YieldBoosterStateContext } from '../YieldBooster/components/ProxyFarmContainer'
import { HarvestActionContainer, ProxyHarvestActionContainer } from '../FarmTable/Actions/HarvestAction'
import { ProxyStakedContainer, StakedContainer } from '../FarmTable/Actions/StakedAction'

const Action = styled.div`
  padding-top: 16px;
`

const ActionContainer = styled.div`
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

interface FarmCardActionsProps {
  farm: FarmWithStakedValue
  account?: string
  addLiquidityUrl?: string
  lpLabel?: string
  displayApr?: string
}

const CardActions: React.FC<React.PropsWithChildren<FarmCardActionsProps>> = ({
  farm,
  account,
  addLiquidityUrl,
  lpLabel,
  displayApr,
}) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { pid, lpAddresses } = farm
  const { earnings } = farm.userData || {}
  const { shouldUseProxyFarm, proxyAddress } = useContext(YieldBoosterStateContext)

  return (
    <Action>
      <Flex>
        <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
          CAKE
        </Text>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {t('Earned')}
        </Text>
      </Flex>
      {shouldUseProxyFarm ? (
        <ProxyHarvestActionContainer
          earnings={earnings}
          pid={pid}
          lpAddresses={lpAddresses}
          onDone={() => dispatch(fetchFarmUserDataAsync({ account, pids: [pid], proxyAddress }))}
        >
          {(props) => <HarvestAction {...props} />}
        </ProxyHarvestActionContainer>
      ) : (
        <HarvestActionContainer
          earnings={earnings}
          pid={pid}
          onDone={() => dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))}
        >
          {(props) => <HarvestAction {...props} />}
        </HarvestActionContainer>
      )}
      {farm.boosted && (
        <BoostedAction
          title={(status) => (
            <Flex>
              <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px" pr="4px">
                {t('Yield Booster')}
              </Text>
              <Text bold textTransform="uppercase" color="secondary" fontSize="12px">
                {status}
              </Text>
            </Flex>
          )}
          desc={(actionBtn) => <ActionContainer>{actionBtn}</ActionContainer>}
          farmPid={farm.pid}
        />
      )}
      <Flex>
        <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
          {farm.lpSymbol}
        </Text>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {t('Staked')}
        </Text>
      </Flex>
      {!account ? (
        <ConnectWalletButton mt="8px" width="100%" />
      ) : shouldUseProxyFarm ? (
        <ProxyStakedContainer {...farm} lpLabel={lpLabel} addLiquidityUrl={addLiquidityUrl} displayApr={displayApr}>
          {(props) => <StakeAction {...props} />}
        </ProxyStakedContainer>
      ) : (
        <StakedContainer {...farm} lpLabel={lpLabel} addLiquidityUrl={addLiquidityUrl} displayApr={displayApr}>
          {(props) => <StakeAction {...props} />}
        </StakedContainer>
      )}
    </Action>
  )
}

export default CardActions
