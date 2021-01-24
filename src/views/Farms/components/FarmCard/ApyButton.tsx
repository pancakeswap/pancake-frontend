import React from 'react'
import styled from 'styled-components'
import { AddIcon, IconButton, useModal } from '@pancakeswap-libs/uikit'
import ApyCalculatorModal from './ApyCalculatorModal'

const ApyButton: React.FC = () => {
  const [onPresentApyModal] = useModal(<ApyCalculatorModal />)

  return (
    <IconButton onClick={onPresentApyModal} variant="text" size="sm" ml="4px">
      <AddIcon />
    </IconButton>
  )
}

export default ApyButton
