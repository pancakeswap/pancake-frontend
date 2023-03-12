import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/sdk'
import { Box, Modal, ModalV2, UseModalV2Props } from '@pancakeswap/uikit'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import currencyId from 'utils/currencyId'
import AddLiquidityV3 from '.'
import LiquidityFormProvider from './formViews/V3FormView/form/LiquidityFormProvider'
import { SELECTOR_TYPE } from './types'

export function AddLiquidityV3Modal({
  token0,
  token1,
  isOpen,
  handleDismiss,
  feeAmount,
}: {
  token0: Currency
  token1: Currency
  feeAmount?: FeeAmount
} & UseModalV2Props) {
  const { t } = useTranslation()
  return (
    <ModalV2 isOpen={isOpen} onDismiss={handleDismiss} closeOnOverlayClick>
      <Modal title={t('Add Liquidity')}>
        <Box maxWidth="856px">
          <LiquidityFormProvider>
            <AddLiquidityV3
              currencyIdA={currencyId(token0)}
              currencyIdB={currencyId(token1)}
              preferredSelectType={SELECTOR_TYPE.V3}
              preferredFeeAmount={feeAmount}
            />
          </LiquidityFormProvider>
        </Box>
      </Modal>
    </ModalV2>
  )
}
