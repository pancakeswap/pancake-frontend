import React from 'react'
import BigNumber from 'bignumber.js'
import { IconButton, useModal, CalculateIcon } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import AprCalculatorModal from './AprCalculatorModal'

export interface AprButtonProps {
  lpLabel?: string
  cakePrice?: BigNumber
  apy?: number
  addLiquidityUrl?: string
}

const StyledIconButton = styled(IconButton)`
  svg {
    path {
      fill: ${({ theme }) => theme.colors.textSubtle};
    }
  }
`

const AprButton: React.FC<AprButtonProps> = ({ lpLabel, cakePrice, apy, addLiquidityUrl }) => {
  const [onPresentApyModal] = useModal(
    <AprCalculatorModal lpLabel={lpLabel} cakePrice={cakePrice} apy={apy} addLiquidityUrl={addLiquidityUrl} />,
  )

  const handleClickButton = (event): void => {
    event.stopPropagation()
    onPresentApyModal()
  }

  return (
    <StyledIconButton onClick={handleClickButton} variant="text" scale="sm" ml="4px">
      <CalculateIcon width="18px" />
    </StyledIconButton>
  )
}

export default AprButton
