import { useTranslation } from '@pancakeswap/localization'
import {
  Box,
  Button,
  CalenderIcon,
  CheckmarkCircleIcon,
  Flex,
  Loading,
  Modal,
  ModalV2,
  Text,
  VolumeIcon,
  useToast,
} from '@pancakeswap/uikit'
import { useState } from 'react'
import { Quest } from 'views/Quests/components/Quest'

interface ModalConfig {
  title: string
  buttonText?: string
  buttonIcon?: JSX.Element
  hideCloseButton?: boolean
  textInfo?: string
  icon?: JSX.Element
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
  const { toastError } = useToast()
  const [modalView, setModalView] = useState<QuestEditModalState>(QuestEditModalState.DEFAULT)

  const config = {
    [QuestEditModalState.DEFAULT]: {
      title: isPublish ? t('Publish the quest') : t('Schedule the quest'),
      closeOnOverlayClick: true,
      buttonIcon: isPublish ? (
        <VolumeIcon color="invertedContrast" width={20} height={20} />
      ) : (
        <CalenderIcon color="invertedContrast" width={20} height={20} />
      ),
      buttonText: isPublish ? t('Publish') : t('Schedule'),
    },
    [QuestEditModalState.LOADING]: {
      title: isPublish ? t('Publishing the quest...') : t('Scheduling the quest...'),
      hideCloseButton: true,
      icon: <Loading margin="auto auto 40px auto" width={64} height={64} color="secondary" />,
      textInfo: isPublish
        ? t('Wait while the quest is being published...')
        : t('Wait while the quest is being scheduled...'),
    },
    [QuestEditModalState.FINISHED]: {
      title: isPublish ? t('The quest has been published') : t('The quest has been scheduled'),
      closeOnOverlayClick: true,
      icon: <CheckmarkCircleIcon margin="auto auto 40px auto" width={64} height={64} color="primary" />,
      textInfo: isPublish
        ? t('The quest has been successfully published!')
        : t('The quest has been successfully scheduled!'),
    },
  } as { [key in number]: ModalConfig }

  const handleSubmit = () => {
    setModalView(QuestEditModalState.LOADING)

    setTimeout(() => {
      // toastError(isPublish ? t('Publish the quest fail!') : t('Schedule the quest fail!'))

      setModalView(QuestEditModalState.FINISHED)
    }, 3000)
  }

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
          maxWidth={['100%', '100%', '100%', '430px']}
        >
          {modalView === QuestEditModalState.DEFAULT && (
            <>
              {isPublish ? (
                <Box>
                  <Box mb="24px">
                    <Text as="span" bold color="textSubtle">
                      {t('The quest status will be set as “Ongoing”,')}
                    </Text>
                    <Text as="span" color="textSubtle" ml="4px">
                      {t('because the dates you entered when creating the quest are the same as the current ones.')}
                    </Text>
                  </Box>
                  <Box mb="24px">
                    <Text as="span" bold color="warning">
                      {t('You won’t be able to cancel the quest and withdraw the reward back.')}
                    </Text>
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Box mb="24px">
                    <Text as="span" bold color="textSubtle">
                      {t('The quest will be set as “Scheduled” and be only visible to you,')}
                    </Text>
                    <Text as="span" color="textSubtle" ml="4px">
                      {t(
                        'because the dates you entered when creating the quest are in the future. You can change or cancel it.',
                      )}
                    </Text>
                  </Box>
                  <Box mb="24px">
                    <Text as="span" bold color="textSubtle">
                      {t('When the dates will be met, the quest will be set as "Ongoing".')}
                    </Text>
                    <Text as="span" bold color="warning">
                      {t(
                        'You won’t be able to cancel the quest and withdraw the reward back once it is set as “Ongoing”.',
                      )}
                    </Text>
                  </Box>
                </Box>
              )}
            </>
          )}

          {modalView !== QuestEditModalState.DEFAULT && config[modalView].icon}

          <Quest mb="24px" width="100%" showStatus hideClick />

          {modalView !== QuestEditModalState.DEFAULT && (
            <Text bold color="textSubtle" mt="20px">
              {config[modalView].textInfo}
            </Text>
          )}

          {modalView === QuestEditModalState.DEFAULT && (
            <Button width="100%" endIcon={config[modalView].buttonIcon} onClick={handleSubmit}>
              {config[modalView].buttonText}
            </Button>
          )}
          {modalView === QuestEditModalState.FINISHED && (
            <Button mt="24px" width="100%" onClick={() => setOpenModal(false)}>
              {t('Nice!')}
            </Button>
          )}
        </Flex>
      </Modal>
    </ModalV2>
  )
}
