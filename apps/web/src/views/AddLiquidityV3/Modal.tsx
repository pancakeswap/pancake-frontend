import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/sdk'
import { AutoRow, Box, Modal, ModalV2, UseModalV2Props } from '@pancakeswap/uikit'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import GlobalSettings from 'components/Menu/GlobalSettings'
import { SettingsMode } from 'components/Menu/GlobalSettings/types'
import { useCurrency } from 'hooks/Tokens'
import { useRouter } from 'next/router'
import currencyId from 'utils/currencyId'
import { AprCalculator } from './components/AprCalculator'
import { UniversalAddLiquidity } from '.'
import LiquidityFormProvider from './formViews/V3FormView/form/LiquidityFormProvider'
import { SELECTOR_TYPE } from './types'

export function AddLiquidityV3Modal({
  currency0,
  currency1,
  isOpen,
  onDismiss,
  feeAmount,
}: {
  currency0: Currency
  currency1: Currency
  feeAmount?: FeeAmount
} & UseModalV2Props) {
  const { t } = useTranslation()
  const router = useRouter()

  const [currencyIdA, currencyIdB] = router.query.currency || [currencyId(currency0), currencyId(currency1)]

  const baseCurrency = useCurrency(currencyIdA)
  const quoteCurrency = useCurrency(currencyIdB)

  return (
    <ModalV2
      isOpen={isOpen}
      onDismiss={() => {
        router.replace(
          {
            pathname: router.pathname,
            query: {
              ...router.query,
              // it seems like using `[]` will remove the query param, but null does not
              currency: [],
              maxPrice: [],
              minPrice: [],
            },
          },
          undefined,
          {
            shallow: true,
          },
        )
        onDismiss?.()
      }}
      closeOnOverlayClick
    >
      <LiquidityFormProvider>
        <Modal
          title={t('Add Liquidity')}
          headerRightSlot={
            <AutoRow width="auto" gap="8px">
              <AprCalculator
                baseCurrency={baseCurrency}
                quoteCurrency={quoteCurrency}
                feeAmount={feeAmount}
                showTitle={false}
              />
              <GlobalSettings mode={SettingsMode.SWAP_LIQUIDITY} />
            </AutoRow>
          }
        >
          <Box maxWidth="856px">
            <UniversalAddLiquidity
              currencyIdA={currencyIdA}
              currencyIdB={currencyIdB}
              preferredSelectType={SELECTOR_TYPE.V3}
              preferredFeeAmount={feeAmount}
            />
          </Box>
        </Modal>
      </LiquidityFormProvider>
    </ModalV2>
  )
}
