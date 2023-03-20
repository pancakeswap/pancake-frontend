import { Currency, Token, ChainId } from '@pancakeswap/aptos-swap-sdk'
import { APTOS_COIN } from '@pancakeswap/awgmi'
import memoize from 'lodash/memoize'
import { useHttpLocations } from '@pancakeswap/hooks'
import { WrappedTokenInfo } from '@pancakeswap/token-lists'
import { useMemo } from 'react'
import styled from 'styled-components'
import { TokenLogo } from '@pancakeswap/uikit'
import { aptosLogoClass } from './CurrencyLogo.css'

const getTokenLogoURL = memoize(
  (token?: Token) => {
    if (token && token.chainId === ChainId.MAINNET) {
      return `https://tokens.pancakeswap.finance/images/aptos/${token.address}.png` // hex encoding
    }
    return null
  },
  (t) => (t ? `${t.chainId}#${t.address}` : null),
)

const StyledLogo = styled(TokenLogo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 50%;
`

const APT_SRCS = ['https://tokens.pancakeswap.finance/images/symbol/apt.png']

export function AptosCoinLogo({ size = '24px', style }: { size?: string; style?: React.CSSProperties }) {
  return (
    <StyledLogo
      className={aptosLogoClass({
        isProduction: true,
      })}
      srcs={APT_SRCS}
      alt="APT logo"
      style={style}
      size={size}
    />
  )
}

export function CurrencyLogo({
  currency,
  size = '24px',
  style,
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const srcs: string[] = useMemo(() => {
    if (currency?.isToken) {
      const tokenLogoURL = getTokenLogoURL(currency)

      if (currency instanceof WrappedTokenInfo) {
        if (!tokenLogoURL) return [...uriLocations]
        return [...uriLocations, tokenLogoURL]
      }
      if (!tokenLogoURL) return []
      return [tokenLogoURL]
    }
    return []
  }, [currency, uriLocations])

  // isNative of AptosCoin wrapped is false, using address comparison is safer
  if (currency?.isNative || currency?.address === APTOS_COIN) {
    return <AptosCoinLogo size={size} style={style} />
  }

  return <StyledLogo useFilledIcon size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}
