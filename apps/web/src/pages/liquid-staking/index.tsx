// import { useTranslation } from '@pancakeswap/localization'
// import { ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import { AppBody } from 'components/App'
import { LIQUID_STAKING_SUPPORTED_CHAINS } from 'config/constants/supportChains'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { LiquidStakingPageStake } from 'views/LiquidStaking/Stake'
import { LiquidStakingFAQs } from 'views/LiquidStaking/components/FAQs'
import { LiquidStakingList } from 'views/LiquidStaking/constants/types'
import { useLiquidStakingList } from 'views/LiquidStaking/hooks/useLiquidStakingList'
import Page from 'views/Page'
// import { LiquidStakingPageHistory } from 'views/LiquidStaking/History'

// enum ACTIONS {
//   STAKE = 0,
//   UNSTAKE = 1,
//   HISTORY = 2,
// }

export interface OptionProps extends LiquidStakingList {
  label: string
  value: string
}

const LiquidStakingPage = () => {
  // const [selectedTypeIndex, setSelectedTypeIndex] = useState(ACTIONS.STAKE)
  const { chainId } = useActiveChainId()
  const { data: liquidStakingList, isFetching } = useLiquidStakingList()

  const initState = useMemo(
    () => ({
      ...liquidStakingList?.[0],
      label: liquidStakingList?.[0]?.stakingSymbol ?? '',
      value: liquidStakingList?.[0]?.contract ?? '',
    }),
    [liquidStakingList],
  )

  // NOTE: default is ETH
  const [selectedList, setSelectedList] = useState<OptionProps>(initState)

  const optionsList = useMemo(() => {
    return (
      liquidStakingList?.map((i) => ({
        ...i,
        label: i.stakingSymbol,
        value: i.contract,
      })) ?? []
    )
  }, [liquidStakingList])

  const handleSortOptionChange = useCallback((option) => setSelectedList(option), [])

  useEffect(() => {
    if (initState) {
      setSelectedList(initState)
    }
  }, [chainId, initState])

  return (
    <Page>
      <AppBody mb="24px">
        {selectedList.token0 && selectedList.token1 ? (
          <LiquidStakingPageStake
            selectedList={selectedList}
            optionsList={optionsList}
            handleSortOptionChange={handleSortOptionChange}
          />
        ) : null}
      </AppBody>
      <AppBody>
        <LiquidStakingFAQs config={selectedList?.FAQs} />
      </AppBody>
    </Page>
  )
}

LiquidStakingPage.chains = LIQUID_STAKING_SUPPORTED_CHAINS

export default LiquidStakingPage
