import { FarmWithStakedValue } from '@pancakeswap/farms'
import { useTranslation } from '@pancakeswap/localization'
import { Flex, Skeleton, Text } from '@pancakeswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useContext } from 'react'
import styled from 'styled-components'
import { HarvestActionContainer, ProxyHarvestActionContainer } from '../FarmTable/Actions/HarvestAction'
import { ProxyStakedContainer, StakedContainer } from '../FarmTable/Actions/StakedAction'
import { YieldBoosterStateContext } from '../YieldBooster/components/ProxyFarmContainer'
import HarvestAction from './HarvestAction'
import StakeAction from './StakeAction'

const Action = styled.div`
  padding-top: 16px;
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
  const { pid, token, quoteToken, vaultPid, lpSymbol, lpAddress } = farm
  const { earnings } = farm.userData || {}
  const { shouldUseProxyFarm } = useContext(YieldBoosterStateContext)
  const isReady = farm.multiplier !== undefined

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
          lpAddress={lpAddress}
          earnings={earnings}
          pid={pid}
          vaultPid={vaultPid}
          token={token}
          quoteToken={quoteToken}
          lpSymbol={lpSymbol}
        >
          {(props) => <HarvestAction {...props} />}
        </ProxyHarvestActionContainer>
      ) : (
        <HarvestActionContainer
          earnings={earnings}
          pid={pid}
          vaultPid={vaultPid}
          token={token}
          quoteToken={quoteToken}
          lpSymbol={lpSymbol}
        >
          {(props) => <HarvestAction {...props} />}
        </HarvestActionContainer>
      )}
      {isReady ? (
        <Flex>
          <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
            {farm.lpSymbol}
          </Text>
          <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
            {t('Staked')}
          </Text>
        </Flex>
      ) : (
        <Skeleton width={80} height={18} mb="4px" />
      )}
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
