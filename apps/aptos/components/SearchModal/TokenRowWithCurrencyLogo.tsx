import { Currency } from '@pancakeswap/aptos-swap-sdk'
import { withCurrencyLogo } from '@pancakeswap/widgets-internal'

import { CurrencyLogo } from '../Logo'

export default withCurrencyLogo<Currency>(CurrencyLogo)
