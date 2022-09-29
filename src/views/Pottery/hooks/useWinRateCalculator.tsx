import { useState, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import { CalculatorMode, EditingCurrency } from '../types'

const TOKEN_PRECISION = 10
const USD_PRECISION = 2

export interface WinRateCalculatorState {
  controls: {
    multiply: number
    mode: CalculatorMode
    editingCurrency: EditingCurrency
  }
  data: {
    principalAsToken: string
    principalAsUSD: string
  }
}

const defaultState = {
  controls: {
    multiply: 1,
    mode: CalculatorMode.WIN_RATE_BASED_ON_PRINCIPAL,
    editingCurrency: EditingCurrency.USD,
  },
  data: {
    principalAsToken: '0.00',
    principalAsUSD: '',
  },
}

interface WinRateCalculatorProps {
  cakePrice: BigNumber
  totalSupply: BigNumber
}

const useWinRateCalculator = ({ cakePrice, totalSupply }: WinRateCalculatorProps) => {
  const [state, setState] = useState<WinRateCalculatorState>(defaultState)

  const totalLockValue = useMemo(() => {
    const total = totalSupply.times(state.controls.multiply).dividedBy(DEFAULT_TOKEN_DECIMAL)
    return total.toNumber()
  }, [totalSupply, state])

  const totalLockValueAsUSD = useMemo(() => {
    return new BigNumber(totalLockValue).times(cakePrice).toNumber()
  }, [totalLockValue, cakePrice])

  const winRate = useMemo(() => {
    const { principalAsToken } = state.data
    const percentage = new BigNumber(principalAsToken).div(totalLockValue).times(100).toNumber()
    return percentage >= 100 ? 100 : percentage
  }, [state, totalLockValue])

  const setPrincipalFromTokenValue = (amount: string) => {
    const principalAsUsdBN = new BigNumber(amount).times(cakePrice)
    const principalAsUsdString = principalAsUsdBN.gt(0) ? principalAsUsdBN.toFixed(USD_PRECISION) : '0.00'
    const data = {
      ...state.data,
      principalAsUSD: principalAsUsdString,
      principalAsToken: amount,
    }
    setState({ ...state, data })
  }

  const setPrincipalFromUSDValue = (amount: string) => {
    const principalAsTokenBN = new BigNumber(amount).div(cakePrice)
    const principalAsToken = principalAsTokenBN.gt(0) ? principalAsTokenBN.toFixed(TOKEN_PRECISION) : '0.00'
    const data = {
      ...state.data,
      principalAsUSD: amount,
      principalAsToken,
    }
    setState({ ...state, data })
  }

  const toggleEditingCurrency = () => {
    const currencyAfterChange =
      state.controls.editingCurrency === EditingCurrency.USD ? EditingCurrency.TOKEN : EditingCurrency.USD
    const controls = { ...state.controls, editingCurrency: currencyAfterChange }
    setState({ ...state, controls })
  }

  const setMultiplyNumber = (multiplyNumber: number) => {
    const controls = { ...state.controls, multiply: multiplyNumber }
    setState({ ...state, controls })
  }

  const setCalculatorMode = (mode: CalculatorMode) => {
    const controls = { ...state.controls, mode }
    setState({ ...state, controls })
  }

  const setTargetWinRate = (percentage: string) => {
    const cakeAmount = new BigNumber(percentage).dividedBy(100).times(totalLockValue)
    const principalAsToken = cakeAmount.gt(0) ? cakeAmount.toFixed(TOKEN_PRECISION) : '0.00'
    const principalAsUsdBN = new BigNumber(cakeAmount).times(cakePrice)
    const principalAsUsdString = principalAsUsdBN.gt(0) ? principalAsUsdBN.toFixed(USD_PRECISION) : '0.00'

    const data = {
      ...state.data,
      principalAsToken,
      principalAsUSD: principalAsUsdString,
    }
    setState({ ...state, data })
  }

  return {
    state,
    winRate,
    totalLockValue,
    totalLockValueAsUSD,
    setMultiplyNumber,
    setPrincipalFromTokenValue,
    setPrincipalFromUSDValue,
    toggleEditingCurrency,
    setCalculatorMode,
    setTargetWinRate,
  }
}

export default useWinRateCalculator
