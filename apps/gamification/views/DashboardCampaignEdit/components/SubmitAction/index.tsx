import { useTranslation } from '@pancakeswap/localization'
import { Button, CalenderIcon, DeleteOutlineIcon, Flex, PencilIcon, useModal, useToast } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { styled } from 'styled-components'
import { ActionModal } from 'views/DashboardCampaignEdit/components/SubmitAction/ActionModal'
import { ConfirmDeleteModal } from 'views/DashboardQuestEdit/components/ConfirmDeleteModal'

// import { useQuestEdit } from 'views/DashboardQuestEdit/context/useQuestEdit'
// import { combineDateAndTime, convertDateAndTime } from 'views/DashboardQuestEdit/utils/combineDateAndTime'
const StyledDeleteButton = styled(Button)`
  color: ${({ theme }) => theme.colors.failure};
  border-color: ${({ theme }) => theme.colors.failure};
`

export const SubmitAction = () => {
  const { t } = useTranslation()
  const { query, push } = useRouter()
  const { toastSuccess } = useToast()
  // const { state } = useQuestEdit()

  const [openModal, setOpenModal] = useState(false)

  const handleClickDelete = () => {
    setTimeout(() => {
      toastSuccess(t('Deleted!'))
      push('/dashboard/campaign')
    }, 3000)
  }

  const [onPresentDeleteModal] = useModal(<ConfirmDeleteModal handleDelete={handleClickDelete} />)

  const handleClick = () => {
    // const { startDate, startTime, endDate, endTime } = state
    // const startDateTime = combineDateAndTime(startDate, startTime) || 0
    // const endDateTime = combineDateAndTime(endDate, endTime) || 0

    setOpenModal(true)
  }

  return (
    <Flex flexDirection="column" mt="30px">
      {openModal && <ActionModal openModal={openModal} setOpenModal={setOpenModal} />}
      {query.id && (
        <StyledDeleteButton
          width="100%"
          mb="8px"
          variant="secondary"
          endIcon={<DeleteOutlineIcon color="failure" width={20} height={20} />}
          onClick={onPresentDeleteModal}
        >
          {t('Delete')}
        </StyledDeleteButton>
      )}
      <Button width="100%" variant="secondary" endIcon={<PencilIcon color="primary" width={14} height={14} />}>
        {t('Save to the drafts')}
      </Button>
      <Button
        m="8px 0"
        width="100%"
        variant="secondary"
        endIcon={<CalenderIcon color="primary" width={20} height={20} />}
        onClick={handleClick}
      >
        {t('Save and schedule')}
      </Button>
    </Flex>
  )
}
