import { useTranslation } from '@pancakeswap/localization'
import {
  Box,
  Button,
  CalenderIcon,
  DeleteOutlineIcon,
  Flex,
  Message,
  MessageText,
  PencilIcon,
  useModal,
  useToast,
} from '@pancakeswap/uikit'
import { useQueryClient } from '@tanstack/react-query'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { styled } from 'styled-components'
import { ActionModal } from 'views/DashboardQuestEdit/components/SubmitAction/ActionModal'
import { LongPressDeleteModal } from 'views/DashboardQuestEdit/components/SubmitAction/LongPressDeleteModal'
import { useQuestEdit } from 'views/DashboardQuestEdit/context/useQuestEdit'
import { CompletionStatus } from 'views/DashboardQuestEdit/type'
import { combineDateAndTime } from 'views/DashboardQuestEdit/utils/combineDateAndTime'
import { validateIsNotEmpty } from 'views/DashboardQuestEdit/utils/validateFormat'
import { verifyTask } from 'views/DashboardQuestEdit/utils/verifyTask'

const StyledDeleteButton = styled(Button)`
  color: ${({ theme }) => theme.colors.failure};
  border-color: ${({ theme }) => theme.colors.failure};
`

const StyledOutlineButton = styled(Button)`
  background-color: transparent !important;
`

export const SubmitAction = () => {
  const { t } = useTranslation()
  const { chainId, account } = useActiveWeb3React()
  const { query, push } = useRouter()
  const { toastSuccess, toastError } = useToast()
  const { state, tasks, isChanged } = useQuestEdit()
  const [openModal, setOpenModal] = useState(false)
  const [isSubmitError, setIsSubmitError] = useState(false)
  const completionStatusToString = state.completionStatus.toString()
  const queryClient = useQueryClient()

  const handleClickDelete = async () => {
    if (query?.id) {
      try {
        const response = await fetch(`/api/dashboard/quest-delete?id=${query?.id}`, { method: 'DELETE' })

        if (response.ok) {
          toastSuccess(t('Deleted!'))
          push('/dashboard')
        }
      } catch (error) {
        console.error('Delete quest error: ', error)
      }
    }
  }
  console.log(state?.reward)

  const [onPresentDeleteModal] = useModal(
    <LongPressDeleteModal targetTitle={t('quest')} handleDelete={handleClickDelete} />,
  )

  // eslint-disable-next-line consistent-return
  const handleSave = async (isCreate: boolean, completionStatus: CompletionStatus) => {
    try {
      setIsSubmitError(false)
      const url = isCreate ? `/api/dashboard/quest-create` : `/api/dashboard/quest-update?id=${query?.id}`
      const method = isCreate ? 'POST' : 'PUT'

      const apiChainId = isCreate ? chainId : state.chainId
      const { startDate, startTime, endDate, endTime } = state
      const startDateTime = startDate && startTime ? combineDateAndTime(startDate, startTime) ?? 0 : 0
      const endDateTime = endDate && endTime ? combineDateAndTime(endDate, endTime) ?? 0 : 0

      if (startDateTime > 0 && endDateTime > 0 && startDateTime > endDateTime) {
        setOpenModal(false)
        toastError(t('The end time must be longer than the start time.'))
        return undefined
      }

      const response = await fetch(url, {
        method,
        body: JSON.stringify({
          ...state,
          orgId: account?.toLowerCase(),
          tasks: tasks?.length > 0 ? tasks.map((i, index) => ({ ...i, orderNumber: index })) : [],
          chainId: apiChainId,
          startDateTime,
          endDateTime,
          completionStatus,
        }),
      })

      if (!response.ok) {
        return setIsSubmitError(true)
      }

      queryClient.invalidateQueries({
        queryKey: ['fetch-single-quest-dashboard-data', query.id],
      })
      toastSuccess(t('Submit Successfully!'))

      if (state.completionStatus === CompletionStatus.SCHEDULED || completionStatus !== CompletionStatus.SCHEDULED) {
        push('/dashboard')
      }
    } catch (error) {
      setIsSubmitError(true)
      console.error('Submit quest  error: ', error)
    }
  }

  const isTaskValid = useMemo(() => {
    if (tasks?.length > 0) {
      return tasks.map((i) => verifyTask(i)).every((element) => element === true)
    }

    return true
  }, [tasks])

  const isAbleToSave = useMemo(() => isChanged && isTaskValid, [isChanged, isTaskValid])

  const isAbleToSchedule = useMemo(() => {
    const { title, description, startDate, startTime, endDate, endTime, reward } = state
    return (
      !validateIsNotEmpty(title) &&
      !validateIsNotEmpty(description) &&
      startDate &&
      startTime &&
      endDate &&
      endTime &&
      reward &&
      reward?.amountOfWinners > 0 &&
      reward?.totalRewardAmount > 0 &&
      isTaskValid
    )
  }, [state, isTaskValid])

  return (
    <Flex flexDirection="column" mt="30px">
      {openModal && (
        <ActionModal
          quest={{
            ...state,
            tasks,
            startDateTime: combineDateAndTime(state.startDate, state.startTime) ?? 0,
            endDateTime: combineDateAndTime(state.endDate, state.endTime) ?? 0,
          }}
          isSubmitError={isSubmitError}
          openModal={openModal}
          setOpenModal={setOpenModal}
          handleSave={() => handleSave(Boolean(!query.id), CompletionStatus.SCHEDULED)}
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

      {completionStatusToString !== CompletionStatus.FINISHED &&
        completionStatusToString !== CompletionStatus.ONGOING && (
          <>
            <>
              {completionStatusToString === CompletionStatus.SCHEDULED ? (
                <Button
                  mb="8px"
                  width="100%"
                  variant="secondary"
                  disabled={!isAbleToSchedule}
                  onClick={() => handleSave(false, CompletionStatus.DRAFTED)}
                >
                  {t('Move to the drafts')}
                </Button>
              ) : (
                <StyledOutlineButton
                  mb="8px"
                  width="100%"
                  variant="secondary"
                  disabled={!isAbleToSchedule}
                  endIcon={
                    <CalenderIcon color={isAbleToSchedule ? 'primary' : 'textDisabled'} width={20} height={20} />
                  }
                  onClick={() => setOpenModal(true)}
                >
                  {t('Save and schedule')}
                </StyledOutlineButton>
              )}
            </>
            <Button
              width="100%"
              disabled={!isAbleToSave}
              endIcon={<PencilIcon color={isAbleToSave ? 'invertedContrast' : 'textDisabled'} width={14} height={14} />}
              onClick={() =>
                handleSave(Boolean(!query.id), query.id ? state.completionStatus : CompletionStatus.DRAFTED)
              }
            >
              {query.id ? t('Save the edits') : t('Save to the drafts')}
            </Button>
          </>
        )}

      {completionStatusToString === CompletionStatus.DRAFTED && (
        <Box mt="16px">
          {isAbleToSchedule ? (
            <Message variant="success">
              <MessageText>{t('You have everything ready to be scheduled!')}</MessageText>
            </Message>
          ) : (
            <Message variant="primary">
              <MessageText>
                {t('To fill the page:')}
                <ul>
                  {validateIsNotEmpty(state.title) && <li>{t('Enter title')}</li>}
                  {validateIsNotEmpty(state.description) && <li>{t('Enter description')}</li>}
                  {(!state.startDate || !state.startTime || !state.endDate || !state.endTime) && (
                    <li>{t('Select timeline')}</li>
                  )}
                  {(state?.reward === undefined ||
                    state?.reward?.amountOfWinners === 0 ||
                    state?.reward?.totalRewardAmount === 0) && <li>{t('Add reward')}</li>}
                  {tasks?.length === 0 && <li>{t('Add at least 1 task')}</li>}
                  {tasks?.length > 0 && !isTaskValid && <li>{t('Fill all tasks')}</li>}
                </ul>
              </MessageText>
            </Message>
          )}
        </Box>
      )}
    </Flex>
  )
}
