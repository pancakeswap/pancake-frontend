import { Heading } from '@pancakeswap/uikit'
import { ReactNode } from 'react'
import { ModalHeader, ModalTitle } from 'views/Notifications/styles'

interface INotifyHeaderprops {
  leftIcon: ReactNode
  rightIcon: ReactNode
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
