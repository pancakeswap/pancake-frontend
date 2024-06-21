import { ChainId } from '@pancakeswap/chains'
import { createContext, useCallback, useMemo, useState } from 'react'
import { QuestRewardType, StateType, TaskConfigType } from 'views/DashboardQuestEdit/context/types'
import { CompletionStatus } from 'views/DashboardQuestEdit/type'

interface EditQuestContextType {
  isChanged: boolean
  state: StateType
  tasks: TaskConfigType[]
  updateAllState: (value: StateType) => void
  updateValue: (key: string, value: string | Date | QuestRewardType) => void
  onTasksChange: (task: TaskConfigType[]) => void
  deleteTask: (value: string) => void
}

export const QuestEditContext = createContext<EditQuestContextType | undefined>(undefined)

export const QuestEditProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isChanged, setIsChanged] = useState<boolean>(false)
  const [tasks, setTasks] = useState<TaskConfigType[]>([])
  const [state, setState] = useState<StateType>(() => ({
    orgId: '',
    chainId: ChainId.BSC,
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

    // For api return
    startDateTime: 0,
    endDateTime: 0,
  }))

  const updateAllState = useCallback((stateData: StateType) => {
    setState(stateData)
  }, [])

  const updateValue = useCallback((key: string, value: string | Date | QuestRewardType) => {
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
