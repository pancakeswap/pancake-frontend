import { useTranslation } from '@pancakeswap/localization'
import { Button, CalenderIcon, DeleteOutlineIcon, Flex, PencilIcon, useModal, useToast } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { ActionModal } from 'views/DashboardCampaignEdit/components/SubmitAction/ActionModal'
import { ConfirmDeleteModal } from 'views/DashboardQuestEdit/components/ConfirmDeleteModal'
import { CompletionStatus } from 'views/DashboardQuestEdit/type'
// import { useQuestEdit } from 'views/DashboardQuestEdit/context/useQuestEdit'
// import { combineDateAndTime, convertDateAndTime } from 'views/DashboardQuestEdit/utils/combineDateAndTime'

export const SubmitAction = () => {
  const { t } = useTranslation()
  const { query, push } = useRouter()
  const { toastSuccess } = useToast()
  // const { state } = useQuestEdit()
  const disabled = true

  const [openModal, setOpenModal] = useState(false)
  const [isPublish, setIsPublish] = useState(false)

  const handleClickDelete = () => {
    console.log(query.id)

    setTimeout(() => {
      toastSuccess(t('Deleted!'))
      push('/dashboard/campaign')
    }, 3000)
  }

  const [onPresentDeleteModal] = useModal(<ConfirmDeleteModal handleDelete={handleClickDelete} />)

  const handleClick = (publish: boolean) => {
    console.log('CompletionStatus', CompletionStatus.ONGOING)
    // const { startDate, startTime, endDate, endTime } = state
    // const startDateTime = combineDateAndTime(startDate, startTime) || 0
    // const endDateTime = combineDateAndTime(endDate, endTime) || 0

    setOpenModal(true)
    setIsPublish(publish)
  }

  return (
    <Flex flexDirection="column" mt="30px">
      {openModal && <ActionModal openModal={openModal} isPublish={isPublish} setOpenModal={setOpenModal} />}
      {query.id && (
        <Button
          width="100%"
          mb="8px"
          variant="secondary"
          endIcon={<DeleteOutlineIcon color="primary" width={20} height={20} />}
          onClick={onPresentDeleteModal}
        >
          {t('Delete')}
        </Button>
      )}
      <Button width="100%" variant="secondary" endIcon={<PencilIcon color="primary" width={14} height={14} />}>
        {t('Save to the drafts')}
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
        endIcon={<CalenderIcon color="invertedContrast" width={20} height={20} />}
        onClick={() => handleClick(true)}
      >
        {t('Public schedule')}
      </Button>
    </Flex>
  )
}
