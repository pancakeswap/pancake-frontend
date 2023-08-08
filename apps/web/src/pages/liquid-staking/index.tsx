// import { useTranslation } from '@pancakeswap/localization'
// import { ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import { useState, useCallback, useEffect, useMemo } from 'react'
import { AppBody } from 'components/App'
import { ChainId } from '@pancakeswap/sdk'
import Page from 'views/Page'
import { LiquidStakingPageStake } from 'views/LiquidStaking/Stake'
import { LiquidStakingFAQs } from 'views/LiquidStaking/components/FAQs'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { LiquidStakingList } from 'views/LiquidStaking/constants/types'
import { useLiquidStakingList } from 'views/LiquidStaking/hooks/useLiquidStakingList'
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
  const liquidStakingList = useLiquidStakingList()

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
      {/* <ButtonMenu
        mb="32px"
        scale="sm"
        activeIndex={selectedTypeIndex}
        onItemClick={(index) => setSelectedTypeIndex(index)}
        variant="subtle"
      >
        <ButtonMenuItem>{t('Stake')}</ButtonMenuItem>
        <ButtonMenuItem>{t('Unstake')}</ButtonMenuItem>
        <ButtonMenuItem>{t('History')}</ButtonMenuItem>
      </ButtonMenu> */}
      <AppBody mb="24px">
        <LiquidStakingPageStake
          selectedList={selectedList}
          optionsList={optionsList}
          handleSortOptionChange={handleSortOptionChange}
        />
        {/* {ACTIONS.STAKE === selectedTypeIndex && <LiquidStakingPageStake />}
        {ACTIONS.HISTORY === selectedTypeIndex && <LiquidStakingPageHistory />} */}
      </AppBody>
      <AppBody>
        <LiquidStakingFAQs config={selectedList?.FAQs} />
      </AppBody>
    </Page>
  )
}

LiquidStakingPage.chains = [ChainId.ETHEREUM, ChainId.BSC, ChainId.BSC_TESTNET, ChainId.GOERLI]

export default LiquidStakingPage
