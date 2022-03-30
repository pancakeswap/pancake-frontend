import { useState } from 'react'
import { Modal, Box } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'

import useTheme from 'hooks/useTheme'
import { useBUSDCakeAmount } from 'hooks/useBUSDPrice'
import { getBalanceNumber } from 'utils/formatBalance'

import BalanceField from './BalanceField'
import LockedBodyModal from './LockedBodyModal'

interface AddAmountModalProps {
  onDismiss?: () => void
  stakingToken: any
  currentBalance: BigNumber
}

const AddAmountModal: React.FC<AddAmountModalProps> = ({ onDismiss, currentBalance, stakingToken }) => {
  const { theme } = useTheme()
  const [lockedAmount, setLockedAmount] = useState(0)

  const usdValueStaked = useBUSDCakeAmount(lockedAmount)

  return (
    <Modal
      style={{ maxWidth: '420px' }}
      title="Lock CAKE"
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradients.cardHeader}
    >
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
        editAmountOnly
      />
    </Modal>
  )
}

export default AddAmountModal
