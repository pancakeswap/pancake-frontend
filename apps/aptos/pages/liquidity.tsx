import { useTranslation } from '@pancakeswap/localization'
import { Liquidity as LiquidityUI } from '@pancakeswap/uikit'
import HasAccount from 'components/HasAccount'
import { ExchangeLayout } from 'components/Layout/ExchangeLayout'
import { PageMeta } from 'components/Layout/Page'
import LiquidityList from 'components/Liquidity/components/LiquidityList'
import { SettingsButton } from 'components/Menu/Settings/SettingsButton'
import { SettingsMode } from 'components/Menu/Settings/types'

const { LiquidityCard, GotoAddLiquidityButton, LiquidityNotConnect } = LiquidityUI

const LiquidityPage = () => {
  const { t } = useTranslation()

  return (
    <>
      <PageMeta title={t('Liquidity')} />
      <LiquidityCard>
        <LiquidityCard.Header
          title={t('Your Liquidity')}
          subtitle={t('Remove liquidity to receive tokens back')}
          config={<SettingsButton mode={SettingsMode.SWAP_LIQUIDITY} />}
        />
        <LiquidityCard.ListBody>
          <HasAccount fallbackComp={<LiquidityNotConnect />}>
            <LiquidityList />
          </HasAccount>
        </LiquidityCard.ListBody>
        <LiquidityCard.Footer>
          <GotoAddLiquidityButton />
        </LiquidityCard.Footer>
      </LiquidityCard>
    </>
  )
}

LiquidityPage.Layout = ExchangeLayout

export default LiquidityPage
