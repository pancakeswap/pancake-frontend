import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/sdk'
import { isStableSwapPair, Pair } from '@pancakeswap/smart-router/evm'
import { Box, Flex, Text, useTooltip } from '@pancakeswap/uikit'
import { CurrencyLogo } from 'components/Logo'
import styled from 'styled-components'

const RouterBox = styled(Flex)`
  position: relative;
  flex-direction: column;
  min-height: 450px;
  &:before {
    content: '';
    position: absolute;
    top: 0%;
    left: 50%;
    width: 3px;
    height: 100%;
    border-left: 3px dotted ${({ theme }) => theme.colors.backgroundDisabled};
    transform: translateX(-50%);
    z-index: 1;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    min-width: 400px;
    min-height: auto;
    flex-direction: row;
    &:before {
      top: 50%;
      left: 0;
      width: 100%;
      height: 3px;
      border-left: none;
      border-top: 3px dotted ${({ theme }) => theme.colors.backgroundDisabled};
      transform: translateY(-50%);
      z-index: 1;
    }
  }
`
const RouterPoolBox = styled(Box)`
  position: relative;
  border-radius: 50px;
  display: flex;
  flex-direction: column;
  padding: 4px 8px;
  background-color: ${({ theme }) => theme.colors.backgroundDisabled};
  z-index: 2;
  svg,
  img {
    &:first-child {
      margin-bottom: 2px;
      ${({ theme }) => theme.mediaQueries.md} {
        margin-bottom: 0px;
        margin-right: 2px;
      }
    }
  }
  &.isStableSwap {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`
const RouterTypeText = styled.div`
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.text};
  position: absolute;
  top: 50%;
  left: calc(100% + 10px);
  transform: translateY(-50%);
  ${({ theme }) => theme.mediaQueries.md} {
    left: 50%;
    transform: translateX(-50%);
    top: calc(100% + 3px);
  }
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
  path?: Currency[]
}

export const RouterViewer: React.FC<RouterViewerProps> = ({ pairs, path, inputCurrency, outputCurrency }) => {
  const { t } = useTranslation()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(<Text>{inputCurrency.symbol}</Text>, {
    placement: 'right',
  })
  const {
    targetRef: outputTargetRef,
    tooltip: outputTooltip,
    tooltipVisible: outputTooltipVisible,
  } = useTooltip(<Text>{outputCurrency.symbol}</Text>, {
    placement: 'right',
  })
  return (
    <RouterBox justifyContent="space-between" alignItems="center">
      <CurrencyLogoWrapper ref={targetRef}>
        <CurrencyLogo size="44px" currency={inputCurrency} />
      </CurrencyLogoWrapper>
      {tooltipVisible && tooltip}
      {pairs &&
        path &&
        pairs.map((p, index) => {
          const isStableSwap = isStableSwapPair(p)
          return (
            <RouterPoolBox
              key={`tradingPairIds${isStableSwap ? p.stableSwapAddress : p.liquidityToken.address}`}
              className={isStableSwap && 'isStableSwap'}
            >
              <CurrencyLogo size="32px" currency={index === 0 ? inputCurrency : path[index]} />
              <CurrencyLogo size="32px" currency={index === pairs.length - 1 ? outputCurrency : path[index + 1]} />
              <RouterTypeText>{isStableSwap ? t('StableSwap') : t('V2')}</RouterTypeText>
            </RouterPoolBox>
          )
        })}
      <CurrencyLogoWrapper ref={outputTargetRef}>
        <CurrencyLogo size="44px" currency={outputCurrency} />
      </CurrencyLogoWrapper>
      {outputTooltipVisible && outputTooltip}
    </RouterBox>
  )
}
