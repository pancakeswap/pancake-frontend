import { useState } from 'react'
import { Modal, Box, MessageText, Message, Checkbox, Flex, Text } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import _noop from 'lodash/noop'

import useTheme from 'hooks/useTheme'
import { useBUSDCakeAmount } from 'hooks/useBUSDPrice'
import { getBalanceNumber } from 'utils/formatBalance'

import BalanceField from './BalanceField'
import LockedBodyModal from './LockedBodyModal'
import Overview from './Overview'

const RenewDuration = ({ setCheckedState, checkedState }) => {
  return (
    <>
      {!checkedState && (
        <Message variant="warning" mb="16px">
          <MessageText>
            Adding more CAKE will renew your lock, setting it to remaining duration. Due to shorter lock period,
            benefits decrease. To keep similar benefits, extend your lock. Learn more
          </MessageText>
        </Message>
      )}
      <Flex alignItems="center">
        <Checkbox checked={checkedState} onChange={() => setCheckedState((prev) => !prev)} scale="sm" />
        <Text ml="8px" color="text">
          Renew and extend your lock to keep similar benefits.
        </Text>
      </Flex>
    </>
  )
}

interface AddAmountModalProps {
  onDismiss?: () => void
  stakingToken: any
  currentBalance: BigNumber
  currentLockedAmount: number
  passedDuration: number
  remainingDuration: number
}

const AddAmountModal: React.FC<AddAmountModalProps> = ({
  onDismiss,
  currentBalance,
  currentLockedAmount,
  stakingToken,
  passedDuration,
  remainingDuration,
}) => {
  const { theme } = useTheme()
  const [lockedAmount, setLockedAmount] = useState(0)
  const [checkedState, setCheckedState] = useState(false)

  const totalLockedAmount = Number(currentLockedAmount) + Number(lockedAmount)

  const usdValueStaked = useBUSDCakeAmount(lockedAmount)
  const usdValueNewStaked = useBUSDCakeAmount(totalLockedAmount)

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
        editAmountOnly={<RenewDuration checkedState={checkedState} setCheckedState={setCheckedState} />}
        prepConfirmArg={() => ({
          finalDuration: checkedState ? passedDuration : 0,
        })}
        customOverview={() => (
          <Overview
            isValidDuration
            openCalculator={_noop}
            duration={remainingDuration}
            newDuration={checkedState ? passedDuration + remainingDuration : 0}
            lockedAmount={currentLockedAmount}
            newLockedAmount={totalLockedAmount}
            usdValueStaked={usdValueNewStaked}
          />
        )}
      />
    </Modal>
  )
}

export default AddAmountModal
