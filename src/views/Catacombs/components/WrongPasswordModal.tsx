/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react'
import { Modal, Text } from '@catacombs-libs/uikit'

interface WrongPasswordModalProps {
  onDismiss?: () => void,
}

const WrongPasswordModal: React.FC<WrongPasswordModalProps> = ({ onDismiss }) => {

  return <Modal onDismiss={onDismiss} title="Wrong Password!" background="black!important" color="white!important" border="1px solid white!important">
    <Text mt="8px" bold color="white" fontSize="14px" mb="8px">
      Hint : No zombies allowed....
    </Text>
  </Modal>
}

export default WrongPasswordModal

