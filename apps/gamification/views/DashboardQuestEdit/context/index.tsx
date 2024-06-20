import { ChainId } from '@pancakeswap/chains'
import { createContext, useCallback, useMemo, useState } from 'react'
import { QuestRewardType, StateType, TaskConfigType } from 'views/DashboardQuestEdit/context/types'
import { CompletionStatus } from 'views/DashboardQuestEdit/type'

interface EditQuestContextType {
  state: StateType
  tasks: TaskConfigType[]
  updateValue: (key: string, value: string | Date | QuestRewardType) => void
  onTasksChange: (task: TaskConfigType[]) => void
  deleteTask: (value: string) => void
}

export const QuestEditContext = createContext<EditQuestContextType | undefined>(undefined)

export const QuestEditProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [tasks, setTasks] = useState<TaskConfigType[]>([])
  const [state, setState] = useState<StateType>(() => ({
    chainId: ChainId.BSC,
    completionStatus: CompletionStatus.DRAFTED,
    title: '',
    description: '',
    startDate: null,
    startTime: null,
    endDate: null,
    endTime: null,
    reward: undefined,
  }))

  const updateValue = useCallback((key: string, value: string | Date | QuestRewardType) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }))
  }, [])

  // Task
  const onTasksChange = (newTasks: TaskConfigType[]) => {
    setTasks(newTasks)
  }

  const deleteTask = useCallback(
    (id: string) => {
      const forkTasks = Object.assign(tasks)
      const indexToRemove = forkTasks.findIndex((task: TaskConfigType) => id === task.sid)
      forkTasks.splice(indexToRemove, 1)
      onTasksChange([...forkTasks])
    },
    [tasks],
  )

  const providerValue = useMemo(
    () => ({
      state,
      tasks,
      updateValue,
      onTasksChange,
      deleteTask,
    }),
    [state, tasks, deleteTask, updateValue],
  )

  return <QuestEditContext.Provider value={providerValue}>{children}</QuestEditContext.Provider>
}
