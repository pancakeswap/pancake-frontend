import React from 'react'
import styled from 'styled-components'
import { Input, Box } from '@pancakeswap-libs/uikit'
import Balance from 'components/Balance'
import BigNumber from 'bignumber.js'
import { usePriceCakeBusd } from 'state/hooks'

interface BalanceInputProps {
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const StyledInput = styled(Input)`
  padding: 12px 16px;
  padding-bottom: 28px;
  height: 57px;
  text-align: right;
`

const StyledBalance = styled(Balance)`
  position: absolute;
  right: 16px;
  bottom: 8px;
`

const BalanceInput: React.FC<BalanceInputProps> = ({ value, onChange }) => {
  const cakePrice = usePriceCakeBusd()
  const priceBusd = new BigNumber(value).multipliedBy(cakePrice).toNumber()

  return (
    <Box position="relative">
      <StyledInput value={value} onChange={onChange} placeholder="0.0" />
      <StyledBalance value={priceBusd} fontSize="12px" prefix="~" color="textSubtle" />
    </Box>
  )
}

export default BalanceInput
