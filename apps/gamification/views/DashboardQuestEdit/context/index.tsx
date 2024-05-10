import { ChainId } from '@pancakeswap/chains'
import { createContext, useCallback, useMemo, useState } from 'react'
import { Address } from 'viem'
import { TaskType } from 'views/DashboardQuestEdit/type'

export interface StateType {
  title: string
  body: string
  amountPerWinner: string
  startDate: null | Date
  startTime: null | Date
  endDate: null | Date
  endTime: null | Date
}

// Swap
// - currency
// - minAmount

// Lottery
// - minAmount
// - fromRound,
// - toRound

// Add liquidity
// - network
// - lp address
// - minAmount

// - Social
// - social link

export interface Task {
  id: number
  type: TaskType
  minAmount?: 0
  fromRound?: 0
  toRound?: 0
  networkId?: ChainId
  lpAddress?: Address
  socialLink?: string
}

interface EditQuestContextType {
  state: StateType
  tasks: Task[]
  updateValue: (key: string, value: string | Date) => void
  onTasksChange: (task: Task[]) => void
}

export const QuesEditContext = createContext<EditQuestContextType | undefined>(undefined)

export const QuestEditProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
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
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 0,
      type: TaskType.MAKE_A_SWAP,
      minAmount: 0,
    },
    {
      id: 1,
      type: TaskType.PARTICIPATE_LOTTERY,
      minAmount: 0,
      fromRound: 0,
      toRound: 0,
    },
  ])

  const onTasksChange = (newTasks: Task[]) => {
    setTasks(newTasks)
  }

  const providerValue = useMemo(
    () => ({
      state,
      tasks,
      updateValue,
      onTasksChange,
    }),
    [state, tasks, updateValue],
  )

  return <QuesEditContext.Provider value={providerValue}>{children}</QuesEditContext.Provider>
}
