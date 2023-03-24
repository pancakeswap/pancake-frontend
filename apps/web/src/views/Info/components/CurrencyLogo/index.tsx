import { Token } from '@pancakeswap/sdk'
import { TokenLogo } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import { multiChainId } from 'state/info/constant'
import styled from 'styled-components'
import { isAddress } from 'utils'
import getTokenLogoURL from '../../../../utils/getTokenLogoURL'

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
    size?: string
    chainName?: 'ETH' | 'BSC'
  }>
> = ({ address, size = '24px', chainName = 'BSC', ...rest }) => {
  const src = useMemo(() => {
    return getTokenLogoURL(new Token(multiChainId[chainName], address, 18, ''))
  }, [address, chainName])

  const imagePath = chainName === 'BSC' ? '' : `${chainName}/tokens/`
  const srcFromPCS = `https://${chainName === 'BSC' ? 'tokens.' : ''}pancakeswap.finance/images/${imagePath}${isAddress(
    address,
  )}.png`

  return <StyledLogo size={size} srcs={[srcFromPCS, src]} alt="token logo" useFilledIcon {...rest} />
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
  chainName?: 'ETH' | 'BSC'
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
