import {
  GaugeALMConfig,
  GaugeConfig,
  GaugeStableSwapConfig,
  GaugeType,
  GaugeV2Config,
  GaugeV3Config,
} from '@pancakeswap/gauges'
import { Token } from '@pancakeswap/swap-sdk-core'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { CurrencyLogo } from '@pancakeswap/widgets-internal'
import { useMemo } from 'react'
import styled from 'styled-components'
import { Address } from 'viem'

const GaugeSingleTokenImage = ({ size = 32 }) => {
  return (
    <img
      src="/images/cake-staking/token-vecake.png"
      alt="ve-cake"
      width={size}
      height={size}
      style={{ maxHeight: `${size}px` }}
    />
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;

  height: 34px;
  width: 42px;

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 48px;
    width: 48px;
  }
`

const FronterLogo = styled.div`
  border: 1.2px solid var(--colors-backgroundAlt);
  background-color: var(--colors-background);
  border-radius: 50%;
  margin-top: auto;
  height: 28.4px;
  width: 28.4px;

  ${({ theme }) => theme.mediaQueries.sm} {
    border-width: 2.4px;
    height: 40.4px;
    width: 40.4px;
  }
`

const GaugeDoubleTokenImage: React.FC<{
  gaugeConfig: GaugeV2Config | GaugeV3Config | GaugeALMConfig | GaugeStableSwapConfig
}> = ({ gaugeConfig }) => {
  const { isMobile } = useMatchBreakpoints()
  const token0Address = useMemo<Address | undefined>(() => {
    if (gaugeConfig.type === GaugeType.StableSwap) {
      return gaugeConfig.tokenAddresses[0]
    }
    return gaugeConfig.token0Address
  }, [gaugeConfig])
  const token1Address = useMemo<Address | undefined>(() => {
    if (gaugeConfig.type === GaugeType.StableSwap) {
      return gaugeConfig.tokenAddresses[1]
    }
    return gaugeConfig.token1Address
  }, [gaugeConfig])
  const currency0 = useMemo<Token | undefined>(() => {
    if (token0Address) return new Token(Number(gaugeConfig.chainId), token0Address as Address, 18, '', '')
    return undefined
  }, [gaugeConfig.chainId, token0Address])
  const currency1 = useMemo((): Token | undefined => {
    if (token1Address) return new Token(Number(gaugeConfig.chainId), token1Address as Address, 18, '', '')
    return undefined
  }, [gaugeConfig.chainId, token1Address])

  return (
    <Wrapper>
      {currency0 && (
        <CurrencyLogo
          currency={currency0}
          size={isMobile ? '20px' : '28px'}
          style={{ marginRight: isMobile ? '-8px' : '-20px' }}
        />
      )}
      {currency1 && (
        <FronterLogo>
          <CurrencyLogo currency={currency1} size={isMobile ? '26px' : '36px'} />
        </FronterLogo>
      )}
    </Wrapper>
  )
}

export const GaugeTokenImage: React.FC<{
  gauge?: GaugeConfig
  size?: number
}> = ({ gauge, size }) => {
  if (!gauge) return null

  if (gauge?.type === GaugeType.VeCakePool) {
    return <GaugeSingleTokenImage size={size} />
  }

  return <GaugeDoubleTokenImage gaugeConfig={gauge} />
}
