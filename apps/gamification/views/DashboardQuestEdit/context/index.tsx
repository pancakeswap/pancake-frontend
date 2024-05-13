import { useActiveChainId } from 'hooks/useActiveChainId'
import { createContext, useCallback, useMemo, useState } from 'react'
import { TaskConfigType } from 'views/DashboardQuestEdit/context/types'

export interface StateType {
  title: string
  body: string
  amountPerWinner: string
  startDate: null | Date
  startTime: null | Date
  endDate: null | Date
  endTime: null | Date
}

interface EditQuestContextType {
  state: StateType
  tasks: TaskConfigType[]
  updateValue: (key: string, value: string | Date) => void
  onTasksChange: (task: TaskConfigType[]) => void
  deleteTask: (value: string) => void
}

export const QuesEditContext = createContext<EditQuestContextType | undefined>(undefined)

export const QuestEditProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { chainId } = useActiveChainId()
  const [tasks, setTasks] = useState<TaskConfigType[]>([])
  const [fieldsState, setFieldsState] = useState<{ [key: string]: boolean }>({})
  const [state, setState] = useState<StateType>(() => ({
    title: '',
    body: '',
    amountPerWinner: '',
    startDate: null,
    startTime: null,
    endDate: null,
    endTime: null,
  }))

  const updateValue = useCallback((key: string, value: string | Date) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }))

    // Keep track of what fields the user has attempted to edit
    setFieldsState((prevFieldsState) => ({
      ...prevFieldsState,
      [key]: true,
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

  return <QuesEditContext.Provider value={providerValue}>{children}</QuesEditContext.Provider>
}
