import React from 'react'
import styled from 'styled-components'
import { Modal, Heading } from '@pancakeswap-libs/uikit'

interface DepositModalProps {
  onDismiss?: () => void
}

const ApyButton: React.FC<DepositModalProps> = ({ onDismiss }) => {
  return (
    <Modal title="bleh" onDismiss={onDismiss}>
      <Heading>This does nothing</Heading>
    </Modal>
  )
}

export default ApyButton
