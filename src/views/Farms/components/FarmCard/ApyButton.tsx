import React from 'react'
import { AddIcon, IconButton, useModal } from '@pancakeswap-libs/uikit'
import ApyCalculatorModal from './ApyCalculatorModal'

export interface TokenAddressesObject {
  56?: string
  97?: string
}
export interface ApyButtonProps {
  lpLabel?: string
  quoteTokenAdresses?: TokenAddressesObject
  quoteTokenSymbol?: string
  tokenAddresses: TokenAddressesObject
}

const ApyButton: React.FC<ApyButtonProps> = ({ lpLabel, quoteTokenAdresses, quoteTokenSymbol, tokenAddresses }) => {
  const [onPresentApyModal] = useModal(
    <ApyCalculatorModal
      lpLabel={lpLabel}
      quoteTokenAdresses={quoteTokenAdresses}
      quoteTokenSymbol={quoteTokenSymbol}
      tokenAddresses={tokenAddresses}
    />,
  )

  return (
    // TODO: Use 'Calculate' icon when uikit update is deployed
    <IconButton onClick={onPresentApyModal} variant="text" size="sm" ml="4px">
      <AddIcon />
    </IconButton>
  )
}

export default ApyButton
