import { useTranslation } from '@pancakeswap/localization'

import { Swap as SwapUI, Liquidity as LiquidityUI } from '@pancakeswap/uikit'
import HasAccount from 'components/HasAccount'
import LiquidityList from 'components/Liquidity/components/LiquidityList'

const { Page } = SwapUI

const { LiquidityCard, GotoAddLiquidityButton, LiquidityNotConnect } = LiquidityUI

const LiquidityPage = () => {
  const { t } = useTranslation()

  return (
    <Page helpUrl="https://docs.pancakeswap.finance/products/pancakeswap-exchange" isEvm={false}>
      <LiquidityCard>
        <LiquidityCard.Header title={t('Your Liquidity')} subtitle={t('Remove liquidity to receive tokens back')} />
        <HasAccount fallbackComp={<LiquidityNotConnect />}>
          <LiquidityList />
        </HasAccount>
        <LiquidityCard.Footer>
          <GotoAddLiquidityButton />
        </LiquidityCard.Footer>
      </LiquidityCard>
    </Page>
  )
}

export default LiquidityPage
