import { ChainId } from '@pancakeswap/chains'
import { createContext, useCallback, useMemo, useState } from 'react'
import { CampaignRewardType, CampaignStateType } from 'views/DashboardCampaignEdit/context/type'
import { CompletionStatus } from 'views/DashboardQuestEdit/type'

interface EditCampaignContextType {
  state: CampaignStateType
  updateValue: (key: string, value: string | Date | CampaignRewardType | any) => void
}

export const CampaignEditContext = createContext<EditCampaignContextType | undefined>(undefined)

export const CampaignEditProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<CampaignStateType>(() => ({
    chainId: ChainId.BSC,
    completionStatus: CompletionStatus.DRAFTED,
    title: '',
    description: '',
    thumbnail: {
      id: '',
      url: '',
    },
    startDate: null,
    startTime: null,
    endDate: null,
    endTime: null,
    pickedQuests: [],
    reward: undefined,
  }))

  const updateValue = useCallback((key: string, value: string | Date | any) => {
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
