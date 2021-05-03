import React from 'react'
import { InjectedModalProps, Modal } from '@pancakeswap-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import useEditProfile, { Views } from './reducer'
import StartView from './StartView'
import PauseProfileView from './PauseProfileView'
import ChangeProfilePicView from './ChangeProfilePicView'
import ApproveCakeView from './ApproveCakeView'

type EditProfileModalProps = InjectedModalProps

const viewTitle = {
  [Views.START]: 'Edit Profile',
  [Views.CHANGE]: 'Change Profile Pic',
  [Views.REMOVE]: 'Remove Profile Pic',
  [Views.APPROVE]: 'Approve CAKE',
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ onDismiss }) => {
  const { currentView, goToChange, goToRemove, goToApprove, goPrevious } = useEditProfile()
  const { t } = useTranslation()
  const translationKey = viewTitle[currentView]

  const isStartView = currentView === Views.START
  const handleBack = isStartView ? null : () => goPrevious()

  return (
    <Modal title={t(translationKey)} onBack={handleBack} onDismiss={onDismiss} hideCloseButton={!isStartView}>
      <div style={{ maxWidth: '400px' }}>
        {currentView === Views.START && (
          <StartView goToApprove={goToApprove} goToChange={goToChange} goToRemove={goToRemove} onDismiss={onDismiss} />
        )}
        {currentView === Views.REMOVE && <PauseProfileView onDismiss={onDismiss} />}
        {currentView === Views.CHANGE && <ChangeProfilePicView onDismiss={onDismiss} />}
        {currentView === Views.APPROVE && <ApproveCakeView goToChange={goToChange} onDismiss={onDismiss} />}
      </div>
    </Modal>
  )
}

export default EditProfileModal
