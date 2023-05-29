import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/sdk'
import { usePublicNodeWaitForTransaction } from 'hooks/usePublicNodeWaitForTransaction'
import { AutoRow, Box, Modal, ModalV2, UseModalV2Props } from '@pancakeswap/uikit'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import GlobalSettings from 'components/Menu/GlobalSettings'
import { SettingsMode } from 'components/Menu/GlobalSettings/types'
import { useCurrency } from 'hooks/Tokens'
import { useRouter } from 'next/router'
import currencyId from 'utils/currencyId'
import { useCallback } from 'react'
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
  preferredSelectType = SELECTOR_TYPE.V3,
}: {
  currency0?: Currency
  currency1?: Currency
  feeAmount?: FeeAmount
  preferredSelectType?: SELECTOR_TYPE
} & UseModalV2Props) {
  const { t } = useTranslation()
  const router = useRouter()

  const [currencyIdA, currencyIdB] =
    typeof router.query.currency === 'string'
      ? [router.query.currency]
      : router.query.currency || [currency0 && currencyId(currency0), currency1 && currencyId(currency1)]

  const baseCurrency = useCurrency(currencyIdA)
  const quoteCurrency = useCurrency(currencyIdB)

  const { waitForTransaction } = usePublicNodeWaitForTransaction()

  const dismiss = useCallback(() => {
    onDismiss?.()
    setTimeout(() => {
      router.replace(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            currency: [],
            minPrice: [],
            maxPrice: [],
          },
        },
        undefined,
        {
          shallow: true,
        },
      )
    }, 600)
  }, [onDismiss, router])

  return (
    <ModalV2 isOpen={isOpen} onDismiss={dismiss} closeOnOverlayClick>
      <LiquidityFormProvider
        onAddLiquidityCallback={(hash: `0x${string}`) => {
          if (hash) {
            waitForTransaction({
              hash,
              chainId: currency0?.chainId,
            }).then(() => {
              dismiss()
            })
          } else {
            dismiss()
          }
        }}
      >
        <Modal
          bodyPadding="8px"
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
              preferredSelectType={preferredSelectType}
              preferredFeeAmount={feeAmount}
            />
          </Box>
        </Modal>
      </LiquidityFormProvider>
    </ModalV2>
  )
}
