import { useTranslation } from '@pancakeswap/localization'
import { Button, CalenderIcon, DeleteOutlineIcon, Flex, PencilIcon, useModal, useToast } from '@pancakeswap/uikit'
import { GAMIFICATION_API } from 'config/constants/endpoints'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { styled } from 'styled-components'
import { ConfirmDeleteModal } from 'views/DashboardQuestEdit/components/ConfirmDeleteModal'
import { ActionModal } from 'views/DashboardQuestEdit/components/SubmitAction/ActionModal'
import { useQuestEdit } from 'views/DashboardQuestEdit/context/useQuestEdit'
import { CompletionStatus } from 'views/DashboardQuestEdit/type'
import { combineDateAndTime } from 'views/DashboardQuestEdit/utils/combineDateAndTime'
// import { verifyTask } from 'views/DashboardQuestEdit/utils/verifyTask'

const StyledDeleteButton = styled(Button)`
  color: ${({ theme }) => theme.colors.failure};
  border-color: ${({ theme }) => theme.colors.failure};
`

const FAKE_TOKEN = 'test-secret-key'

export const SubmitAction = () => {
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()
  const { query, push } = useRouter()
  const { toastSuccess } = useToast()
  const { state, tasks } = useQuestEdit()
  const [openModal, setOpenModal] = useState(false)
  const completionStatusToString = state.completionStatus.toString()

  const handleClick = () => {
    setOpenModal(true)
  }

  const handleClickDelete = async () => {
    try {
      const response = await fetch(`${GAMIFICATION_API}/quests/${query.id}/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-secure-token': FAKE_TOKEN },
      })

      if (response.ok) {
        toastSuccess(t('Deleted!'))
        push('/dashboard')
      }
    } catch (error) {
      console.error('Delete quest error: ', error)
    }
  }

  const [onPresentDeleteModal] = useModal(<ConfirmDeleteModal handleDelete={handleClickDelete} />)

  const handleSave = async (isCreate: boolean, completionStatus: CompletionStatus) => {
    try {
      const url = isCreate ? `${GAMIFICATION_API}/quests/create` : `${GAMIFICATION_API}/quests/${query.id}`
      const method = isCreate ? 'POST' : 'PUT'

      const apiChainId = isCreate ? chainId : state.chainId
      const { startDate, startTime, endDate, endTime } = state
      const startDateTime = combineDateAndTime(startDate, startTime) || 0
      const endDateTime = combineDateAndTime(endDate, endTime) || 0

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'x-secure-token': FAKE_TOKEN },
        body: JSON.stringify({
          ...state,
          tasks,
          chainId: apiChainId,
          startDateTime,
          endDateTime,
          completionStatus,
        }),
      })

      if (response.ok) {
        toastSuccess(t('Submit Successfully!'))
        // push('/dashboard')
      }
    } catch (error) {
      console.error('Submit quest  error: ', error)
    }
  }

  return (
    <Flex flexDirection="column" mt="30px">
      {openModal && (
        <ActionModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          handleSave={() => handleSave(Boolean(query.id), CompletionStatus.SCHEDULED)}
        />
      )}
      {query.id &&
        (completionStatusToString === CompletionStatus.DRAFTED ||
          completionStatusToString === CompletionStatus.SCHEDULED) && (
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

      {completionStatusToString !== CompletionStatus.FINISHED && (
        <>
          {completionStatusToString !== CompletionStatus.ONGOING && (
            <>
              {completionStatusToString === CompletionStatus.SCHEDULED ? (
                <Button
                  mb="8px"
                  width="100%"
                  variant="secondary"
                  onClick={() => handleSave(false, CompletionStatus.DRAFTED)}
                >
                  {t('Move to the drafts')}
                </Button>
              ) : (
                <Button
                  mb="8px"
                  width="100%"
                  variant="secondary"
                  endIcon={<CalenderIcon color="primary" width={20} height={20} />}
                  onClick={handleClick}
                >
                  {t('Save and schedule')}
                </Button>
              )}
            </>
          )}
          <Button
            width="100%"
            endIcon={<PencilIcon color="invertedContrast" width={14} height={14} />}
            onClick={() => handleSave(Boolean(!query.id), query.id ? state.completionStatus : CompletionStatus.DRAFTED)}
          >
            {query.id ? t('Save the edits') : t('Save to the drafts')}
          </Button>
        </>
      )}
    </Flex>
  )
}
