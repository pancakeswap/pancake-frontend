import { ModalHeader, ModalTitle } from 'views/Notifications/styles'
import { Heading } from '@pancakeswap/uikit'
import React from 'react'

interface INotifyHeaderprops {
  leftIcon: React.JSX.Element
  rightIcon: React.JSX.Element
  text: string
}

export const NotificationHeader = ({ leftIcon, rightIcon, text }: INotifyHeaderprops) => {
  return (
    <ModalHeader>
      {leftIcon}
      <ModalTitle>
        <Heading fontSize="20px" padding="0px" textAlign="center">
          {text}
        </Heading>
      </ModalTitle>
      {rightIcon}
    </ModalHeader>
  )
}
