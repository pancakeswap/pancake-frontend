import { createContext, useCallback, useMemo, useState } from 'react'

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
  updateValue: (key: string, value: string | Date) => void
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

  const providerValue = useMemo(
    () => ({
      state,
      updateValue,
    }),
    [state, updateValue],
  )

  return <QuesEditContext.Provider value={providerValue}>{children}</QuesEditContext.Provider>
}
