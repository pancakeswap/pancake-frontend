import { useTranslation } from '@pancakeswap/localization'
import { Flex, Modal, ModalV2 } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Default } from 'views/DashboardCampaignEdit/components/SubmitAction/Default'
import { Fail } from 'views/DashboardQuestEdit/components/SubmitAction/Fail'
import { Finished } from 'views/DashboardQuestEdit/components/SubmitAction/Finished'
import { Loading } from 'views/DashboardQuestEdit/components/SubmitAction/Loading'
// import { Quest } from 'views/Quests/components/Quest'

interface ModalConfig {
  title: string
  hideCloseButton?: boolean
  closeOnOverlayClick?: boolean
  component?: JSX.Element
}

export enum EditModalState {
  DEFAULT,
  LOADING,
  FAILED,
  FINISHED,
}

interface ActionModalProps {
  openModal: boolean
  setOpenModal: (val: boolean) => void
}

export const ActionModal: React.FC<ActionModalProps> = ({ openModal, setOpenModal }) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [modalView, setModalView] = useState<EditModalState>(EditModalState.DEFAULT)

  const component = null
  // const component = <Quest mb="24px" width="100%" showStatus hideClick />

  const closeModal = () => {
    setOpenModal(false)
  }

  const handleSubmit = () => {
    setModalView(EditModalState.LOADING)

    setTimeout(() => {
      setModalView(EditModalState.FINISHED)
    }, 3000)
  }

  const handleFinished = () => {
    closeModal()
    router.push('/dashboard/campaign')
  }

  const config = {
    [EditModalState.DEFAULT]: {
      title: t('Schedule the campaign'),
      closeOnOverlayClick: true,
      component: <Default handleSubmit={handleSubmit}>{component}</Default>,
    },
    [EditModalState.LOADING]: {
      title: t('Scheduling the campaign...'),
      hideCloseButton: true,
      component: <Loading title={t('Wait while the campaign is being scheduled...')}>{component}</Loading>,
    },
    [EditModalState.FAILED]: {
      title: t('Scheduling failed'),
      closeOnOverlayClick: true,
      component: (
        <Fail closeModal={closeModal} handleSubmit={handleSubmit}>
          {component}
        </Fail>
      ),
    },
    [EditModalState.FINISHED]: {
      title: t('The campaign has been scheduled'),
      closeOnOverlayClick: true,
      component: (
        <Finished title={t('The campaign has been successfully scheduled!')} closeModal={handleFinished}>
          {component}
        </Finished>
      ),
    },
  } as { [key in number]: ModalConfig }

  return (
    <ModalV2 isOpen={openModal} closeOnOverlayClick={config[modalView].closeOnOverlayClick} onDismiss={closeModal}>
      <Modal title={config[modalView].title} hideCloseButton={config[modalView].hideCloseButton}>
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          maxWidth={['100%', '100%', '100%', '430px']}
        >
          {config[modalView].component}
        </Flex>
      </Modal>
    </ModalV2>
  )
}
