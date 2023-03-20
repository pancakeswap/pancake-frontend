import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/sdk'
import { Box, Modal, ModalV2, UseModalV2Props } from '@pancakeswap/uikit'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { useRouter } from 'next/router'
import currencyId from 'utils/currencyId'
import AddLiquidityV3 from '.'
import LiquidityFormProvider from './formViews/V3FormView/form/LiquidityFormProvider'
import { SELECTOR_TYPE } from './types'

export function AddLiquidityV3Modal({
  token0,
  token1,
  isOpen,
  onDismiss,
  feeAmount,
}: {
  token0: Currency
  token1: Currency
  feeAmount?: FeeAmount
} & UseModalV2Props) {
  const { t } = useTranslation()
  const router = useRouter()

  const [currencyIdA, currencyIdB] = router.query.currency || [currencyId(token0), currencyId(token1)]

  return (
    <ModalV2
      isOpen={isOpen}
      onDismiss={() => {
        router.replace(
          {
            pathname: router.pathname,
            query: {
              ...router.query,
              currency: [],
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
      <Modal title={t('Add Liquidity')}>
        <Box maxWidth="856px">
          <LiquidityFormProvider>
            <AddLiquidityV3
              currencyIdA={currencyIdA}
              currencyIdB={currencyIdB}
              preferredSelectType={SELECTOR_TYPE.V3}
              preferredFeeAmount={feeAmount}
            />
          </LiquidityFormProvider>
        </Box>
      </Modal>
    </ModalV2>
  )
}
