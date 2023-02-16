/* eslint-disable @typescript-eslint/no-unused-vars */
import { Currency } from '@pancakeswap/sdk'

import { FormHeader, FormMain } from './containers'

interface Props {
  handleOutputSelect: (newCurrencyOutput: Currency) => void
}

export function V3SwapForm(props: Props) {
  return (
    <>
      <FormHeader refreshDisabled />
      <FormMain />
    </>
  )
}
