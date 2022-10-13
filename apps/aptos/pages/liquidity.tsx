import { useTranslation } from '@pancakeswap/localization'
import Page from 'components/Layout/Page'
import { Liquidity as LiquidityUI } from '@pancakeswap/uikit'
import HasAccount from 'components/HasAccount'
import { ExchangeLayout } from 'components/Layout/ExchangeLayout'
import LiquidityList from 'components/Liquidity/components/LiquidityList'

const { LiquidityCard, GotoAddLiquidityButton, LiquidityNotConnect } = LiquidityUI

const LiquidityPage = () => {
  const { t } = useTranslation()

  return (
    <Page>
      <LiquidityCard>
        <LiquidityCard.Header title={t('Your Liquidity')} subtitle={t('Remove liquidity to receive tokens back')} />
        <LiquidityCard.ListBody>
          <HasAccount fallbackComp={<LiquidityNotConnect />}>
            <LiquidityList />
          </HasAccount>
        </LiquidityCard.ListBody>
        <LiquidityCard.Footer>
          <GotoAddLiquidityButton />
        </LiquidityCard.Footer>
      </LiquidityCard>
    </Page>
  )
}

LiquidityPage.Layout = ExchangeLayout

export default LiquidityPage
