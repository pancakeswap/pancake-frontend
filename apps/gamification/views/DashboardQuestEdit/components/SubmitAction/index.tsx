import { useTranslation } from '@pancakeswap/localization'
import { Button, CalenderIcon, DeleteOutlineIcon, Flex, PencilIcon, useModal, useToast } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { ConfirmDeleteModal } from 'views/DashboardQuestEdit/components/ConfirmDeleteModal'
import { ActionModal } from 'views/DashboardQuestEdit/components/SubmitAction/ActionModal'
import { useQuestEdit } from 'views/DashboardQuestEdit/context/useQuestEdit'
import { combineDateAndTime } from 'views/DashboardQuestEdit/utils/combineDateAndTime'

export const SubmitAction = () => {
  const { t } = useTranslation()
  const { query, push } = useRouter()
  const { toastSuccess } = useToast()
  const { state } = useQuestEdit()
  const disabled = false
  const [openModal, setOpenModal] = useState(false)
  const [isPublish, setIsPublish] = useState(false)

  const handleClick = (publish: boolean) => {
    setOpenModal(true)
    setIsPublish(publish)
  }

  const handleClickDelete = () => {
    console.log(query.id)

    setTimeout(() => {
      toastSuccess(t('Deleted!'))
      push('/dashboard')
    }, 3000)
  }

  const [onPresentDeleteModal] = useModal(<ConfirmDeleteModal handleDelete={handleClickDelete} />)

  const handleSave = () => {
    const { startDate, startTime, endDate, endTime } = state
    const startDateTime = combineDateAndTime(startDate, startTime) || 0
    const endDateTime = combineDateAndTime(endDate, endTime) || 0

    console.log({ startDateTime, endDateTime })
  }

  return (
    <Flex flexDirection="column" mt="30px">
      {openModal && (
        <ActionModal openModal={openModal} isPublish={isPublish} setOpenModal={setOpenModal} handleSave={handleSave} />
      )}
      {query.id ? (
        <>
          <Button
            width="100%"
            variant="secondary"
            endIcon={<DeleteOutlineIcon color="primary" width={20} height={20} />}
            onClick={onPresentDeleteModal}
          >
            {t('Delete')}
          </Button>
          <Button
            m="8px 0"
            width="100%"
            variant="secondary"
            endIcon={<CalenderIcon color="primary" width={20} height={20} />}
            onClick={() => handleClick(false)}
          >
            {t('Save and schedule')}
          </Button>
          <Button
            width="100%"
            endIcon={<PencilIcon color="invertedContrast" width={14} height={14} />}
            onClick={() => handleClick(true)}
          >
            {t('Save to the drafts')}
          </Button>
        </>
      ) : (
        <Button
          width="100%"
          variant="secondary"
          disabled={disabled}
          onClick={() => handleClick(true)}
          endIcon={<PencilIcon color={disabled ? 'textDisabled' : 'primary'} width={14} height={14} />}
        >
          {t('Save to the drafts')}
        </Button>
      )}
    </Flex>
  )
}
