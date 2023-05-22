import styled from 'styled-components'
import ApyButton from 'views/Farms/components/FarmCard/ApyButton'
import BigNumber from 'bignumber.js'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { Skeleton } from '@pancakeswap/uikit'
import { useActiveChainId } from 'hooks/useActiveChainId'

export interface AprProps {
  value: string
  multiplier: string
  pid: number
  lpLabel: string
  lpSymbol: string
  lpRewardsApr: number
  lpTokenPrice: BigNumber
  tokenAddress?: string
  quoteTokenAddress?: string
  cakePrice: BigNumber
  originalValue: number
  hideButton?: boolean
  strikethrough?: boolean
  useTooltipText?: boolean
  boosted?: boolean
  stableSwapAddress?: string
  stableLpFee?: number
  farmCakePerSecond?: string
  totalMultipliers?: string
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
  lpTokenPrice,
  multiplier,
  tokenAddress,
  quoteTokenAddress,
  cakePrice,
  originalValue,
  hideButton = false,
  strikethrough,
  lpRewardsApr,
  useTooltipText = true,
  boosted,
  stableSwapAddress,
  stableLpFee,
  farmCakePerSecond,
  totalMultipliers,
}) => {
  const { chainId } = useActiveChainId()
  const liquidityUrlPathParts = getLiquidityUrlPathParts({ quoteTokenAddress, tokenAddress, chainId })
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`
  return originalValue !== 0 ? (
    <Container>
      {originalValue ? (
        <ApyButton
          variant={hideButton ? 'text' : 'text-and-button'}
          pid={pid}
          lpSymbol={lpSymbol}
          lpLabel={lpLabel}
          lpTokenPrice={lpTokenPrice}
          multiplier={multiplier}
          cakePrice={cakePrice}
          apr={originalValue}
          displayApr={value}
          lpRewardsApr={lpRewardsApr}
          addLiquidityUrl={addLiquidityUrl}
          strikethrough={strikethrough}
          useTooltipText={useTooltipText}
          hideButton={hideButton}
          boosted={boosted}
          stableSwapAddress={stableSwapAddress}
          stableLpFee={stableLpFee}
          farmCakePerSecond={farmCakePerSecond}
          totalMultipliers={totalMultipliers}
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
