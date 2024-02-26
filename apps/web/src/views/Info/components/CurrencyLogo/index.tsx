import { useHttpLocations } from '@pancakeswap/hooks'
import { Currency, Token } from '@pancakeswap/sdk'
import { TokenLogo } from '@pancakeswap/uikit'
import { getCurrencyLogoUrls } from '@pancakeswap/widgets-internal'
import { useMemo } from 'react'
import { MultiChainName } from 'state/info/constant'
import { styled } from 'styled-components'

const StyledLogo = styled(TokenLogo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  background-color: #faf9fa;
  color: ${({ theme }) => theme.colors.text};
`

export const CurrencyLogo: React.FC<
  React.PropsWithChildren<{
    address?: string
    token?: Token
    currency?: Currency & {
      logoURI?: string | undefined
    }
    size?: string
    chainName?: MultiChainName
  }>
> = ({ currency, size = '24px', ...rest }) => {
  const uriLocations = useHttpLocations(currency?.logoURI)

  const srcs: string[] = useMemo(() => {
    if (currency?.isNative) return []

    if (currency?.isToken) {
      const logoUrls = getCurrencyLogoUrls(currency, { useTrustWallet: true })

      if (currency?.logoURI) {
        return [...uriLocations, ...logoUrls]
      }
      return [...logoUrls]
    }
    return []
  }, [currency, uriLocations])

  return <StyledLogo size={size} srcs={srcs} alt="token logo" useFilledIcon {...rest} />
}

const DoubleCurrencyWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 32px;
`

interface DoubleCurrencyLogoProps {
  address0?: string
  address1?: string
  size?: number
  chainName?: MultiChainName
}

export const DoubleCurrencyLogo: React.FC<React.PropsWithChildren<DoubleCurrencyLogoProps>> = ({
  address0,
  address1,
  size = 16,
  chainName = 'BSC',
}) => {
  return (
    <DoubleCurrencyWrapper>
      {address0 && <CurrencyLogo address={address0} size={`${size.toString()}px`} chainName={chainName} />}
      {address1 && <CurrencyLogo address={address1} size={`${size.toString()}px`} chainName={chainName} />}
    </DoubleCurrencyWrapper>
  )
}
