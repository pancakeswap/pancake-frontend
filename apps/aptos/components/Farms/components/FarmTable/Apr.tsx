import { Skeleton } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import { styled } from 'styled-components'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import ApyButton from '../FarmCard/ApyButton'

export interface AprProps {
  value: string
  multiplier: string
  pid: number
  lpLabel: string
  lpSymbol: string
  lpAddress: string
  lpRewardsApr: number
  lpTokenPrice: BigNumber
  tokenAddress?: string
  quoteTokenAddress?: string
  cakePrice: BigNumber
  originalValue: number
  hideButton?: boolean
  useTooltipText?: boolean
  farmCakePerSecond?: string
  totalMultipliers?: string
  dualTokenRewardApr?: number
}

const Container = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};

  button {
    width: 20px;
    height: 20px;

    svg {
      path {
        fill: ${({ theme }) => theme.colors.textSubtle};
      }
    }
  }
`

const AprWrapper = styled.div`
  min-width: 60px;
  text-align: left;
`

const Apr: React.FC<React.PropsWithChildren<AprProps>> = ({
  value,
  pid,
  lpLabel,
  lpSymbol,
  lpAddress,
  lpTokenPrice,
  multiplier,
  tokenAddress = '',
  quoteTokenAddress = '',
  cakePrice,
  originalValue,
  hideButton = false,
  lpRewardsApr,
  useTooltipText = true,
  farmCakePerSecond,
  totalMultipliers,
  dualTokenRewardApr,
}) => {
  const liquidityUrlPathParts = getLiquidityUrlPathParts({ quoteTokenAddress, tokenAddress })
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`
  return originalValue !== 0 ? (
    <Container>
      {originalValue ? (
        <ApyButton
          variant={hideButton ? 'text' : 'text-and-button'}
          pid={pid}
          lpSymbol={lpSymbol}
          lpAddress={lpAddress}
          lpLabel={lpLabel}
          lpTokenPrice={lpTokenPrice}
          multiplier={multiplier}
          cakePrice={cakePrice}
          apr={originalValue}
          displayApr={value}
          lpRewardsApr={lpRewardsApr}
          addLiquidityUrl={addLiquidityUrl}
          useTooltipText={useTooltipText}
          hideButton={hideButton}
          farmCakePerSecond={farmCakePerSecond}
          totalMultipliers={totalMultipliers}
          dualTokenRewardApr={dualTokenRewardApr}
        />
      ) : (
        <AprWrapper>
          <Skeleton width={60} />
        </AprWrapper>
      )}
    </Container>
  ) : (
    <Container>
      <AprWrapper>{originalValue}%</AprWrapper>
    </Container>
  )
}

export default Apr
