import { useState } from 'react'
import { Modal, Box } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'

import useTheme from 'hooks/useTheme'
import { useBUSDCakeAmount } from 'hooks/useBUSDPrice'
import { getBalanceNumber } from 'utils/formatBalance'

import BalanceField from '../Common/BalanceField'
import LockedBodyModal from '../Common/LockedModalBody'

interface LockedStakeModalProps {
  onDismiss?: () => void
  stakingToken: any
  currentBalance: BigNumber
}

const LockedStakeModal: React.FC<LockedStakeModalProps> = ({ onDismiss, currentBalance, stakingToken }) => {
  const { theme } = useTheme()
  const [lockedAmount, setLockedAmount] = useState(0)

  const usdValueStaked = useBUSDCakeAmount(lockedAmount)

  return (
    <Modal title="Lock CAKE" onDismiss={onDismiss} headerBackground={theme.colors.gradients.cardHeader}>
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
        currentBalance={getBalanceNumber(currentBalance)}
        stakingToken={stakingToken}
        onDismiss={onDismiss}
        lockedAmount={lockedAmount}
      />
    </Modal>
  )
}

export default LockedStakeModal
