import { AtomBox } from '@pancakeswap/ui'
import { Card, Swap as SwapUI, AutoColumn, RowBetween } from '@pancakeswap/uikit'
import { useState } from 'react'
import { CommitButton } from '../components/CommitButton'

const {
  Page,
  CurrencyInputHeader,
  CurrencyInputHeaderTitle,
  CurrencyInputHeaderSubTitle,
  CurrencyInputPanel,
  SwitchButton,
  Info,
  InfoLabel,
} = SwapUI

const SwapPage = () => {
  const [value, setValue] = useState('')
  const [value1, setValue1] = useState('')

  return (
    <Page helpUrl="https://docs.pancakeswap.finance/products/pancakeswap-exchange" isEvm={false}>
      <Card style={{ width: '328px' }}>
        <CurrencyInputHeader
          title={
            <RowBetween>
              <div />
              <CurrencyInputHeaderTitle>Swap</CurrencyInputHeaderTitle>
              <div />
            </RowBetween>
          }
          subtitle={<CurrencyInputHeaderSubTitle>Trade tokens in an instant</CurrencyInputHeaderSubTitle>}
        />
        <AutoColumn gap="sm" p="16px">
          <CurrencyInputPanel id="a" value={value} onUserInput={setValue} />
          <AtomBox width="full" textAlign="center">
            <SwitchButton />
          </AtomBox>
          <CurrencyInputPanel id="b" value={value1} onUserInput={setValue1} />
          <Info price={<InfoLabel>Price</InfoLabel>} allowedSlippage={0} />
          <AtomBox>
            <CommitButton width="100%">Swap</CommitButton>
          </AtomBox>
        </AutoColumn>
      </Card>
    </Page>
  )
}

export default SwapPage
