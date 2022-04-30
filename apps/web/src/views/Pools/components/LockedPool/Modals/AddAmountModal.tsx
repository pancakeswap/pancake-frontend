import { useState, useCallback } from 'react'
import { Modal, Box, MessageText, Message, Checkbox, Flex, Text } from '@pancakeswap/uikit'
import _noop from 'lodash/noop'
import { useTranslation } from 'contexts/Localization'
import BigNumber from 'bignumber.js'
import _toNumber from 'lodash/toNumber'

import useTheme from 'hooks/useTheme'
import { useBUSDCakeAmount } from 'hooks/useBUSDPrice'
import { getBalanceNumber, getDecimalAmount, getBalanceAmount } from 'utils/formatBalance'

import RoiCalculatorModalProvider from './RoiCalculatorModalProvider'

import BalanceField from '../Common/BalanceField'
import LockedBodyModal from '../Common/LockedModalBody'
import Overview from '../Common/Overview'
import { AddAmountModalProps } from '../types'

const RenewDuration = ({ setCheckedState, checkedState }) => {
  const { t } = useTranslation()

  return (
    <>
      {!checkedState && (
        <Message variant="warning" mb="16px">
          <MessageText>
            {t(
              'Adding more CAKE will renew your lock, setting it to remaining duration. Due to shorter lock period, benefits decrease. To keep similar benefits, extend your lock.',
            )}
          </MessageText>
        </Message>
      )}
      <Flex alignItems="center">
        <Checkbox checked={checkedState} onChange={() => setCheckedState((prev) => !prev)} scale="sm" />
        <Text ml="8px" color="text">
          {t('Renew and extend your lock to keep similar benefits.')}
        </Text>
      </Flex>
    </>
  )
}

const AddAmountModal: React.FC<AddAmountModalProps> = ({
  onDismiss,
  currentBalance,
  currentLockedAmount,
  stakingToken,
  passedDuration,
  remainingDuration,
  lockEndTime,
  stakingTokenBalance,
}) => {
  const { theme } = useTheme()
  const [lockedAmount, setLockedAmount] = useState('0')
  const [checkedState, setCheckedState] = useState(false)
  const { t } = useTranslation()
  const lockedAmountAsBigNumber = new BigNumber(lockedAmount)
  const totalLockedAmount: number = getBalanceNumber(
    currentLockedAmount.plus(getDecimalAmount(lockedAmountAsBigNumber)),
  )
  const currentLockedAmountAsBalance = getBalanceAmount(currentLockedAmount)

  const usdValueStaked = useBUSDCakeAmount(lockedAmountAsBigNumber.toNumber())
  const usdValueNewStaked = useBUSDCakeAmount(totalLockedAmount)

  const prepConfirmArg = useCallback(
    () => ({
      finalDuration: checkedState ? passedDuration : 0,
    }),
    [checkedState, passedDuration],
  )

  const customOverview = useCallback(
    () => (
      <Overview
        isValidDuration
        openCalculator={_noop}
        duration={remainingDuration}
        newDuration={checkedState ? passedDuration + remainingDuration : null}
        lockedAmount={currentLockedAmountAsBalance.toNumber()}
        newLockedAmount={totalLockedAmount}
        usdValueStaked={usdValueNewStaked}
        lockEndTime={lockEndTime}
      />
    ),
    [
      remainingDuration,
      checkedState,
      currentLockedAmountAsBalance,
      passedDuration,
      totalLockedAmount,
      usdValueNewStaked,
      lockEndTime,
    ],
  )

  return (
    <RoiCalculatorModalProvider lockedAmount={lockedAmount}>
      <Modal
        style={{ maxWidth: '420px' }}
        title={t('Add CAKE')}
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
            stakingTokenBalance={stakingTokenBalance}
          />
        </Box>
        <LockedBodyModal
          currentBalance={currentBalance}
          stakingToken={stakingToken}
          onDismiss={onDismiss}
          lockedAmount={lockedAmountAsBigNumber}
          editAmountOnly={<RenewDuration checkedState={checkedState} setCheckedState={setCheckedState} />}
          prepConfirmArg={prepConfirmArg}
          customOverview={customOverview}
        />
      </Modal>
    </RoiCalculatorModalProvider>
  )
}

export default AddAmountModal
