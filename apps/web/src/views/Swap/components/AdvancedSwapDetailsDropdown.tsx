import styled from 'styled-components'
import { useMemo } from 'react'

import useLastTruthy from 'hooks/useLast'

import { AdvancedSwapDetails, AdvancedSwapDetailsProps } from './AdvancedSwapDetails'

const AdvancedDetailsFooter = styled.div<{ show: boolean }>`
  margin-top: ${({ show }) => (show ? '16px' : 0)};
  padding-top: 16px;
  padding-bottom: 16px;
  width: 100%;
  max-width: 400px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.invertedContrast};

  transform: ${({ show }) => (show ? 'translateY(0%)' : 'translateY(-100%)')};
  transition: transform 300ms ease-in-out;
`

export default function AdvancedSwapDetailsDropdown({
  pairs,
  path,
  priceImpactWithoutFee,
  realizedLPFee,
  slippageAdjustedAmounts,
  inputAmount,
  outputAmount,
  tradeType,
  ...rest
}: AdvancedSwapDetailsProps) {
  const trade = useMemo(
    () => ({
      pairs,
      path,
      priceImpactWithoutFee,
      realizedLPFee,
      slippageAdjustedAmounts,
      inputAmount,
      outputAmount,
      tradeType,
    }),
    [pairs, path, priceImpactWithoutFee, realizedLPFee, slippageAdjustedAmounts, inputAmount, outputAmount, tradeType],
  )
  const lastTrade = useLastTruthy(trade)

  return (
    <AdvancedDetailsFooter show={Boolean(inputAmount && outputAmount)}>
      <AdvancedSwapDetails
        {...rest}
        pairs={pairs ?? lastTrade.pairs ?? undefined}
        path={path ?? lastTrade.path ?? undefined}
        priceImpactWithoutFee={priceImpactWithoutFee ?? lastTrade.priceImpactWithoutFee ?? undefined}
        realizedLPFee={realizedLPFee ?? lastTrade.realizedLPFee ?? undefined}
        slippageAdjustedAmounts={slippageAdjustedAmounts ?? lastTrade.slippageAdjustedAmounts ?? undefined}
        inputAmount={inputAmount ?? lastTrade.inputAmount ?? undefined}
        outputAmount={outputAmount ?? lastTrade.outputAmount ?? undefined}
        tradeType={tradeType ?? lastTrade.tradeType ?? undefined}
      />
    </AdvancedDetailsFooter>
  )
}
