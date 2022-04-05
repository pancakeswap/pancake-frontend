import { useState } from 'react'
import { Modal, Box } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import { useBUSDCakeAmount } from 'hooks/useBUSDPrice'
import { useTranslation } from 'contexts/Localization'

import { GenericModalProps } from '../types'
import BalanceField from '../Common/BalanceField'
import LockedBodyModal from '../Common/LockedModalBody'

const LockedStakeModal: React.FC<GenericModalProps> = ({ onDismiss, currentBalance, stakingToken }) => {
  const { theme } = useTheme()
  const [lockedAmount, setLockedAmount] = useState('0')
  const { t } = useTranslation()

  const usdValueStaked = useBUSDCakeAmount(parseFloat(lockedAmount))

  return (
    <Modal title={t('Lock CAKE')} onDismiss={onDismiss} headerBackground={theme.colors.gradients.cardHeader}>
      <Box mb="16px">
        <BalanceField
          stakingAddress={stakingToken.address}
          stakingSymbol={stakingToken.symbol}
          stakingDecimals={stakingToken.decimals}
          lockedAmount={lockedAmount}
          usedValueStaked={usdValueStaked}
          stakingMax={currentBalance}
          setLockedAmount={setLockedAmount}
        />
      </Box>
      <LockedBodyModal
        currentBalance={currentBalance}
        stakingToken={stakingToken}
        onDismiss={onDismiss}
        lockedAmount={parseFloat(lockedAmount)}
      />
    </Modal>
  )
}

export default LockedStakeModal
