import { useState, useMemo, useEffect } from 'react'
import { Modal, Box } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import { VaultKey } from 'state/types'
import { getBalanceNumber, getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { useTranslation } from '@pancakeswap/localization'
import BigNumber from 'bignumber.js'
import { GenericModalProps } from '../types'
import BalanceField from '../Common/BalanceField'
import LockedBodyModal from '../Common/LockedModalBody'
import RoiCalculatorModalProvider from './RoiCalculatorModalProvider'
import { useCheckVaultApprovalStatus } from '../../../hooks/useApprove'

const LockedStakeModal: React.FC<React.PropsWithChildren<GenericModalProps>> = ({
  onDismiss,
  currentBalance,
  stakingToken,
  stakingTokenPrice,
  stakingTokenBalance,
  customLockAmount,
  customLockWeekInSeconds,
}) => {
  const { theme } = useTheme()
  const [lockedAmount, setLockedAmount] = useState('')
  const { t } = useTranslation()

  useEffect(() => {
    if (customLockAmount) {
      setLockedAmount(customLockAmount)
    }
  }, [customLockAmount])

  const usdValueStaked = useMemo(
    () =>
      getBalanceNumber(
        getDecimalAmount(new BigNumber(lockedAmount), stakingToken.decimals).multipliedBy(stakingTokenPrice),
        stakingToken.decimals,
      ),
    [lockedAmount, stakingTokenPrice, stakingToken.decimals],
  )

  const { allowance } = useCheckVaultApprovalStatus(VaultKey.CakeVault)
  const needApprove = useMemo(() => {
    const amount = getDecimalAmount(new BigNumber(lockedAmount))
    return amount.gt(allowance)
  }, [allowance, lockedAmount])

  return (
    <RoiCalculatorModalProvider lockedAmount={lockedAmount}>
      <Modal title={t('Lock CAKE')} onDismiss={onDismiss} headerBackground={theme.colors.gradientCardHeader}>
        <Box mb="16px">
          <BalanceField
            stakingAddress={stakingToken.address}
            stakingSymbol={stakingToken.symbol}
            stakingDecimals={stakingToken.decimals}
            lockedAmount={lockedAmount}
            usdValueStaked={usdValueStaked}
            stakingMax={currentBalance}
            setLockedAmount={setLockedAmount}
            stakingTokenBalance={stakingTokenBalance}
            needApprove={needApprove}
          />
        </Box>
        <LockedBodyModal
          currentBalance={currentBalance}
          stakingToken={stakingToken}
          stakingTokenPrice={stakingTokenPrice}
          onDismiss={onDismiss}
          lockedAmount={new BigNumber(lockedAmount)}
          customLockWeekInSeconds={customLockWeekInSeconds}
        />
      </Modal>
    </RoiCalculatorModalProvider>
  )
}

export default LockedStakeModal
