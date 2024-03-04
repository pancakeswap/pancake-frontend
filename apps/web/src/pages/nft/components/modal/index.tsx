/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import Image from 'next/image'

import closeIcon from '../../assets/close.svg'
import Button from '../button'
import { Wrapper } from './index.style'

type Props = {
  children: React.ReactNode
  onClose: () => void
  title?: string
  titleElement?: React.ReactNode
  showConfirm?: boolean
  confirmText?: string
  onConfirm?: () => void
  showCancel?: boolean
  cancelText?: string
  onCancel?: () => void
}
export default function Modal({
  children,
  onClose,
  title,
  titleElement,
  showConfirm = true,
  confirmText = 'Confirm',
  onConfirm = () => {},
  showCancel = false,
  cancelText = 'Cancel',
  onCancel = () => {},
}: Props) {
  return (
    <Wrapper>
      <div className="modal__wrapper">
        <div className="modal__overlay" onClick={onClose} />
        <div className="modal__container">
          <div className="modal__header">
            {titleElement || <div className="modal__title">{title}</div>}
            <div className="modal__close" onClick={onClose}>
              <Image src={closeIcon} alt="close" />
            </div>
          </div>
          <div className="modal__body">{children}</div>
          <div className="modal__bottom">
            {showCancel && (
              <Button onClick={() => onCancel()} style={{ flex: 1 }} type="transparent">
                {cancelText}
              </Button>
            )}
            {showConfirm && (
              <Button onClick={() => onConfirm()} style={{ flex: 1 }}>
                {confirmText}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  )
}
