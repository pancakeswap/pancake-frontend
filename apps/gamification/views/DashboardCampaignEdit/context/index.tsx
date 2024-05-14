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

interface EditCampaignContextType {
  state: StateType
  updateValue: (key: string, value: string | Date) => void
}

export const CampaignEditContext = createContext<EditCampaignContextType | undefined>(undefined)

export const CampaignEditProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
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
  }, [])

  const providerValue = useMemo(
    () => ({
      state,
      updateValue,
    }),
    [state, updateValue],
  )

  return <CampaignEditContext.Provider value={providerValue}>{children}</CampaignEditContext.Provider>
}
