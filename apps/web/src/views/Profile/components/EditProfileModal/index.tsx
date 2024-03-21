import { ContextApi, useTranslation } from '@pancakeswap/localization'
import { InjectedModalProps, Modal } from '@pancakeswap/uikit'
import ApproveCakeView from './ApproveCakeView'
import ChangeProfilePicView from './ChangeProfilePicView'
import PauseProfileView from './PauseProfileView'
import StartView from './StartView'
import useEditProfile, { Views } from './reducer'

interface EditProfileModalProps extends InjectedModalProps {
  onSuccess?: () => void
}

const viewTitle = (t: ContextApi['t'], currentView: Views) => {
  switch (currentView) {
    case Views.START:
      return t('Edit Profile')
    case Views.CHANGE:
      return t('Change Profile Pic')
    case Views.REMOVE:
      return t('Remove Profile Pic')
    case Views.APPROVE:
      return t('Enable CAKE')
    default:
      return ''
  }
}

const EditProfileModal: React.FC<React.PropsWithChildren<EditProfileModalProps>> = ({ onDismiss, onSuccess }) => {
  const { currentView, goToChange, goToRemove, goToApprove, goPrevious } = useEditProfile()
  const { t } = useTranslation()

  const isStartView = currentView === Views.START
  const handleBack = isStartView ? undefined : () => goPrevious()

  return (
    <Modal
      title={viewTitle(t, currentView)}
      onBack={handleBack}
      onDismiss={onDismiss}
      hideCloseButton={!isStartView}
      bodyAlignItems="center"
    >
      <div style={{ maxWidth: '400px' }}>
        {currentView === Views.START && (
          <StartView goToApprove={goToApprove} goToChange={goToChange} goToRemove={goToRemove} onDismiss={onDismiss} />
        )}
        {currentView === Views.REMOVE && <PauseProfileView onDismiss={onDismiss} onSuccess={onSuccess} />}
        {currentView === Views.CHANGE && <ChangeProfilePicView onDismiss={onDismiss} onSuccess={onSuccess} />}
        {currentView === Views.APPROVE && <ApproveCakeView goToChange={goToChange} onDismiss={onDismiss} />}
      </div>
    </Modal>
  )
}

export default EditProfileModal
