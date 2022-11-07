import { useTranslation } from '@pancakeswap/localization'
import { Flex, Skeleton, Text } from '@pancakeswap/uikit'
import { ConnectWalletButton } from 'components/ConnectWalletButton'
import styled from 'styled-components'
import { HarvestActionContainer } from '../FarmTable/Actions/HarvestAction'
import { StakedContainer } from '../FarmTable/Actions/StakedAction'
import HarvestAction from './HarvestAction'
import StakeAction from './StakeAction'
import { FarmWithStakedValue } from '../types'

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
  const { pid, lpAddress } = farm
  const { earnings } = farm.userData || {}
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
      <HarvestActionContainer earnings={earnings} pid={pid} lpAddress={lpAddress}>
        {(props) => <HarvestAction {...props} />}
      </HarvestActionContainer>
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
      ) : (
        <StakedContainer {...farm} lpLabel={lpLabel} addLiquidityUrl={addLiquidityUrl} displayApr={displayApr}>
          {(props) => <StakeAction {...props} />}
        </StakedContainer>
      )}
    </Action>
  )
}

export default CardActions
