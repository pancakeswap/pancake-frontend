import { useTranslation } from '@pancakeswap/localization'
import { Flex, Modal, ModalV2 } from '@pancakeswap/uikit'
import { useState } from 'react'
import { Default } from 'views/DashboardQuestEdit/components/SubmitAction/Default'
import { Fail } from 'views/DashboardQuestEdit/components/SubmitAction/Fail'
import { Finished } from 'views/DashboardQuestEdit/components/SubmitAction/Finished'
import { Loading } from 'views/DashboardQuestEdit/components/SubmitAction/Loading'
import { Quest } from 'views/Quests/components/Quest'

interface ModalConfig {
  title: string
  hideCloseButton?: boolean
  closeOnOverlayClick?: boolean
  component?: JSX.Element
}

export enum QuestEditModalState {
  DEFAULT,
  LOADING,
  FAILED,
  FINISHED,
}

interface ActionModalProps {
  openModal: boolean
  isPublish: boolean
  setOpenModal: (val: boolean) => void
}

export const ActionModal: React.FC<ActionModalProps> = ({ isPublish, openModal, setOpenModal }) => {
  const { t } = useTranslation()
  const [modalView, setModalView] = useState<QuestEditModalState>(QuestEditModalState.DEFAULT)

  const questComponent = <Quest mb="24px" width="100%" showStatus hideClick />

  const closeModal = () => {
    setOpenModal(false)
  }

  const handleSubmit = () => {
    setModalView(QuestEditModalState.LOADING)

    setTimeout(() => {
      setModalView(QuestEditModalState.FINISHED)
    }, 3000)
  }

  const config = {
    [QuestEditModalState.DEFAULT]: {
      title: isPublish ? t('Publish the quest') : t('Schedule the quest'),
      closeOnOverlayClick: true,
      component: (
        <Default isPublish={isPublish} handleSubmit={handleSubmit}>
          {questComponent}
        </Default>
      ),
    },
    [QuestEditModalState.LOADING]: {
      title: isPublish ? t('Publishing the quest...') : t('Scheduling the quest...'),
      hideCloseButton: true,
      component: <Loading isPublish={isPublish}>{questComponent}</Loading>,
    },
    [QuestEditModalState.FAILED]: {
      title: isPublish ? t('Publishing failed') : t('Scheduling failed'),
      closeOnOverlayClick: true,
      component: (
        <Fail closeModal={closeModal} handleSubmit={handleSubmit}>
          {questComponent}
        </Fail>
      ),
    },
    [QuestEditModalState.FINISHED]: {
      title: isPublish ? t('The quest has been published') : t('The quest has been scheduled'),
      closeOnOverlayClick: true,
      component: (
        <Finished isPublish={isPublish} closeModal={closeModal}>
          {questComponent}
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
