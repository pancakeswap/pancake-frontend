import { useTranslation } from '@pancakeswap/localization'
import { Button, CalenderIcon, DeleteOutlineIcon, Flex, PencilIcon, useModal, useToast } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { styled } from 'styled-components'
import { ConfirmDeleteModal } from 'views/DashboardQuestEdit/components/ConfirmDeleteModal'
import { ActionModal } from 'views/DashboardQuestEdit/components/SubmitAction/ActionModal'
import { useQuestEdit } from 'views/DashboardQuestEdit/context/useQuestEdit'
import { combineDateAndTime } from 'views/DashboardQuestEdit/utils/combineDateAndTime'

const StyledDeleteButton = styled(Button)`
  color: ${({ theme }) => theme.colors.failure};
  border-color: ${({ theme }) => theme.colors.failure};
`

export const SubmitAction = () => {
  const { t } = useTranslation()
  const { query, push } = useRouter()
  const { toastSuccess } = useToast()
  const { state } = useQuestEdit()
  const [openModal, setOpenModal] = useState(false)

  const handleClick = () => {
    setOpenModal(true)
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
      {openModal && <ActionModal openModal={openModal} setOpenModal={setOpenModal} handleSave={handleSave} />}
      {query.id && (
        <StyledDeleteButton
          mb="8px"
          width="100%"
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
