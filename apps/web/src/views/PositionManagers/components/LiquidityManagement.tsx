import { memo, useCallback, useMemo, useState } from 'react'
import { Button } from '@pancakeswap/uikit'
import { BaseAssets } from '@pancakeswap/position-managers'
import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, Percent, Price } from '@pancakeswap/sdk'
import { FeeAmount } from '@pancakeswap/v3-sdk'

import { CardSection } from './CardSection'
import { AddLiquidity } from './AddLiquidity'
import { InnerCard } from './InnerCard'
import { StakedAssets } from './StakedAssets'
import { RemoveLiquidity } from './RemoveLiquidity'

interface Props {
  currencyA: Currency
  currencyB: Currency
  vaultName: string
  feeTier: FeeAmount

  assets?: BaseAssets
  price?: Price<Currency, Currency>

  // TODO: replace with needed returned information
  onAddLiquidity?: (amounts: CurrencyAmount<Currency>[]) => Promise<void>

  // TODO: replace with needed returned information
  onRemoveLiquidity?: (params: { assets: BaseAssets; percentage: Percent }) => Promise<void>
}

export const LiquidityManagement = memo(function LiquidityManagement({
  currencyA,
  currencyB,
  vaultName,
  feeTier,
  assets,
  price,
}: // onAddLiquidity,
// onRemoveLiquidity,
Props) {
  const { t } = useTranslation()
  const [addLiquidityModalOpen, setAddLiquidityModalOpen] = useState(false)
  const [removeLiquidityModalOpen, setRemoveLiquidityModalOpen] = useState(false)
  const hasStaked = useMemo(() => Boolean(assets?.position && price) || assets?.amounts?.length > 0, [assets, price])

  const showAddLiquidityModal = useCallback(() => setAddLiquidityModalOpen(true), [])
  const hideAddLiquidityModal = useCallback(() => setAddLiquidityModalOpen(false), [])

  const showRemoveLiquidityModal = useCallback(() => setRemoveLiquidityModalOpen(true), [])
  const hideRemoveLiquidityModal = useCallback(() => setRemoveLiquidityModalOpen(false), [])

  return (
    <>
      {hasStaked ? (
        <InnerCard>
          <StakedAssets
            currencyA={currencyA}
            currencyB={currencyB}
            assets={assets}
            price={price}
            onAdd={showAddLiquidityModal}
            onRemove={showRemoveLiquidityModal}
          />
        </InnerCard>
      ) : (
        <CardSection title={t('Start earning')}>
          <Button variant="primary" width="100%" onClick={showAddLiquidityModal}>
            {t('Add Liquidity')}
          </Button>
        </CardSection>
      )}
      <AddLiquidity
        vaultName={vaultName}
        feeTier={feeTier}
        isOpen={addLiquidityModalOpen}
        onDismiss={hideAddLiquidityModal}
        currencyA={currencyA}
        currencyB={currencyB}
      />
      <RemoveLiquidity
        isOpen={removeLiquidityModalOpen}
        onDismiss={hideRemoveLiquidityModal}
        assets={assets}
        vaultName={vaultName}
        feeTier={feeTier}
        currencyA={currencyA}
        currencyB={currencyB}
      />
    </>
  )
})
