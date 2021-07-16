import React from 'react'
import { Text } from '@pancakeswap/uikit'
import Acknowledgement from './Acknowledgement'
import { DefaultWarningProps } from './types'

const BondlyWarning: React.FC<DefaultWarningProps> = ({ onDismiss }) => {
  return (
    <>
      <Text mb="24px">A cluster of stuff about Bondly</Text>
      <Text mb="24px">Text TBC</Text>
      <Acknowledgement handleContinueClick={onDismiss} />
    </>
  )
}

export default BondlyWarning
