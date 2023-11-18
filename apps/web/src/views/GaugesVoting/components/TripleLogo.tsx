import { Token } from '@pancakeswap/sdk'
import { Box } from '@pancakeswap/uikit'
import { CurrencyLogo } from 'components/Logo'
import { ChainLogo } from 'components/Logo/ChainLogo'
import { GaugeALMConfig, GaugeConfig, GaugeType, GaugeV2Config, GaugeV3Config } from 'config/constants/types'
import { useMemo } from 'react'
import styled from 'styled-components'
import { Address } from 'viem'

const StyledDualLogo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: center;
`

const SingleLogo = () => {
  return <img src="/images/cake-staking/token-vecake.png" alt="ve-cake" width="32px" height="32px" />
}
const DoubleLogo: React.FC<{ gaugeConfig: GaugeV2Config | GaugeV3Config | GaugeALMConfig }> = ({ gaugeConfig }) => {
  const currency0 = useMemo<Token | undefined>(() => {
    if (gaugeConfig.token0Address)
      return new Token(Number(gaugeConfig.chainId), gaugeConfig.token0Address as Address, 18, '', '')
    return undefined
  }, [gaugeConfig.chainId, gaugeConfig.token0Address])
  const currency1 = useMemo((): Token | undefined => {
    if (gaugeConfig.token1Address)
      return new Token(Number(gaugeConfig.chainId), gaugeConfig.token1Address as Address, 18, '', '')
    return undefined
  }, [gaugeConfig.chainId, gaugeConfig.token1Address])

  return (
    <>
      {currency0 ? (
        <Box mr="-5.62px">
          <CurrencyLogo currency={currency0} size="36px" />
        </Box>
      ) : null}
      {currency1 ? <CurrencyLogo currency={currency1} size="36px" /> : null}
    </>
  )
}

const TokensLogo: React.FC<{ gaugeConfig?: GaugeConfig }> = ({ gaugeConfig }) => {
  if (!gaugeConfig) return null

  if (gaugeConfig?.type === GaugeType.VeCakePool) {
    return <SingleLogo />
  }

  return <DoubleLogo gaugeConfig={gaugeConfig} />
}

export const TripleLogo: React.FC<{
  gaugeConfig?: GaugeConfig
  chainId?: number
}> = ({ gaugeConfig, chainId }) => {
  return (
    <StyledDualLogo>
      <TokensLogo gaugeConfig={gaugeConfig} />
      {chainId ? (
        <Box ml="-9px">
          <ChainLogo chainId={chainId} />
        </Box>
      ) : null}
    </StyledDualLogo>
  )
}
