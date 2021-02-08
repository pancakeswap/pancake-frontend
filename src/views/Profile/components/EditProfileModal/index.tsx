import React from 'react'
import { InjectedModalProps, Modal } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import useEditProfile, { Pages } from './reducer'
import StartPage from './StartPage'
import RemovePage from './RemovePage'
import ChangeProfilePicPage from './ChangeProfilePicPage'
import ApproveCakePage from './ApproveCakePage'

type EditProfileModalProps = InjectedModalProps

const pageTitle = {
  [Pages.START]: { id: 999, label: 'Edit Profile' },
  [Pages.CHANGE]: { id: 999, label: 'Change Profile Pic' },
  [Pages.REMOVE]: { id: 999, label: 'Remove Profile Pic' },
  [Pages.APPROVE]: { id: 999, label: 'Approve CAKE' },
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ onDismiss }) => {
  const { currentPage, goToChange, goToRemove, goToApprove, goPrevious } = useEditProfile()
  const TranslateString = useI18n()
  const { id, label } = pageTitle[currentPage]

  const isStartPage = currentPage === Pages.START
  const handleBack = isStartPage ? null : () => goPrevious()

  return (
    <Modal title={TranslateString(id, label)} onBack={handleBack} onDismiss={onDismiss} hideCloseButton={!isStartPage}>
      <div style={{ maxWidth: '400px' }}>
        {currentPage === Pages.START && (
          <StartPage goToApprove={goToApprove} goToChange={goToChange} goToRemove={goToRemove} onDismiss={onDismiss} />
        )}
        {currentPage === Pages.REMOVE && <RemovePage onDismiss={onDismiss} />}
        {currentPage === Pages.CHANGE && <ChangeProfilePicPage onDismiss={onDismiss} />}
        {currentPage === Pages.APPROVE && <ApproveCakePage goToChange={goToChange} onDismiss={onDismiss} />}
      </div>
    </Modal>
  )
}

export default EditProfileModal
