import { useTranslation } from '@pancakeswap/localization'
import { Flex, Modal, ModalV2 } from '@pancakeswap/uikit'
import { useState } from 'react'

interface ModalConfig {
  title: string
  hideCloseButton?: boolean
  closeOnOverlayClick?: boolean
}

export enum QuestEditModalState {
  DEFAULT,
  LOADING,
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

  const config = {
    [QuestEditModalState.DEFAULT]: {
      title: isPublish ? t('Publish the quest') : t('Schedule the quest'),
      closeOnOverlayClick: true,
    },
    [QuestEditModalState.LOADING]: {
      title: isPublish ? t('Publishing the quest...') : t('Scheduling the quest...'),
      hideCloseButton: true,
    },
    [QuestEditModalState.FINISHED]: {
      title: isPublish ? t('The quest has been published') : t('The quest has been scheduled'),
      closeOnOverlayClick: true,
    },
  } as { [key in number]: ModalConfig }

  //   if (isError) {
  //     setModalView(QuestEditModalState.DEFAULT)
  //   }

  return (
    <ModalV2
      isOpen={openModal}
      closeOnOverlayClick={config[modalView].closeOnOverlayClick}
      onDismiss={() => setOpenModal(false)}
    >
      <Modal title={config[modalView].title} hideCloseButton={config[modalView].hideCloseButton}>
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          width={['100%', '100%', '100%', '380px']}
        >
          213
        </Flex>
      </Modal>
    </ModalV2>
  )
}
