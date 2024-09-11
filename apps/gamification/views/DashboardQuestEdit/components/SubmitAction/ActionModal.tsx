import { useTranslation } from '@pancakeswap/localization'
import { Flex, Modal, ModalV2 } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Fail } from 'views/DashboardQuestEdit/components/SubmitAction/Fail'
import { Finished } from 'views/DashboardQuestEdit/components/SubmitAction/Finished'
import { Loading } from 'views/DashboardQuestEdit/components/SubmitAction/Loading'
import { SingleQuestData } from 'views/DashboardQuestEdit/hooks/useGetSingleQuestData'
import { CompletionStatus } from 'views/DashboardQuestEdit/type'
import { Quest } from 'views/Quests/components/Quest'

interface ModalConfig {
  title: string
  hideCloseButton?: boolean
  closeOnOverlayClick?: boolean
  component?: JSX.Element
}

export enum QuestEditModalState {
  LOADING,
  FAILED,
  FINISHED,
}

interface ActionModalProps {
  openModal: boolean
  isSubmitError: boolean
  needAddReward: boolean
  quest: SingleQuestData
  handleSave: () => Promise<void>
  setOpenModal: (val: boolean) => void
}

export const ActionModal: React.FC<ActionModalProps> = ({
  quest,
  isSubmitError,
  needAddReward,
  openModal,
  handleSave,
  setOpenModal,
}) => {
  const { t } = useTranslation()
  const router = useRouter()
  const isFirstTimeRef = useRef(true)
  const [modalView, setModalView] = useState<QuestEditModalState>(QuestEditModalState.LOADING)

  const handleSubmit = useCallback(async () => {
    setModalView(QuestEditModalState.LOADING)
    try {
      await handleSave()
      if (isSubmitError) {
        setModalView(QuestEditModalState.FAILED)
      } else {
        setModalView(QuestEditModalState.FINISHED)
      }
    } catch (e) {
      setModalView(QuestEditModalState.FAILED)
    }
  }, [handleSave, isSubmitError])

  useEffect(() => {
    const fetchSubmit = async () => {
      isFirstTimeRef.current = false
      await handleSubmit()
    }

    if (isFirstTimeRef.current) {
      fetchSubmit()
    }
  }, [handleSubmit])

  const finishedQuest: SingleQuestData = {
    ...quest,
    completionStatus: CompletionStatus.SCHEDULED,
  }
  const questComponent = <Quest mb="24px" width="100%" quest={quest} showStatus hideClick />
  const finishedComponent = <Quest mb="24px" width="100%" quest={finishedQuest} showStatus hideClick />

  const closeModal = () => {
    setOpenModal(false)
  }

  const handleFinished = () => {
    closeModal()
    router.push('/dashboard')
  }

  const title = needAddReward ? t('Add a reward and schedule') : t('Schedule the quest')
  const config = {
    [QuestEditModalState.LOADING]: {
      title,
      hideCloseButton: true,
      component: <Loading title={t('Please wait...')} />,
    },
    [QuestEditModalState.FAILED]: {
      title: t('Scheduling failed'),
      closeOnOverlayClick: true,
      component: (
        <Fail closeModal={closeModal} handleSubmit={handleSubmit}>
          {questComponent}
        </Fail>
      ),
    },
    [QuestEditModalState.FINISHED]: {
      title: t('The quest has been scheduled'),
      hideCloseButton: true,
      component: (
        <Finished
          title={
            needAddReward
              ? t('The quest has been successfully scheduled and the reward has been added!')
              : t('The quest has been successfully scheduled!')
          }
          closeModal={handleFinished}
        >
          {finishedComponent}
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
