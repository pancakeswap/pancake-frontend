import { useActiveChainId } from 'hooks/useActiveChainId'
import { createContext, useCallback, useMemo, useState } from 'react'
import { QuestRewardType, StateType, TaskConfigType } from 'views/DashboardQuestEdit/context/types'
import { CompletionStatus } from 'views/DashboardQuestEdit/type'

interface EditQuestContextType {
  isChanged: boolean
  state: StateType
  tasks: TaskConfigType[]
  updateAllState: (value: StateType, task: TaskConfigType[]) => void
  updateValue: (key: string, value: string | Date | QuestRewardType | boolean) => void
  onTasksChange: (task: TaskConfigType[]) => void
  deleteTask: (value: string) => void
}

export const QuestEditContext = createContext<EditQuestContextType | undefined>(undefined)

export const QuestEditProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { chainId } = useActiveChainId()
  const [isChanged, setIsChanged] = useState<boolean>(false)
  const [tasks, setTasks] = useState<TaskConfigType[]>([])
  const [state, setState] = useState<StateType>(() => ({
    id: '',
    orgId: '',
    chainId,
    completionStatus: CompletionStatus.DRAFTED,
    title: '',
    description: '',
    startDate: null,
    startTime: null,
    endDate: null,
    endTime: null,
    reward: undefined,
    rewardSCAddress: '',
    ownerAddress: '',
    needAddReward: true,

    // For api return
    startDateTime: 0,
    endDateTime: 0,
    numberOfParticipants: 0,
  }))

  const updateAllState = useCallback(
    (stateData: StateType, task: TaskConfigType[]) => {
      setState({ ...state, ...stateData })
      setTasks(task)
    },
    [state],
  )

  const updateValue = useCallback((key: string, value: string | Date | QuestRewardType | boolean) => {
    setIsChanged(true)
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }))
  }, [])

  // Task
  const onTasksChange = useCallback((newTasks: TaskConfigType[]) => {
    setIsChanged(true)
    setTasks(newTasks)
  }, [])

  const deleteTask = useCallback(
    (id: string) => {
      const forkTasks = Object.assign(tasks)
      const indexToRemove = forkTasks.findIndex((task: TaskConfigType) => id === task.sid)
      forkTasks.splice(indexToRemove, 1)
      onTasksChange([...forkTasks])
    },
    [onTasksChange, tasks],
  )

  const providerValue = useMemo(
    () => ({
      state,
      tasks,
      isChanged,
      updateValue,
      updateAllState,
      onTasksChange,
      deleteTask,
    }),
    [state, tasks, isChanged, updateValue, updateAllState, onTasksChange, deleteTask],
  )

  return <QuestEditContext.Provider value={providerValue}>{children}</QuestEditContext.Provider>
}
