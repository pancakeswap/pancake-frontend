import { Currency } from '@pancakeswap/sdk'
import { Pair, isStableSwapPair } from '@pancakeswap/smart-router/evm'
import { Box, Flex } from '@pancakeswap/uikit'
import { CurrencyLogo, DoubleCurrencyLogo } from 'components/Logo'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'

const RouterBox = styled(Flex)`
  position: relative;
  min-width: 400px;
  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 3px;
    border-top: 3px dotted ${({ theme }) => theme.colors.inputSecondary};
    transform: translateY(-50%);
    z-index: 1;
  }
`
const RouterPoolBox = styled(Box)`
  position: relative;
  padding: 3px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.backgroundDisabled};
  &.isStableSwap {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
  transform: scale(1.48);
  z-index: 2;
`
const RouterTypeText = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  position: absolute;
  left: 50%;
  transform: translate(-50%) scale(0.6);
  top: calc(100%);
`

const CurrencyLogoWrapper = styled.div`
  position: relative;
  height: 48px;
  width: 48px;
  padding: 2px;
  background: linear-gradient(180deg, #53dee9 0%, #7645d9 76.22%);
  border-radius: 50%;
  z-index: 2;
`

interface RouterViewerProps {
  inputCurrency?: Currency
  outputCurrency?: Currency
  pairs?: Pair[]
}

export const RouterViewer: React.FC<RouterViewerProps> = ({ pairs, inputCurrency, outputCurrency }) => {
  const { t } = useTranslation()
  return (
    <RouterBox justifyContent="space-between" alignItems="center">
      <CurrencyLogoWrapper>
        <CurrencyLogo size="44px" currency={inputCurrency} />
      </CurrencyLogoWrapper>
      {pairs &&
        pairs.map((p) => {
          const isStableSwap = isStableSwapPair(p)
          return (
            <RouterPoolBox
              key={`tradingPairIds${isStableSwap ? p.stableSwapAddress : p.liquidityToken.address}`}
              className={isStableSwap && 'isStableSwap'}
            >
              <DoubleCurrencyLogo currency0={p.token0} currency1={p.token1} />
              <RouterTypeText>{isStableSwap ? t('StableSwap') : t('V2')}</RouterTypeText>
            </RouterPoolBox>
          )
        })}

      <CurrencyLogoWrapper>
        <CurrencyLogo size="44px" currency={outputCurrency} />
      </CurrencyLogoWrapper>
    </RouterBox>
  )
}
