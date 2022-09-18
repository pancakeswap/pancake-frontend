import { Coin, AptosSwapRouter } from '@pancakeswap/aptos-swap-sdk'
import { useSendTransaction } from '@pancakeswap/awgmi'
import { useTranslation } from '@pancakeswap/localization'
import { AtomBox } from '@pancakeswap/ui'
import { Card, Swap as SwapUI, AutoColumn, RowBetween } from '@pancakeswap/uikit'
import { CurrencyInputPanel } from 'components/CurrencyInputPanel'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useState } from 'react'
import tryParseAmount from '@pancakeswap/utils/tryParseAmount'
import { useTradeExactIn } from 'hooks/Trades'
import { TestTokens } from 'components/TestTokens'
import { JSBI, Percent } from '@pancakeswap/swap-sdk-core'
import { BIPS_BASE } from 'config/constants/exchange'
import { CommitButton } from '../components/CommitButton'

const {
  Page,
  CurrencyInputHeader,
  CurrencyInputHeaderTitle,
  CurrencyInputHeaderSubTitle,
  SwitchButton,
  Info,
  InfoLabel,
} = SwapUI

const SwapPage = () => {
  const native = useNativeCurrency()
  const [input, setInput] = useState<Coin | undefined>(native)
  const [output, setOutput] = useState<Coin>()
  const [value, setValue] = useState('')
  const [value1, setValue1] = useState('')
  const { t } = useTranslation()

  const inputAmount = tryParseAmount(value, input)
  const outputAmount = tryParseAmount(value1, output)
  const tradeIn = useTradeExactIn(inputAmount, output)

  const { sendTransactionAsync } = useSendTransaction({
    // TODO: trade in or trade out
    payload: tradeIn
      ? AptosSwapRouter.swapCallParameters(tradeIn, { allowedSlippage: new Percent(JSBI.BigInt(50), BIPS_BASE) })
      : undefined,
  })

  return (
    <Page helpUrl="https://docs.pancakeswap.finance/products/pancakeswap-exchange" isEvm={false}>
      <Card style={{ width: '328px' }}>
        <CurrencyInputHeader
          title={
            <RowBetween>
              <div />
              <CurrencyInputHeaderTitle>{t('Swap')}</CurrencyInputHeaderTitle>
              <div />
            </RowBetween>
          }
          subtitle={<CurrencyInputHeaderSubTitle>{t('Trade tokens in an instant')}</CurrencyInputHeaderSubTitle>}
        />
        <AutoColumn gap="sm" p="16px">
          <CurrencyInputPanel
            onCurrencySelect={(c) => setInput(c.wrapped)}
            id="swap-currency-input"
            currency={input}
            value={value}
            onUserInput={setValue}
            showMaxButton={false}
          />
          <AtomBox width="full" textAlign="center">
            <SwitchButton
              onClick={() => {
                setInput(output)
                setOutput(input)
              }}
            />
          </AtomBox>
          <CurrencyInputPanel
            showMaxButton={false}
            onCurrencySelect={(c) => setOutput(c.wrapped)}
            id="swap-currency-output"
            value={value1}
            currency={output}
            onUserInput={setValue1}
          />
          <Info price={<InfoLabel>Price</InfoLabel>} allowedSlippage={0} />
          <AtomBox>
            <CommitButton
              width="100%"
              onClick={() => {
                sendTransactionAsync?.().then((r) => r.wait())
              }}
            >
              {t('Swap')}
            </CommitButton>
          </AtomBox>
        </AutoColumn>
      </Card>
      <TestTokens />
    </Page>
  )
}

export default SwapPage
