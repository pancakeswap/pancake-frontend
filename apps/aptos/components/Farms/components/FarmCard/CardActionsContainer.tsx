import { FarmWithStakedValue } from '@pancakeswap/farms'
import { useTranslation } from '@pancakeswap/localization'
import { Flex, Skeleton, Text } from '@pancakeswap/uikit'
import { LightGreyCard } from 'components/Card'
import { ConnectWalletButton } from 'components/ConnectWalletButton'
import { styled } from 'styled-components'
import { HarvestActionContainer } from '../FarmTable/Actions/HarvestAction'
import { StakedContainer } from '../FarmTable/Actions/StakedAction'
import HarvestAction from './HarvestAction'
import StakeAction from './StakeAction'

const GreyLine = styled.div`
  margin: 24px 0;
  border-top: 2px solid ${({ theme }) => theme.colors.cardBorder};
`

interface FarmCardActionsProps {
  farm: FarmWithStakedValue
  account?: string
  addLiquidityUrl?: string
  lpLabel?: string
  displayApr?: string
  farmCakePerSecond?: string
  totalMultipliers?: string
}

const CardActions: React.FC<React.PropsWithChildren<FarmCardActionsProps>> = ({
  farm,
  account,
  addLiquidityUrl,
  lpLabel,
  displayApr,
  farmCakePerSecond,
  totalMultipliers,
}) => {
  const { t } = useTranslation()
  const { pid, lpAddress, dual } = farm
  const { earnings, earningsDualTokenBalance } = farm.userData || {}
  const isReady = farm.multiplier !== undefined

  return (
    <LightGreyCard mt="24px" padding="16px">
      <HarvestActionContainer
        pid={pid}
        lpAddress={lpAddress}
        earnings={earnings}
        dual={dual}
        earningsDualTokenBalance={earningsDualTokenBalance}
      >
        {(props) => <HarvestAction {...props} />}
      </HarvestActionContainer>
      <GreyLine />
      {isReady ? (
        <Flex>
          <Text bold color="secondary" fontSize="12px" pr="4px">
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
        <StakedContainer
          {...farm}
          lpLabel={lpLabel}
          displayApr={displayApr}
          addLiquidityUrl={addLiquidityUrl}
          farmCakePerSecond={farmCakePerSecond}
          totalMultipliers={totalMultipliers}
        >
          {(props) => <StakeAction {...props} />}
        </StakedContainer>
      )}
    </LightGreyCard>
  )
}

export default CardActions
