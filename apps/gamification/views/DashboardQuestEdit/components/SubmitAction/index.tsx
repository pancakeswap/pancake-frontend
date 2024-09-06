import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/sdk'
import {
  Box,
  Button,
  CalenderIcon,
  DeleteOutlineIcon,
  Flex,
  FlexGap,
  Message,
  MessageText,
  PencilIcon,
  useModal,
  useToast,
} from '@pancakeswap/uikit'
import { useQueryClient } from '@tanstack/react-query'
import { ADDRESS_ZERO } from 'config/constants'
import { GAMIFICATION_PUBLIC_DASHBOARD_API } from 'config/constants/endpoints'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useQuestRewardContract } from 'hooks/useContract'
import { useDashboardSiwe } from 'hooks/useDashboardSiwe'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { styled } from 'styled-components'
import { Address, encodePacked, keccak256, toHex } from 'viem'
import { AddRewardModal } from 'views/DashboardQuestEdit/components/Reward/AddRewardModal'
import { ActionModal } from 'views/DashboardQuestEdit/components/SubmitAction/ActionModal'
import { LongPressDeleteModal } from 'views/DashboardQuestEdit/components/SubmitAction/LongPressDeleteModal'
import { QuestRewardType } from 'views/DashboardQuestEdit/context/types'
import { useQuestEdit } from 'views/DashboardQuestEdit/context/useQuestEdit'
import { CompletionStatus, RewardType } from 'views/DashboardQuestEdit/type'
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
  const { state, tasks, isChanged, updateValue } = useQuestEdit()
  const [openModal, setOpenModal] = useState(false)
  const [isSubmitError, setIsSubmitError] = useState(false)
  const completionStatusToString = state?.completionStatus?.toString()
  const queryClient = useQueryClient()
  const { fetchWithSiweAuth } = useDashboardSiwe()
  const rewardContract = useQuestRewardContract(state.chainId)

  const handlePickedRewardToken = (currency: Currency, totalRewardAmount: string, amountOfWinners: number) => {
    const tokenAddress = currency?.isNative ? ADDRESS_ZERO : currency?.address
    const tokenChainId = currency?.chainId

    let rewardData: QuestRewardType = {
      title: '',
      description: '',
      rewardType: RewardType.TOKEN,
      currency: {
        address: tokenAddress,
        network: tokenChainId,
      },
      amountOfWinners,
      totalRewardAmount,
    }

    if (state.reward) {
      rewardData = {
        ...state.reward,
        totalRewardAmount,
        amountOfWinners,
        currency: {
          address: tokenAddress,
          network: tokenChainId,
        },
      }
    }

    updateValue('reward', rewardData)
    setOpenModal(true)
  }

  const [onPresentAddRewardModal] = useModal(
    <AddRewardModal state={state} handlePickedRewardToken={handlePickedRewardToken} />,
    true,
    true,
    'add-quest-reward-modal',
  )

  const handleClickDelete = async () => {
    if (query?.id) {
      try {
        if (!account) {
          throw new Error('Invalid message to sign')
        }

        const response = await fetchWithSiweAuth(`${GAMIFICATION_PUBLIC_DASHBOARD_API}/quests/${query?.id}/delete`, {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          toastSuccess(t('Deleted!'))
          push('/dashboard')
        }
      } catch (error) {
        console.error('Delete quest error: ', error)
      }
    }
  }

  const [onPresentDeleteModal] = useModal(
    <LongPressDeleteModal targetTitle={t('quest')} handleDelete={handleClickDelete} />,
  )

  // eslint-disable-next-line consistent-return
  const handleSave = async (isCreate: boolean, completionStatus: CompletionStatus) => {
    try {
      setIsSubmitError(false)
      if (!account) {
        throw new Error('Invalid message to sign')
      }

      const url = isCreate
        ? `${GAMIFICATION_PUBLIC_DASHBOARD_API}/quests/create`
        : `${GAMIFICATION_PUBLIC_DASHBOARD_API}/quests/${query?.id}/update`
      const method = isCreate ? 'POST' : 'PUT'

      const apiChainId = isCreate ? chainId : state.chainId
      const {
        id,
        title,
        description,
        startDate,
        startTime,
        endDate,
        endTime,
        needAddReward,
        reward,
        ownerAddress,
        rewardSCAddress,
        numberOfParticipants,
      } = state
      const startDateTime = startDate && startTime ? combineDateAndTime(startDate, startTime) ?? 0 : 0
      const endDateTime = endDate && endTime ? combineDateAndTime(endDate, endTime) ?? 0 : 0

      if (startDateTime > 0 && endDateTime > 0 && startDateTime > endDateTime) {
        setOpenModal(false)
        toastError(t('The end time must be longer than the start time.'))
        return undefined
      }

      if (endDateTime !== 0 && new Date().getTime() / 1000 > endDateTime) {
        setOpenModal(false)
        toastError(t('The end time must be longer than the current time.'))
        return undefined
      }

      const response = await fetchWithSiweAuth(url, {
        method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...(!isCreate && { id }),
          title,
          description,
          completionStatus,
          orgId: account?.toLowerCase(),
          tasks: tasks?.length > 0 ? tasks.map((i, index) => ({ ...i, orderNumber: index })) : [],
          reward: reward || {},
          chainId: apiChainId,
          startDateTime,
          endDateTime,
          numberOfParticipants,
          needAddReward,
          ownerAddress: isCreate ? account : ownerAddress,
          ...(rewardSCAddress && {
            rewardSCAddress,
          }),
        }),
      })

      const result = await response.json()

      if (result.error) {
        toastError(result.error)
        return setIsSubmitError(true)
      }

      queryClient.invalidateQueries({
        queryKey: ['fetch-single-quest-dashboard-data', account, chainId, query.id],
      })
      toastSuccess(t('Submit Successfully!'))

      const isSaveAndAddReward = isCreate && completionStatus === CompletionStatus.DRAFTED && needAddReward
      if (isSaveAndAddReward) {
        push(`/dashboard/quest/edit/${result.id}`)
      }

      if (
        !isSaveAndAddReward &&
        (state.completionStatus === CompletionStatus.SCHEDULED || completionStatus !== CompletionStatus.SCHEDULED)
      ) {
        push('/dashboard')
      }
    } catch (error) {
      setIsSubmitError(true)
      console.error('Submit quest  error: ', error)
      throw error
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
    const { id, title, description, startDate, startTime, endDate, endTime, needAddReward } = state
    return (
      (needAddReward ? id !== '' : true) &&
      !validateIsNotEmpty(title) &&
      !validateIsNotEmpty(description) &&
      startDate &&
      startTime &&
      endDate &&
      endTime &&
      isTaskValid &&
      tasks?.length > 0
    )
  }, [state, tasks, isTaskValid])

  const handleSchedule = async () => {
    if (state.needAddReward) {
      const id = keccak256(encodePacked(['bytes32', 'address'], [toHex(state.id), state.ownerAddress as Address]))
      try {
        const questInfo = await rewardContract.read.quests([id]) // [root, claimTime, totalWinners, totalClaimedWinners, organizer, rewardToken, totalReward, totalClaimedReward]
        const totalReward = questInfo?.[6] ?? 0

        if (totalReward > 0) {
          const rewardData: QuestRewardType = {
            title: '',
            description: '',
            rewardType: RewardType.TOKEN,
            currency: {
              address: questInfo[5],
              network: state.chainId,
            },
            amountOfWinners: questInfo?.[2],
            totalRewardAmount: totalReward?.toString(),
          }

          updateValue('reward', rewardData)
          setOpenModal(true)
        } else {
          onPresentAddRewardModal()
        }
      } catch (error) {
        onPresentAddRewardModal()
        console.error('Error calling quests function:', error)
      }
    } else {
      setOpenModal(true)
    }
  }

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
          needAddReward={state.needAddReward}
          isSubmitError={isSubmitError}
          openModal={openModal}
          setOpenModal={setOpenModal}
          handleSave={() => handleSave(Boolean(!query.id), CompletionStatus.SCHEDULED)}
        />
      )}
      <FlexGap gap="8px" mb="8px">
        {query.id &&
          (completionStatusToString === CompletionStatus.DRAFTED ||
            completionStatusToString === CompletionStatus.SCHEDULED) && (
            <StyledDeleteButton
              width="100%"
              variant="secondary"
              endIcon={<DeleteOutlineIcon color="failure" width={20} height={20} />}
              onClick={onPresentDeleteModal}
            >
              {t('Delete')}
            </StyledDeleteButton>
          )}
        {completionStatusToString === CompletionStatus.DRAFTED && (
          <StyledOutlineButton
            width="100%"
            variant="secondary"
            disabled={!isAbleToSave}
            endIcon={<PencilIcon color={isAbleToSave ? 'primary' : 'textDisabled'} width={14} height={14} />}
            onClick={() => handleSave(Boolean(!query.id), query.id ? state.completionStatus : CompletionStatus.DRAFTED)}
          >
            {t('Save')}
          </StyledOutlineButton>
        )}
      </FlexGap>
      {completionStatusToString === CompletionStatus.DRAFTED && (
        <Button
          mb="8px"
          width="100%"
          disabled={!isAbleToSchedule}
          endIcon={
            <CalenderIcon color={isAbleToSchedule ? 'invertedContrast' : 'textDisabled'} width={20} height={20} />
          }
          onClick={handleSchedule}
        >
          {state.needAddReward ? t('Add a reward and schedule') : t('Save and schedule')}
        </Button>
      )}

      {completionStatusToString === CompletionStatus.DRAFTED && (
        <Box mt="16px">
          {isAbleToSchedule ? (
            <Message variant="success">
              <MessageText>{t('You have everything ready to be scheduled!')}</MessageText>
            </Message>
          ) : (
            <>
              {(validateIsNotEmpty(state.title) ||
                validateIsNotEmpty(state.description) ||
                !state.startDate ||
                !state.startTime ||
                !state.endDate ||
                !state.endTime ||
                tasks?.length === 0 ||
                !isTaskValid) && (
                <Message variant="primary">
                  <MessageText>
                    {t('To fill the page:')}
                    <ul>
                      {validateIsNotEmpty(state.title) && <li>{t('Enter title')}</li>}
                      {validateIsNotEmpty(state.description) && <li>{t('Enter description')}</li>}
                      {(!state.startDate || !state.startTime || !state.endDate || !state.endTime) && (
                        <li>{t('Select timeline')}</li>
                      )}
                      {tasks?.length === 0 && <li>{t('Add at least 1 task')}</li>}
                      {tasks?.length > 0 && !isTaskValid && <li>{t('Fill all tasks')}</li>}
                    </ul>
                  </MessageText>
                </Message>
              )}
            </>
          )}
        </Box>
      )}
    </Flex>
  )
}
